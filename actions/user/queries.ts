"use server";

import { client } from "@/lib/prisma";

export const findUser = async (clerkId: string) => {
  const user = await client.user.findUnique({
    where: {
      clerkId,
    },
    include: {
      subscription: true,
      integrations: {
        select: {
          id: true,
          token: true,
          expiresAt: true,
          name: true,
          instagramId: true,
        },
      },
    },
  });

  if (user && process.env.USE_STRIPE === "false") {
    return {
      ...user,
      subscription: user.subscription
        ? { ...user.subscription, plan: "PRO" as "PRO" | "FREE" }
        : { plan: "PRO" as "PRO" | "FREE" },
    };
  }

  return user;
};

export const createUser = async (
  clerkId: string,
  firstname: string,
  lastname: string,
  email: string
) => {
  return await client.user.create({
    data: {
      clerkId,
      firstname,
      lastname,
      email,
      subscription: {
        create: {
          plan: process.env.USE_STRIPE === "false" ? "PRO" : "FREE",
        },
      },
    },
    select: {
      firstname: true,
      lastname: true,
    },
  });
};

export const updateSubscription = async (
  clerkId: string,
  props: { customerId?: string; plan?: "PRO" | "FREE" }
) => {
  return await client.user.update({
    where: {
      clerkId,
    },
    data: {
      subscription: {
        update: {
          data: {
            ...props,
          },
        },
      },
    },
  });
};
export const getUserMetrics = async (clerkId: string) => {
  return (await client.user.findUnique({
    where: { clerkId },
    select: {
      metrics: {
        select: {
          dmCount: true,
          commentCount: true,
        },
      },
    },
  })) as any;
};
