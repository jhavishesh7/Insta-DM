"use server";

import { client } from "@/lib/prisma";

export const getPersonalAssistant = async (clerkId: string) => {
  return (await client.user.findUnique({
    where: { clerkId },
    select: {
      personalAssistant: true,
    },
  })) as any;
};

export const updatePersonalAssistant = async (clerkId: string, prompt: string, active: boolean) => {
  try {
    const user = await client.user.findUnique({
      where: { clerkId },
      select: { id: true },
    });

    if (!user) return { status: 404, message: "User not found" };

    const assistant = await (client as any).personalAssistant.upsert({
      where: { userId: user.id },
      update: { prompt, active },
      create: { 
        userId: user.id,
        prompt, 
        active 
      },
    });

    return { status: 200, data: assistant };
  } catch (error) {
    console.error("Agent Update Error:", error);
    return { status: 500, message: "Internal error" };
  }
};

export const getAgentByInstagramId = async (instagramId: string) => {
  return (await client.integrations.findUnique({
    where: { instagramId },
    select: {
      User: {
        select: {
          id: true,
          personalAssistant: true,
          subscription: { select: { plan: true } },
          integrations: { select: { token: true } },
        },
      },
    },
  })) as any;
};
