"use server";

import { generateGeminiResponse } from "@/lib/gemini";
import { onCurrentUser } from "../user";
import { findUser } from "../user/queries";
import {
  addKeyWords,
  addListener,
  addPosts,
  addTrigger,
  createAutomation,
  deleteAutomationQuery,
  deleteKeywordsQuery,
  findAutomation,
  getAutomation,
  updateAutomation,
  updateCommentReply,
  updateFollowerCheck,
} from "./queries";

export const deleteAutomationAction = async (id: string) => {
  await onCurrentUser();
  try {
    const deleted = await deleteAutomationQuery(id);
    if (deleted) return { status: 200, data: "Automation deleted" };
    return { status: 404, data: "Automation not found" };
  } catch (error) {
    return { status: 500, data: "Failed to delete automation" };
  }
};

export const createAutomations = async (id?: string) => {
  const user = await onCurrentUser();

  try {
    const create = await createAutomation(user.id, id);

    if (create) return { status: 200, data: "Automation created" };
    return { status: 404, data: "Failed to create automation" };
  } catch (error: any) {
    return { status: 500, data: error.message };
  }
};

export const getAllAutomation = async () => {
  const user = await onCurrentUser();

  try {
    const getAll = await getAutomation(user.id);

    if (getAll) return { status: 200, data: getAll.automations || [] };

    return { status: 404, data: [] };
  } catch (error: any) {
    return { status: 500, data: [] };
  }
};

export const getAutomationInfo = async (id: string) => {
  await onCurrentUser();

  try {
    const automation = await findAutomation(id);

    if (automation) return { status: 200, data: automation };

    return { status: 404 };
  } catch (error) {
    return { status: 500 };
  }
};

export const updateAutomationName = async (
  automationId: string,
  data: {
    name?: string;
    active?: boolean;
    automation?: string;
  }
) => {
  await onCurrentUser();

  try {
    const update = await updateAutomation(automationId, data);

    if (update) return { status: 200, data: "Automation updated" };
    return { status: 404, data: "Failed to update automation" };
  } catch (error) {
    return { status: 500, data: "Failed to update automation" };
  }
};

export const saveListener = async (
  automationId: string,
  listener: "SMARTAI" | "MESSAGE",
  prompt: string,
  reply?: string,
  ctas?: any,
  isEndBlock?: boolean,
  ctasActive?: boolean
) => {
  await onCurrentUser();

  try {
    const create = await addListener(automationId, listener, prompt, reply, ctas, isEndBlock, ctasActive);

    if (create) return { status: 200, data: "Listener created" };
    return { status: 404, data: "Failed to create listener" };
  } catch (error) {
    return { status: 500, data: "Failed to save listener" };
  }
};

export const saveTrigger = async (automationId: string, trigger: string[]) => {
  await onCurrentUser();

  try {
    const create = await addTrigger(automationId, trigger);

    if (create) return { status: 200, data: "Trigger created" };
    return { status: 404, data: "Failed to create trigger" };
  } catch (error: any) {
    console.error("❌ Save Trigger Error:", error);
    return { status: 500, data: error.message || "Failed to save trigger" };
  }
};

export const saveKeywords = async (automationId: string, keywords: string) => {
  await onCurrentUser();

  try {
    const create = await addKeyWords(automationId, keywords);

    if (create) return { status: 200, data: "Keywords created" };
    return { status: 404, data: "Failed to create keywords" };
  } catch (error) {
    return { status: 500, data: "Failed to save keywords" };
  }
};

export const deleteKeywords = async (automationId: string) => {
  await onCurrentUser();

  try {
    const deleted = await deleteKeywordsQuery(automationId);
    if (deleted) {
      return { status: 200, data: "Keywords deleted" };
    }
    return { status: 404, data: "Failed to delete keywords" };
  } catch (error) {
    return { status: 500, data: "Failed to delete keywords" };
  }
};

