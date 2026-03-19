"use server";

import { generateToken } from "@/lib/fetch";
import axios from "axios";
import { redirect } from "next/navigation";
import { onCurrentUser } from "../user";
import { createIntegration, getIntegrations } from "./queries";

export const onOathInstagram = async (strategy: "INSTAGRAM" | "CRM") => {
  if (strategy === "INSTAGRAM") {
    return redirect(process.env.INSTAGRAM_EMBEDDED_OAUTH_URL as string);
  }
};

export const onIntegrate = async (code: string) => {
  const user = await onCurrentUser();
  console.log("🔥 Starting Instagram Integration for user:", user.id);
  console.log("📥 Received code:", code);

  try {
    const integration = await getIntegrations(user.id);

    if (integration) {
      const token = await generateToken(code);
      console.log("🚀 ~ onIntegrate ~ token response exists:", !!token);

      if (token) {
        console.log("🔍 Fetching Instagram/Page Info with token...");
        
        console.log("🔍 Fetching Instagram Info with token...");
        
        // In the new Instagram Login flow, /me returns the user/account directly.
        // On Facebook Graph API, it returns the user.
        // On Instagram Graph API, it returns the Instagram account.
        const me = await axios.get(
          `${process.env.INSTAGRAM_BASE_URL}/me?fields=id&access_token=${token.access_token}`
        );

        const igId = me.data.id;

        console.log("🆔 Final Instagram ID identified:", igId);

        const today = new Date();
        const expire_date = today.setDate(today.getDate() + 60);
        const create = await createIntegration(
          user.id,
          token.access_token,
          new Date(expire_date),
          igId
        );
        console.log("✅ Database Integration record updated/created!");
        return { 
          status: 200, 
          data: {
            firstname: user.firstName,
            lastname: user.lastName,
          } 
        };
      }
      console.log("❌ Token exchange failed in generateToken");
      return { status: 401 };
    }

    console.log("ℹ️ User not found in DB during integration attempt");
    return { status: 404 };
  } catch (error: any) {
    console.log("❌ onIntegrate Fatal Error:", error.response?.data || error.message || error);
    return { status: 500 };
  }
};
