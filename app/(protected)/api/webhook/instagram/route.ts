import { findAutomation } from "@/actions/automation/queries";
import { getWorkflowState } from "@/actions/webhook/state";
import {
  createChatHistory,
  getChatHistory,
  getKeywordAutomation,
  getKeywordPost,
  matchKeyword,
  trackResponse,
  saveActivityLog,
  updateMetrics,
} from "@/actions/webhook/queries";
import { client } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { getAgentByInstagramId } from "@/actions/agent";
import { checkFollowerStatus, sendCtaButton, sendDm, sendPrivateMessage, sendPublicCommentReply } from "@/lib/fetch";
import { generateGeminiResponse } from "@/lib/gemini";
import { followGateMiddleware, handleFollowVerification } from "@/actions/webhook/middleware";

import crypto from "crypto";

// Simple in-memory cache to prevent duplicate processing within a short window
const processedEventIds = new Set<string>();
const eventCleanupQueue: string[] = [];
const MAX_CACHE_SIZE = 1000;

// Simple rate limiter: Map<senderId, timestamp>
const senderRateLimit = new Map<string, number>();
const RATE_LIMIT_MS = 1000; // 1 second between responses per sender (prevent bursts but allow natural flow)

function isDuplicateEvent(id?: string) {
  if (!id) return false;
  if (processedEventIds.has(id)) return true;
  
  processedEventIds.add(id);
  eventCleanupQueue.push(id);
  
  if (eventCleanupQueue.length > MAX_CACHE_SIZE) {
    const oldest = eventCleanupQueue.shift();
    if (oldest) processedEventIds.delete(oldest);
  }
  return false;
}

function isRateLimited(senderId?: string) {
    if (!senderId) return false;
    const now = Date.now();
    const last = senderRateLimit.get(senderId);
    if (last && now - last < RATE_LIMIT_MS) return true;
    senderRateLimit.set(senderId, now);
    return false;
}