export const getProfilePosts = async () => {
  const user = await onCurrentUser();

  try {
    const profile = await findUser(user.id);
    if (!profile?.integrations || profile.integrations.length === 0) {
      return { status: 404, data: { data: [] } };
    }

    const posts = await fetch(
      `${process.env.INSTAGRAM_BASE_URL}/${profile.integrations[0].instagramId}/media?fields=id,caption,media_url,media_type,timestamp&limit=10&access_token=${profile.integrations[0].token}`
    );

    if (!posts.ok) {
      console.log("❌ Instagram API Fetch Error:", posts.status, posts.statusText);
      return { status: posts.status, data: { data: [] } };
    }

    const parsed = await posts.json();

    if (parsed && !parsed.error) {
      return { status: 200, data: parsed };
    }
    
    console.log("🚀 ~ getProfilePosts ~ error/empty response:", parsed?.error || "Empty response");
    return { status: 404, data: { data: [] } };
  } catch (error: any) {
    console.log("🚀 ~ getProfilePosts ~ fatal error:", error.message);
    return { status: 500, data: { data: [] } };
  }
};

export const savePosts = async (
  automationId: string,
  posts: {
    postid: string;
    caption?: string;
    media: string;
    mediaType: "IMAGE" | "VIDEO" | "CAROSEL_ALBUM";
  }[]
) => {
  await onCurrentUser();

  try {
    const create = await addPosts(automationId, posts);

    if (create) return { status: 200, data: "Posts created" };
    return { status: 404, data: "Failed to create posts" };
  } catch (error) {
    return { status: 500, data: "Failed to save posts" };
  }
};

export const activateAutomation = async (id: string, status: boolean) => {
  await onCurrentUser();

  try {
    const activate = await updateAutomation(id, { active: status });
    if (activate) {
      return {
        status: 200,
        data: `Automation ${status ? "activated" : "deactivated"}`,
      };
    }
    return { status: 404, data: "Failed to activate automation" };
  } catch (error) {
    return { status: 500, data: "Failed to activate automation" };
  }
};

export const generateAIPrompt = async (
  name: string,
  niche: string,
  audience: string,
  tone: string,
  goals: string
) => {
  await onCurrentUser();

  const systemDescription = `
    You are an expert AI prompt engineer. Take the following business details and generate a highly effective SYSTEM PROMPT for an Instagram DM Automation bot.
    The goal is for the bot to interact with customers in a way that matches the brand.
    
    Business Name: ${name}
    Niche: ${niche}
    Audience: ${audience}
    Tone: ${tone}
    Goals: ${goals}
    
    Output ONLY the system prompt text. Do not include quotes or extra commentary.
  `;

  try {
    const prompt = await generateGeminiResponse(
      "Generate the system prompt now.",
      systemDescription
    );
    if (prompt) return { status: 200, data: prompt };
    return { status: 404, data: "Failed to generate prompt" };
  } catch (error) {
    return { status: 500, data: "Failed to generate prompt" };
  }
};

export const saveCommentReply = async (
  automationId: string,
  data: {
    type: "SINGLE" | "MULTIPLE" | "AI";
    replies?: string[];
    reply?: string;
  }
) => {
  await onCurrentUser();
  try {
    const update = await updateCommentReply(automationId, data);
    if (update) return { status: 200, data: "Comment reply updated" };
    return { status: 404, data: "Failed to update" };
  } catch (error) {
    return { status: 500 };
  }
};

export const saveFollowerCheck = async (
  automationId: string,
  status: boolean,
  message?: string,
  buttonLabel?: string,
  payload?: string,
  successMessage?: string,
  retryMessage?: string,
  customMessages?: boolean
) => {
  await onCurrentUser();
  try {
    const update = await updateFollowerCheck(
      automationId, 
      status, 
      message, 
      buttonLabel, 
      payload,
      successMessage,
      retryMessage,
      customMessages
    );
    if (update) return { status: 200, data: "Follower check updated" };
    return { status: 404, data: "Failed to update" };
  } catch (error) {
    return { status: 500 };
  }
};
