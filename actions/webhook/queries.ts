import { client } from "@/lib/prisma";

export const matchKeyword = async (keyword: string) => {
  return await client.keyword.findFirst({
    where: {
      word: {
        contains: keyword,
        mode: "insensitive",
      },
    },
  });
};

export const getKeywordAutomation = async (
  automationId: string,
  dm: boolean
) => {
  return await client.automation.findUnique({
    where: {
      id: automationId,
    },
    include: {
      dms: dm,
      trigger: {
        where: {
          type: dm ? "DM" : "COMMENT",
        },
      },
      listener: true,
      User: {
        select: {
          id: true,
          subscription: {
            select: {
              plan: true,
            },
          },
          integrations: {
            select: {
              token: true,
              instagramId: true,
            },
          },
        },
      },
    },
  });
};

export const trackResponse = async (
  automationId: string,
  type: "COMMENT" | "DM"
) => {
  if (type === "COMMENT") {
    return await client.listener.update({
      where: {
        automationId,
      },
      data: {
        commentCount: {
          increment: 1,
        },
      },
    });
  }

  if (type === "DM") {
    return await client.listener.update({
      where: {
        automationId,
      },
      data: {
        dmCount: {
          increment: 1,
        },
      },
    });
  }
};

export const createChatHistory = (
  automationId: string,
  sender: string,
  message: string,
  receiver: string
) => {
  return client.automation.update({
    where: {
      id: automationId,
    },
    data: {
      dms: {
        create: {
          reciever: receiver,
          senderId: sender,
          message,
        },
      },
    },
  });
};

export const getKeywordPost = async (postId: string, automationId: string) => {
  return await client.post.findFirst({
    where: {
      AND: [{ postid: postId }, { automationId }],
    },
    select: { automationId: true },
  });
};

export const getChatHistory = async (sender: string, receiver: string) => {
  const history = await client.dms.findMany({
    where: {
      AND: [{ senderId: sender }, { reciever: receiver }],
    },
    orderBy: { createdAt: "asc" },
  });

  const chatSession: {
    role: "assistant" | "user";
    content: string;
  }[] = history.map((chat) => {
    return {
      role: chat.reciever ? "assistant" : "user",
      content: chat.message!,
    };
  });
  return {
    history: chatSession,
    automationId: history.length > 0 ? history[history.length - 1].automationId : null,
  };
};

export const getAutomationLogs = async (clerkId: string) => {
  const user = await client.user.findUnique({
    where: { clerkId },
    select: {
      activityLogs: {
        orderBy: {
          createdAt: "desc",
        },
        take: 50,
      },
    },
  });

  return user?.activityLogs || [];
};

export const getInteractionsData = async (clerkId: string) => {
  const user = await client.user.findUnique({
    where: { clerkId },
    select: {
      activityLogs: {
        select: {
          createdAt: true,
          type: true,
        },
      },
    },
  });

  if (!user) return [];

  const monthlyData: { [key: string]: { interactions: number; aiReplies: number } } = {};

  user.activityLogs.forEach((log) => {
    const month = new Date(log.createdAt).toLocaleString("default", {
      month: "short",
    });
    if (!monthlyData[month]) {
      monthlyData[month] = { interactions: 0, aiReplies: 0 };
    }
    monthlyData[month].interactions++;
    monthlyData[month].aiReplies++;
  });

  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const currentMonth = new Date().getMonth();

  return months
    .map((month) => ({
      month,
      interactions: monthlyData[month]?.interactions || 0,
      aiReplies: monthlyData[month]?.aiReplies || 0,
    }))
    .filter((_, index) => index <= currentMonth && index > currentMonth - 6);
};

export const saveActivityLog = (userId: string, automationId: string | null, message: string, type: string) => {
  return client.activityLog.create({
    data: {
      userId,
      automationId,
      message,
      type,
    },
  });
};

export const updateMetrics = (userId: string, type: "DM" | "COMMENT") => {
  return client.metrics.upsert({
    where: { userId },
    update: {
      dmCount: type === "DM" ? { increment: 1 } : undefined,
      commentCount: type === "COMMENT" ? { increment: 1 } : undefined,
    },
    create: {
      userId,
      dmCount: type === "DM" ? 1 : 0,
      commentCount: type === "COMMENT" ? 1 : 0,
    },
  });
};
