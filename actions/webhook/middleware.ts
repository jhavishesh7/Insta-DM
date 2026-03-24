import { checkFollowerStatus, sendCtaButton, sendPrivateMessage } from "@/lib/fetch";
import { getWorkflowState, updateWorkflowState } from "./state";

export const followGateMiddleware = async (
  senderId: string,
  accountId: string,
  token: string,
  automation: any,
  incomingText?: string,
  commentId?: string
) => {
  // User requested to check at every interaction to ensure strictness
  /*
  const state = await getWorkflowState(senderId);
  if (state?.isFollowerVerified) {
    return true; 
  }
  */

  // Check real-time follow status
  const isFollowing = await checkFollowerStatus(senderId, token);
  if (isFollowing) {
    // Update state to avoid future checks
    await updateWorkflowState(senderId, accountId, true, "VERIFIED");
    return true;
  }

  // User is not following and not verified in state
  // Send the customizable Follow Gate message with a CTA Button
  const gateConfig = {
    message: automation.listener.unfollowedMessage || "Follow us to unlock this content!",
    button_title: automation.listener.unfollowedButtonLabel || "Unlock 🔓",
    payload: automation.listener.unfollowedPayload || `FOLLOW_VERIFY_${automation.id}`
  };

  if (commentId) {
    // For comments, we MUST use the private_reply endpoint (sendPrivateMessage)
    await sendPrivateMessage(
      accountId,
      commentId,
      gateConfig.message,
      token,
      [{ title: gateConfig.button_title, payload: gateConfig.payload, type: "postback" }]
    );
  } else {
    // For DMs, we can use the standard messages endpoint
    await sendCtaButton(
      accountId,
      senderId,
      gateConfig.message,
      [{ title: gateConfig.button_title, payload: gateConfig.payload, type: "postback" }],
      token
    );
  }

  // Update state to WAITING for verification, including original context
  await updateWorkflowState(senderId, accountId, false, `WAITING_FOR_${automation.id}`, incomingText, automation.id);

  return false; // Stop workflow for now
};

export const handleFollowVerification = async (
  senderId: string,
  accountId: string,
  token: string,
  payload: string
) => {
  // Try to get automationId from payload or from state
  let automationId = payload.includes("FOLLOW_VERIFY_") 
    ? payload.replace("FOLLOW_VERIFY_", "")
    : null;

  if (!automationId) {
    const state = await getWorkflowState(senderId);
    if (state?.flowState.startsWith("WAITING_FOR_")) {
      automationId = state.flowState.replace("WAITING_FOR_", "");
    }
  }
  
  const isNowFollowing = await checkFollowerStatus(senderId, token);
  
  if (isNowFollowing && automationId) {
     await updateWorkflowState(senderId, accountId, true, "VERIFIED");
     return { verified: true, automationId };
  } else {
     // Still not following or no automation ID found
     return { verified: false, automationId };
  }
};
