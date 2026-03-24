"use server";
import { client } from "@/lib/prisma";

export const joinWaitlist = async (email: string, name?: string) => {
  try {
    const existing = await client.waitlistEntry.findUnique({ where: { email } });
    if (existing) {
      return { status: 200, message: "You're already on the list!" };
    }
    await client.waitlistEntry.create({ data: { email, name } });
    return { status: 201, message: "You're on the list! We'll be in touch." };
  } catch (err) {
    console.error("Waitlist error:", err);
    return { status: 500, message: "Something went wrong. Please try again." };
  }
};

export const submitSurvey = async (data: {
  email: string;
  name?: string;
  instagramHandle?: string;
  followerCount?: string;
  currentTools?: string;
  biggestChallenge?: string;
  interestedFeatures?: string[];
  willingToPay?: string;
  betaTester?: boolean;
  additionalComments?: string;
  type?: string;
  igUsage?: string;
  manualDmVolume?: string;
  automationDepth?: string;
  primaryGoal?: string;
}) => {
  try {
    await client.surveyResponse.create({
      data: {
        email: data.email,
        name: data.name,
        instagramHandle: data.instagramHandle,
        followerCount: data.followerCount,
        currentTools: data.currentTools,
        biggestChallenge: data.biggestChallenge,
        interestedFeatures: data.interestedFeatures || [],
        willingToPay: data.willingToPay,
        betaTester: data.betaTester || false,
        additionalComments: data.additionalComments,
        type: data.type,
        igUsage: data.igUsage,
        manualDmVolume: data.manualDmVolume,
        automationDepth: data.automationDepth,
        primaryGoal: data.primaryGoal,
      }
    });
    return { status: 201, message: "Survey submitted! Thank you." };
  } catch (err) {
    console.error("Survey error:", err);
    return { status: 500, message: "Something went wrong. Please try again." };
  }
};
