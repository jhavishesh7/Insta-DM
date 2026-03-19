"use server";

import { client } from "@/lib/prisma";

export const updateIntegration = async (
  token: string,
  expire: Date,
  id: string
) => {
  return await client.integrations.update({
    where: { id },
    data: {
      token,
      expiresAt: expire,
    },
  });
};

export const getIntegrations = async (clerkId: string) => {
  return await client.user.findUnique({
    where: {
      clerkId,
    },
    select: {
      integrations: {
        where: {
          name: "INSTAGRAM",
        },
      },
    },
  });
};

export const createIntegration = async (
  clerkId: string,
  token: string,
  expire: Date,
  insts_id: string
) => {
  const user = await client.user.findUnique({
    where: { clerkId },
    select: { id: true },
  });

  if (!user) return null;

  // We use upsert on the Integrations model to avoid unique constraint errors
  // either on the token or the instagramId.
  return await client.integrations.upsert({
    where: {
      instagramId: insts_id,
    },
    update: {
      token,
      expiresAt: expire,
    },
    create: {
      token,
      expiresAt: expire,
      instagramId: insts_id,
      userId: user.id,
    },
  });
};
