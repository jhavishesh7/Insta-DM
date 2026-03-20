import { findAutomation } from "@/actions/automation/queries";
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
import { checkFollowerStatus, sendDm, sendPrivateMessage, sendPublicCommentReply } from "@/lib/fetch";
import { generateGeminiResponse } from "@/lib/gemini";

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

function isValidSignature(req: NextRequest, body: string) {
  const signature = req.headers.get("x-hub-signature-256");
  if (!signature) return true; // Default to true if header missing (prevent blocking ngrok tests unless secret is verified)

  try {
    const expectedSignature = crypto
      .createHmac("sha256", process.env.INSTAGRAM_CLIENT_SECRET || "")
      .update(body)
      .digest("hex");

    return signature === `sha256=${expectedSignature}`;
  } catch (err) {
    console.error("Signature Validation Error:", err);
    return true; // Don't block on error during dev
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
    const rawBody = await req.text();
    const body = JSON.parse(rawBody);
    
    // 1. Security check: Validate Signature
    if (!isValidSignature(req, rawBody)) {
       console.error("❌ SECURITY WARNING: Invalid Webhook Signature Header received");
    }

    const entry = body.entry?.[0];
    const messagingEvent = entry?.messaging?.[0];
    const commentEvent = entry?.changes?.[0]?.value;

    // Idempotency: Always exit early if we've seen this exact MID or ID recently
    const eventId = messagingEvent?.message?.mid || commentEvent?.id;
    if (eventId && isDuplicateEvent(eventId)) {
       console.log("♻️ [IDEMPOTENCY] Skipping duplicate event:", eventId);
       return NextResponse.json({ message: "Duplicate" }, { status: 200 });
    }

    console.log("📨 Incoming Webhook:", JSON.stringify(body, null, 2));

    // Determine Sender and Message Content
    const senderId = messagingEvent?.sender?.id || commentEvent?.from?.id;
    const incomingText = (messagingEvent?.message?.text || commentEvent?.text || "").trim();
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

    if (!incomingText) {
       console.log("ℹ️ [SKIP] Non-text interaction (read receipt, delivery, reaction, or share)");
       return NextResponse.json({ message: "Non-text ignored" }, { status: 200 });
    }

    // 3. User-Level Rate Limiting
    if (senderId && isRateLimited(senderId)) {
        console.log("⏳ [RATE LIMIT] Throttling sender:", senderId);
        return NextResponse.json({ message: "Rate limit exceeded" }, { status: 200 });
    }

    let matcher;
    if (incomingText) {
       console.log("🔍 Searching for keyword match...");
       matcher = (await matchKeyword(incomingText)) as any;
    }

    if (matcher && matcher.automationId) {
      console.log("🤖 Keyword Match Found:", matcher.word);

      // 1. DM HANDLER
      if (messagingEvent) {
        const automation = (await getKeywordAutomation(matcher.automationId, true)) as any;
        if (automation && automation.trigger) {
          const token = automation.User?.integrations[0]?.token;
          
          if (automation.listener?.listener === "MESSAGE" && token) {
            console.log("📤 Sending Direct DM response...");
            const res = await sendDm(accountId!, senderId!, automation.listener?.prompt || "", token);
            if (res.status === 200) {
              // Side effects in parallel (don't block response) ⚡
              Promise.all([
                 trackResponse(automation.id, "DM"),
                 saveActivityLog(automation.userId!, automation.id, `Sent DM: ${automation.name}`, "DM"),
                 updateMetrics(automation.userId!, "DM")
              ]).catch(err => console.error("Post-DM error:", err));
              
              return NextResponse.json({ message: "DM sent" }, { status: 200 });
            }
          }

          if (automation.listener?.listener === "SMARTAI" && automation.User?.subscription?.plan === "PRO" && token) {
            console.log("🤖 Generating AI DM response...");
            const smart_ai_message = await generateGeminiResponse(
              incomingText,
              `${automation.listener?.prompt}: Keep response short`
            );
            const response_text = smart_ai_message || "I'm sorry, I couldn't process that.";
            
            // Send DM and update DB in parallel ⚡
            const [res] = await Promise.all([
               sendDm(accountId!, senderId!, response_text, token),
               client.$transaction([
                  createChatHistory(automation.id, senderId!, incomingText, accountId!),
                  createChatHistory(automation.id, accountId!, response_text, senderId!)
               ])
            ]);
            
            if (res.status === 200) {
               Promise.all([
                  trackResponse(automation.id, "DM"),
                  saveActivityLog(automation.userId!, automation.id, `AI Response sent`, "DM"),
                  updateMetrics(automation.userId!, "DM")
               ]).catch(err => console.error("Post-AI DM error:", err));
               
               return NextResponse.json({ message: "AI DM sent" }, { status: 200 });
            }
          }
        }
      }

      // 2. COMMENT HANDLER
      if (commentEvent) {
        const automation = (await getKeywordAutomation(matcher.automationId, false)) as any;
        const automation_post = await getKeywordPost(entry.changes[0].value.media.id, automation?.id!);

        if (automation && automation_post && automation.trigger) {
          const token = automation.User?.integrations[0]?.token;
          if (token) {
            const [smart_ai_message] = await Promise.all([
               automation.listener?.listener === "SMARTAI" ? generateGeminiResponse(incomingText, `${automation.listener?.prompt}: keep short`) : Promise.resolve(null)
            ]);
            
            const isFollowing = automation.listener?.followerCheckActive 
              ? await checkFollowerStatus(senderId!, token)
              : true;

            const response_text = isFollowing 
              ? (automation.listener?.listener === "SMARTAI" ? (smart_ai_message || "DMed you!") : (automation.listener?.prompt || ""))
              : (automation.listener?.unfollowedMessage || "Follow us to unlock this content! 😉");
            
            const final_res = await sendPrivateMessage(accountId!, commentEvent.id, response_text, token);

            if (isFollowing && automation.listener && (automation.listener.commentReplyType !== "SINGLE" || automation.listener.commentReply)) {
               let public_reply = automation.listener.commentReply;
               if (automation.listener.commentReplyType === "MULTIPLE" && automation.listener.multipleCommentReplies.length > 0) {
                  const replies = automation.listener.multipleCommentReplies;
                  public_reply = replies[Math.floor(Math.random() * replies.length)];
               } else if (automation.listener.commentReplyType === "AI") {
                  const ai_comment = await generateGeminiResponse(incomingText, "Generate a very short friendly reply to this comment.");
                  public_reply = ai_comment || "Check your DMs! 🚀";
               }
               if (public_reply) sendPublicCommentReply(commentEvent.id, public_reply, token).catch(() => {});
            }

            if (final_res && final_res.status === 200) {
               Promise.all([
                  trackResponse(automation.id, "COMMENT"),
                  updateMetrics(automation.userId!, "COMMENT"),
                  automation.listener?.listener === "SMARTAI" ? client.$transaction([
                        createChatHistory(automation.id, accountId!, senderId!, incomingText),
                        createChatHistory(automation.id, accountId!, senderId!, response_text)
                  ]) : Promise.resolve()
               ]).catch(err => console.error("Post-comment error:", err));
               
               return NextResponse.json({ message: "Comment success" }, { status: 200 });
            }
          }
        }
      }
    }

    // 3. CONTINUED CHAT (Existing session)
    if (!matcher && messagingEvent) {
      const customer_history = await getChatHistory(messagingEvent.recipient.id, messagingEvent.sender.id) as any;
      if (customer_history.history.length > 0 && customer_history.automationId) {
        const automation = (await findAutomation(customer_history.automationId)) as any;
        if (automation?.User?.subscription?.plan === "PRO" && automation.listener?.listener === "SMARTAI") {
          const token = automation.User?.integrations[0]?.token;
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
        const token = agent.User.integrations[0]?.token;
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
