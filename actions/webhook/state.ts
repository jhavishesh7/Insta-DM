import { client } from "@/lib/prisma";

export const getWorkflowState = async (igUserId: string) => {
  return await client.userWorkflowState.findUnique({
    where: { igUserId },
  });
};

export const updateWorkflowState = async (
  igUserId: string,
  pageId: string,
  verified: boolean,
  state: string,
  incomingText?: string,
  automationId?: string
) => {
  return await client.userWorkflowState.upsert({
    where: { igUserId },
    update: {
      isFollowerVerified: verified,
      flowState: state,
      lastIncomingText: incomingText,
      lastAutomationId: automationId,
    },
    create: {
      igUserId,
      pageId,
      isFollowerVerified: verified,
      flowState: state,
      lastIncomingText: incomingText,
      lastAutomationId: automationId,
    },
  });
};
