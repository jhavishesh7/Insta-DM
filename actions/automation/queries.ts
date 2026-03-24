"use server";

import { client } from "@/lib/prisma";

export const createAutomation = async (clerkId: string, id?: string) => {
  return await client.user.update({
    where: {
      clerkId,
    },
    data: {
      automations: {
        create: {
          ...(id && { id }),
        },
      },
    },
  });
};

export const getAutomation = async (clerkId: string) => {
  return await client.user.findUnique({
    where: {
      clerkId,
    },
    select: {
      automations: {
        orderBy: {
          createdAt: "asc",
        },
        include: {
          keywords: true,
          listener: true,
        },
      },
    },
  });
};

export const findAutomation = async (id: string) => {
  const automation = await client.automation.findUnique({
    where: {
      id,
    },
    include: {
      keywords: true,
      trigger: true,
      posts: true,
      listener: true,
      User: {
        select: {
          subscription: true,
          integrations: true,
        },
      },
    },
  });

  if (automation && automation.User && process.env.USE_STRIPE === "false") {
    return {
      ...automation,
      User: {
        ...automation.User,
        subscription: automation.User.subscription
          ? { ...automation.User.subscription, plan: "PRO" as "PRO" | "FREE" }
          : { plan: "PRO" as "PRO" | "FREE" },
      },
    };
  }

  return automation;
};

export const updateAutomation = async (
  automationId: string,
  update: {
    name?: string;
    active?: boolean;
  }
) => {
  return await client.automation.update({
    where: {
      id: automationId,
    },
    data: {
      name: update.name,
      active: update.active,
    },
  });
};

export const addListener = async (
  automationId: string,
  listener: "SMARTAI" | "MESSAGE",
  prompt: string,
  reply?: string,
  ctas?: any,
  isEndBlock?: boolean,
  ctasActive?: boolean
) => {
  return await client.automation.update({
    where: {
      id: automationId,
    },
    data: {
      listener: {
        upsert: {
          create: {
            listener,
            prompt,
            commentReply: reply,
            ctas: ctas || [],
            isEndBlock: isEndBlock || false,
            ctasActive: ctasActive || false,
          },
          update: {
            listener,
            prompt,
            commentReply: reply,
            ctas: ctas || [],
            isEndBlock: isEndBlock || false,
            ctasActive: ctasActive || false,
          },
        },
      },
    },
  });
};

export const addTrigger = async (automationId: string, trigger: string[]) => {
  console.log("🚀 ~ addTrigger ~ automationId:", automationId, "trigger:", trigger);
  try {
    // Delete existing triggers first to ensure we only have the ones selected
    await client.trigger.deleteMany({
      where: {
        automationId,
      },
    });

    if (trigger.length === 2) {
      return await client.trigger.createMany({
        data: [{ type: trigger[0], automationId }, { type: trigger[1], automationId }],
      });
    }

    return await client.trigger.create({
      data: {
        type: trigger[0],
        automationId,
      },
    });
  } catch (error) {
    console.error("❌ Prisma Add Trigger Error:", error);
    throw error;
  }
};

export const addKeyWords = async (automationId: string, keywords: string) => {
  return await client.automation.update({
    where: {
      id: automationId,
    },
    data: {
      keywords: {
        create: {
          word: keywords,
        },
      },
    },
  });
};

export const deleteKeywordsQuery = async (automationId: string) => {
  return await client.keyword.deleteMany({
    where: {
      automationId,
    },
  });
};

export const addPosts = async (
  automationId: string,
  posts: {
    postid: string;
    caption?: string;
    media: string;
    mediaType: "IMAGE" | "VIDEO" | "CAROSEL_ALBUM";
  }[]
) => {
  return await client.automation.update({
    where: {
      id: automationId,
    },
    data: {
      posts: {
        createMany: {
          data: posts,
        },
      },
    },
  });
};

export const updateCommentReply = async (
  automationId: string,
  data: {
    type?: "SINGLE" | "MULTIPLE" | "AI";
    replies?: any;
    reply?: string;
  }
) => {
  return await client.listener.update({
    where: { automationId },
    data: {
      commentReplyType: data.type as any,
      multipleCommentReplies: data.replies,
      commentReply: data.reply,
    },
  });
};

export const updateFollowerCheck = async (
  automationId: string,
  status: boolean,
  message?: string,
  buttonLabel?: string,
  payload?: string,
  successMessage?: string,
  retryMessage?: string,
  customMessages?: boolean
) => {
  return await client.listener.update({
    where: { automationId },
    data: {
      followerCheckActive: status,
      unfollowedMessage: message,
      unfollowedButtonLabel: buttonLabel,
      unfollowedPayload: payload,
      followerSuccessMessage: successMessage,
      followerRetryMessage: retryMessage,
      customFollowerMessages: customMessages,
    },
  });
};

export const deleteAutomationQuery = async (id: string) => {
  return await client.automation.delete({
    where: { id },
  });
};
