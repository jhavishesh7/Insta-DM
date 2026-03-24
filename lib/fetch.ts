import axios from "axios";

export const refreshToken = async (token: string) => {
  const refresh_token = await axios.get(
    `${process.env.INSTAGRAM_BASE_URL}/refresh_access_token?grant_type=ig_refresh_token&access_token=${token}`
  );
  return refresh_token.data;
};

export const sendDm = async (
  userId: string,
  receiverId: string,
  prompt: string,
  token: string
) => {
  const url = `${process.env.INSTAGRAM_BASE_URL}/${userId}/messages`;
  console.log("🚀 ~ sendDm ~ url:", url);
  try {
    const res = await axios.post(
      url,
      {
        recipient: {
          id: receiverId,
        },
        message: {
          text: prompt,
        },
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    console.log("✅ Message sent successfully:", res.data);
    return res;
  } catch (err: any) {
    console.error("❌ sendDm Error Details:", err.response?.data || err.message);
    throw err;
  }
};

export const sendPrivateMessage = async (
  userId: string,
  commentId: string,
  prompt: string,
  token: string,
  buttons?: { title: string; payload?: string; type?: "postback" | "web_url"; url?: string }[]
) => {
  console.log("📤 Sending Private Message to comment:", commentId);
  const hasCtas = buttons && Array.isArray(buttons) && buttons.length > 0;
  
  try {
    const messageContent = hasCtas ? {
      attachment: {
        type: "template",
        payload: {
          template_type: "generic",
          elements: [{
            title: prompt,
            buttons: buttons.map(b => ({
              type: b.type || "postback",
              title: b.title.substring(0, 20),
              ...(b.type === "web_url" ? { url: b.url } : { payload: b.payload })
            }))
          }]
        }
      }
    } : {
      text: prompt,
    };

    const res = await axios.post(
      `${process.env.INSTAGRAM_BASE_URL}/${userId}/messages`,
      {
        recipient: {
          comment_id: commentId,
        },
        message: messageContent,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    console.log("✅ Private Message sent successfully");
    return res;
  } catch (err: any) {
    console.error("❌ sendPrivateMessage ERROR:", err.response?.data || err.message);
    // Log helpful info for common errors
    const errorData = err.response?.data?.error;
    if (errorData?.code === 10) {
      console.log("💡 TIP: Error 10 usually means the comment has already been replied to or the app lacks permissions.");
    }
    throw err;
  }
};

export const sendPublicCommentReply = async (
  commentId: string,
  text: string,
  token: string
) => {
  console.log("📤 Sending Public Comment Reply to:", commentId);
  try {
    const res = await axios.post(
      `${process.env.INSTAGRAM_BASE_URL}/${commentId}/replies`,
      {
        message: text,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    console.log("✅ Public Comment Reply sent successfully");
    return res;
  } catch (err: any) {
    console.error("❌ sendPublicCommentReply ERROR:", err.response?.data || err.message);
    throw err;
  }
};

export const generateToken = async (code: string) => {
  const insta_form = new FormData();
  insta_form.append("client_id", process.env.INSTAGRAM_CLIENT_ID as string);

  insta_form.append(
    "client_secret",
    process.env.INSTAGRAM_CLIENT_SECRET as string
  );
  insta_form.append("grant_type", "authorization_code");
  insta_form.append(
    "redirect_uri",
    `${process.env.NEXT_PUBLIC_HOST_URL}/callback/instagram`
  );
  insta_form.append("code", code);

  const shortTokenRes = await fetch(process.env.INSTAGRAM_TOKEN_URL as string, {
    method: "POST",
    body: insta_form,
  });

  let token;
  try {
    const text = await shortTokenRes.text();
    token = JSON.parse(text);
  } catch (err) {
    console.log("❌ Failed to parse Instagram token response:", err);
    return null;
  }

  if (!shortTokenRes.ok) {
    console.log("❌ Instagram Token Exchange ERROR:");
    console.log("Status:", shortTokenRes.status);
    console.log("Error Details:", JSON.stringify(token, null, 2));
    
    // Help user with Code 101
    if (token.code === 101 || (token.error && token.error.code === 101)) {
      console.log("💡 TIP: Code 101 often means your Client Secret or Redirect URI is incorrect, or the Instagram Login for Business product is not configured in Meta Dash.");
    }
    return null;
  }

  if (token.access_token) {
    // If we already have a long-lived token (expires_in > 24 hours), just return it
    if (token.expires_in > 86400) {
      console.log("✅ Received a Long-Lived Token directly. Skipping exchange.");
      return token;
    }

    console.log("🔄 Exchanging for Long-Lived Token...");
    const long_token = await axios.get(
      `${process.env.INSTAGRAM_BASE_URL}/access_token?grant_type=ig_exchange_token&client_secret=${process.env.INSTAGRAM_CLIENT_SECRET}&access_token=${token.access_token}`
    );

    console.log("✅ Successfully generated Long-Lived Token");
    return long_token.data;
  }
  
  console.log("⚠️ Token received but access_token is missing:", token);
  return null;
};

export const checkFollowerStatus = async (igUserId: string, token: string) => {
  try {
    const res = await axios.get(
      `${process.env.INSTAGRAM_BASE_URL}/${igUserId}?fields=is_user_follow_business&access_token=${token}`,
      { timeout: 3000 }
    );
    return res.data.is_user_follow_business === true;
  } catch (err: any) {
    const errorData = err.response?.data?.error;
    console.error("❌ checkFollowerStatus STRICT FAILURE:", errorData || err.message);
    return false; // Strict mode: Any error results in blocked access
  }
};

export const sendCtaButton = async (
  userId: string,
  receiverId: string,
  text: string,
  buttons: { title: string; payload: string; type?: "postback" | "web_url"; url?: string }[],
  token: string
) => {
  if (!token) {
    console.error("❌ sendCtaButton ERROR: Access token is missing");
    return null;
  }
  // revert to using the same config as sendDm which is working for basic text
  const url = `${process.env.INSTAGRAM_BASE_URL}/${userId}/messages`;
  try {
    const res = await axios.post(
      url,
      {
        recipient: { id: receiverId },
        messaging_type: "RESPONSE",
        message: {
          attachment: {
            type: "template",
            payload: {
              template_type: "generic",
              elements: [
                {
                  title: text,
                  buttons: buttons.map(b => ({
                    type: b.type || "postback",
                    title: b.title.substring(0, 20),
                    ...(b.type === "web_url" ? { url: b.url } : { payload: b.payload })
                  }))
                }
              ]
            }
          }
        },
      },
      {
        headers: { 
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json" 
        },
      }
    );
    return res.data;
  } catch (err: any) {
    console.error("❌ sendCtaButton ERROR:", err.response?.data || err.message);
    return null;
  }
};