async function executeAutomation(
  automation: any,
  senderId: string,
  accountId: string,
  incomingText: string,
  token: string,
  commentEvent: any = null
) {
  try {
    const commenterUsername = commentEvent?.from?.username;
    
    // 1. DM Logic
    if (!commentEvent) {
      if (automation.listener?.listener === "MESSAGE") {
        console.log("📤 Sending Direct response...");
        const listener = automation.listener as any;
        const hasCtas = listener.ctasActive && listener.ctas && Array.isArray(listener.ctas) && listener.ctas.length > 0;
        
        const res = hasCtas 
          ? await sendCtaButton(accountId, senderId, listener.prompt, listener.ctas, token)
          : await sendDm(accountId, senderId, listener.prompt, token);

        if (res && (res.status === 200 || res.message_id)) {
          if (listener.isEndBlock) console.log("🏁 Automation reached an End Block.");
          
          Promise.all([
            trackResponse(automation.id, "DM"),
            saveActivityLog(automation.userId!, automation.id, `Sent ${hasCtas ? 'CTA' : 'DM'}: ${automation.name}`, "DM"),
            updateMetrics(automation.userId!, "DM")
          ]).catch(err => console.error("Post-DM error:", err));
          return true;
        }
      }

      if (automation.listener?.listener === "SMARTAI" && automation.User?.subscription?.plan === "PRO") {
        console.log("🤖 Generating AI DM response...");
        const smart_ai_message = await generateGeminiResponse(
          incomingText,
          `${automation.listener?.prompt}: Keep response short`
        );
        const response_text = smart_ai_message || "I'm sorry, I couldn't process that.";
        
        const [res] = await Promise.all([
          sendDm(accountId, senderId, response_text, token),
          client.$transaction([
            createChatHistory(automation.id, senderId, incomingText, accountId),
            createChatHistory(automation.id, accountId, response_text, senderId)
          ])
        ]);
        
        if (res.status === 200) {
          Promise.all([
            trackResponse(automation.id, "DM"),
            saveActivityLog(automation.userId!, automation.id, `AI Response sent`, "DM"),
            updateMetrics(automation.userId!, "DM")
          ]).catch(err => console.error("Post-AI DM error:", err));
          return true;
        }
      }
    }

    // 2. COMMENT Logic
    if (commentEvent) {
      const listener = automation.listener as any;
      const [smart_ai_message] = await Promise.all([
        listener?.listener === "SMARTAI" ? generateGeminiResponse(incomingText, `${listener?.prompt}: keep short`) : Promise.resolve(null)
      ]);
      
      const response_text = listener?.listener === "SMARTAI" 
        ? (smart_ai_message || "DMed you!") 
        : (listener?.prompt || "");
      
      // Use CTAs for the private message if active
      const hasCtas = listener?.ctasActive && listener?.ctas && Array.isArray(listener.ctas) && listener.ctas.length > 0;
      const final_res = await sendPrivateMessage(
        accountId, 
        commentEvent.id, 
        response_text, 
        token,
        hasCtas ? listener.ctas : undefined
      );

      if (listener && (listener.commentReplyType !== "SINGLE" || listener.commentReply)) {
        let public_reply = automation.listener.commentReply;
        if (automation.listener.commentReplyType === "MULTIPLE" && automation.listener.multipleCommentReplies.length > 0) {
          const replies = automation.listener.multipleCommentReplies;
          public_reply = replies[Math.floor(Math.random() * replies.length)];
        } else if (automation.listener.commentReplyType === "AI") {
          const ai_comment = await generateGeminiResponse(incomingText, `Generate a very short friendly reply to this comment: "${incomingText}". Mention the user by name: @${commenterUsername}`);
          public_reply = ai_comment || "Check your DMs! 🚀";
        }
        
        // Always mention the user in the public reply if username is available
        const mention = commenterUsername ? `@${commenterUsername} ` : "";
        const final_public_reply = public_reply ? `${mention}${public_reply}` : undefined;

        if (final_public_reply) {
          sendPublicCommentReply(commentEvent.id, final_public_reply, token).catch(() => {});
        }
      }

      if (final_res && final_res.status === 200) {
        Promise.all([
          trackResponse(automation.id, "COMMENT"),
          updateMetrics(automation.userId!, "COMMENT"),
          automation.listener?.listener === "SMARTAI" ? client.$transaction([
            createChatHistory(automation.id, senderId, incomingText, accountId),
            createChatHistory(automation.id, accountId, response_text, senderId)
          ]) : Promise.resolve()
        ]).catch(err => console.error("Post-comment error:", err));
        return true;
      }
    }
  } catch (error: any) {
    console.error("❌ executeAutomation FATAL ERROR:", error.response?.data || error.message || error);
  }
  return false;
}

function isValidSignature(req: NextRequest, body: Buffer) {
  const signature = req.headers.get("x-hub-signature-256");
  if (!signature) return true; 

  if (!process.env.INSTAGRAM_CLIENT_SECRET) {
     console.error("❌ ERROR: INSTAGRAM_CLIENT_SECRET is missing from environment variables.");
     return true; // Don't block during dev if secret is missing
  }

  try {
    const expectedSignature = crypto
      .createHmac("sha256", process.env.INSTAGRAM_CLIENT_SECRET)
      .update(body) 
      .digest("hex");

    const isValid = signature === `sha256=${expectedSignature}`;

    if (!isValid) {
      console.warn("⚠️ Webhook Signature Mismatch Details:");
      console.log("   Received (End):", signature?.slice(-8));
      console.log("   Expected (End):", expectedSignature.slice(-8));
      console.log("   Secret Used (Length):", process.env.INSTAGRAM_CLIENT_SECRET.length);
    }

    return isValid;
  } catch (error) {
    console.error("🔥 Signature Validation Internal Error:", error);
    return false;
  }
}

export async function GET(req: NextRequest) {
  const hub = req.nextUrl.searchParams.get("hub.challenge");
  const verifyToken = req.nextUrl.searchParams.get("hub.verify_token");

  // This matches what you'll enter into the Meta Dashboard
  if (verifyToken === "zeropilot_verify_token") {
    return new NextResponse(hub);
  }

  return new NextResponse('Invalid Token', { status: 403 });
}

export async function POST(req: NextRequest) {
  try {
    const buffer = Buffer.from(await req.arrayBuffer());
    const rawBody = buffer.toString("utf-8");
    const body = JSON.parse(rawBody);
    
    // 1. Security check: Validate Signature
    const signatureValid = isValidSignature(req, buffer);
    if (!signatureValid) {
       console.error("❌ SECURITY WARNING: Invalid Webhook Signature Header received");
       console.log("👉 Byte Length:", buffer.length);
       console.log("👉 Char Length:", rawBody.length);
    }

    const entry = body.entry?.[0];
    const messagingEvent = entry?.messaging?.[0];
    const commentEvent = entry?.changes?.[0]?.value;

    console.log("📨 Incoming Webhook:", {
      type: messagingEvent ? "MESSAGE" : "CHANGE",
      senderId: messagingEvent?.sender?.id || commentEvent?.from?.id,
      text: messagingEvent?.message?.text || commentEvent?.text,
      isEcho: messagingEvent?.message?.is_echo
    });

    // Determine Sender and Message Content
    const senderId = messagingEvent?.sender?.id || commentEvent?.from?.id;
    const incomingText = (messagingEvent?.message?.text || commentEvent?.text || "").trim();
    const quickReply = messagingEvent?.message?.quick_reply;
    // Idempotency: Always exit early if we've seen this exact MID or ID recently
    const eventId = messagingEvent?.message?.mid || commentEvent?.id;
    if (eventId && isDuplicateEvent(eventId)) {
       console.log("♻️ [IDEMPOTENCY] Skipping duplicate event:", eventId);
       return NextResponse.json({ message: "Duplicate" }, { status: 200 });
    }
    const postback = messagingEvent?.postback;
    const isEcho = messagingEvent?.message?.is_echo;
    const accountId = entry?.id;

    // 2. Early Skips
    if (isEcho) {
      console.log("🗣️ [SKIP] Echo message ignored");
      return NextResponse.json({ message: "Echo ignored" }, { status: 200 });
    }

    if (senderId === accountId) {
       console.log("🗣️ [SKIP] Bot self-event ignored");
       return NextResponse.json({ message: "Self-event ignored" }, { status: 200 });
    }

    if (!incomingText && !quickReply && !postback) {
       console.log("ℹ️ [SKIP] Non-text interaction (read receipt, delivery, reaction, or share)");
       return NextResponse.json({ message: "Non-text ignored" }, { status: 200 });
    }

    // 3. User-Level Rate Limiting
    if (senderId && isRateLimited(senderId)) {
        console.log("⏳ [RATE LIMIT] Throttling sender:", senderId);
        return NextResponse.json({ message: "Rate limit exceeded" }, { status: 200 });
    }

    // 4. HANDLE BUTTON CLICKS (Quick Reply or Postback)
    const payload = quickReply?.payload || postback?.payload;
    if (payload && payload.startsWith("FOLLOW_VERIFY_")) {
      console.log("👆 Follow Verification Clicked:", payload);
      const token = await client.integrations.findUnique({
        where: { instagramId: accountId },
        select: { token: true }
      });
      
      if (token?.token) {
        const result = await handleFollowVerification(senderId!, accountId!, token.token, payload);
        if (result.verified && result.automationId) {
           console.log("✅ Follow Verified! Resuming workflow...");
           const state = await getWorkflowState(senderId!);
           const automation = (await findAutomation(result.automationId)) as any;
           
           if (automation) {
              const listener = automation.listener as any;
              const successMsg = (listener?.customFollowerMessages && listener?.followerSuccessMessage) 
                ? listener.followerSuccessMessage 
                : "Thanks for following! 🚀 Resuming your request...";

              await sendDm(accountId!, senderId!, successMsg, token.token);
              
              // Resume the original automation
              await executeAutomation(
                automation, 
                senderId!, 
                accountId!, 
                state?.lastIncomingText || "", 
                token.token,
                null // Resume is always DM-based for follow gate
              );
              return NextResponse.json({ message: "Resumed" }, { status: 200 });
           }
        } else {
           const automationId = payload.replace("FOLLOW_VERIFY_", "");
           const automation = (await findAutomation(automationId)) as any;
           const listener = automation?.listener as any;
           
           const retryMsg = (listener?.customFollowerMessages && listener?.followerRetryMessage) 
             ? listener.followerRetryMessage 
             : "Still doesn't look like you're following. Please click the button again once you've followed us! 😊";

           await sendDm(accountId!, senderId!, retryMsg, token.token);
           return NextResponse.json({ message: "Retry sent" }, { status: 200 });
        }
      }
    }

    let matcher;
    if (incomingText) {
       console.log("🔍 Searching for keyword match...");
       matcher = (await matchKeyword(incomingText)) as any;
    }

    if (matcher && matcher.automationId) {
      const startMatch = Date.now();
      console.log("🤖 Keyword Match Found:", { word: matcher.word, automationId: matcher.automationId });
      const automation = (await getKeywordAutomation(matcher.automationId, messagingEvent ? true : false)) as any;
      console.log(`⏱️ DB Fetch took: ${Date.now() - startMatch}ms`);
      
      if (automation && automation.trigger) {
        // 🔑 Match the correct integration token for this specific account
        const integration = automation.User?.integrations.find((i: any) => i.instagramId === accountId) || automation.User?.integrations[0];
        const token = integration?.token;
        
        if (!token) {
           console.error("❌ ERROR: No valid access token found for account:", accountId);
           return NextResponse.json({ message: "No token" }, { status: 200 });
        }
        
        // Follow Gate Middleware Check
        const startGate = Date.now();
        const allowed = await followGateMiddleware(senderId!, accountId!, token, automation, incomingText, commentEvent?.id);
        console.log(`⏱️ Follow Gate took: ${Date.now() - startGate}ms. Allowed: ${allowed}`);
        if (!allowed) return NextResponse.json({ message: "Follow gate active" }, { status: 200 });

        const startExec = Date.now();
        const result = await executeAutomation(
          automation, 
          senderId!, 
          accountId!, 
          incomingText, 
          token,
          commentEvent
        );
        console.log(`⏱️ executeAutomation took: ${Date.now() - startExec}ms. Result: ${result}`);

        if (result) return NextResponse.json({ message: "Automation executed" }, { status: 200 });
      } else {
        console.log("⚠️ SKIPPING: Automation or trigger type (DM/Comment) mismatch or not found.");
      }
    }

    // 3. CONTINUED CHAT (Existing session)
    if (!matcher && messagingEvent) {
      const customer_history = await getChatHistory(messagingEvent.recipient.id, messagingEvent.sender.id) as any;
      if (customer_history.history.length > 0 && customer_history.automationId) {
        const automation = (await findAutomation(customer_history.automationId)) as any;
        if (automation?.User?.subscription?.plan === "PRO" && automation.listener?.listener === "SMARTAI") {
          const integration = automation.User?.integrations.find((i: any) => i.instagramId === accountId) || automation.User?.integrations[0];
          const token = integration?.token;
          
          if (token) {
             const smart_ai_message = await generateGeminiResponse(incomingText, `${automation.listener?.prompt}: Keep short\nContext: ${JSON.stringify(customer_history.history)}`);
             const response_text = smart_ai_message || "How can I help further?";
             
             const [res] = await Promise.all([
                sendDm(accountId!, senderId!, response_text, token),
                client.$transaction([
                   createChatHistory(automation.id, senderId!, incomingText, accountId!),
                   createChatHistory(automation.id, accountId!, response_text, senderId!)
                ])
             ]);

             if (res.status === 200) {
               updateMetrics(automation.userId!, "DM").catch(() => {});
               return NextResponse.json({ message: "Continued" }, { status: 200 });
             }
          }
        }
      }
    }

    // 4. GLOBAL AGENT FALLBACK
    if (!matcher && messagingEvent) {
      const agent = (await getAgentByInstagramId(accountId!)) as any;
      if (agent && agent.User?.personalAssistant?.active) {
        const integration = agent.User.integrations.find((i: any) => i.instagramId === accountId) || agent.User.integrations[0];
        const token = integration?.token;
        if (token) {
           const smart_ai_message = await generateGeminiResponse(incomingText, agent.User.personalAssistant.prompt);
           if (smart_ai_message) {
              const res = await sendDm(accountId!, senderId!, smart_ai_message, token);
              if (res.status === 200) {
                 updateMetrics(agent.User.id, "DM").catch(() => {});
                 return NextResponse.json({ message: "Agent responded" }, { status: 200 });
              }
           }
        }
      }
    }

    return NextResponse.json({ message: "Done" }, { status: 200 });
  } catch (error) {
    console.error("❌ WEBHOOK ERROR:", error);
    return NextResponse.json({ message: "Error" }, { status: 200 }); 
  }
}
