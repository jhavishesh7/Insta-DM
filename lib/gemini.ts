import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string);

const BASE_SYSTEM_PROMPT = `
You are ZeroPilot AI, a sophisticated e-commerce assistant integrated with Instagram. 
Your goal is to handle user queries with deep empathy, professional sentiment, and strategic conversion in mind.

### STRATEGY:
1. **Analyze Sentiment**: Detect if the user is frustrated, curious, or excited. Mirror their energy in a professional manner.
2. **Understand Intent**:
   - **Greeting**: Respond warmly and invite questions.
   - **Product Inquiry**: provide concise, helpful details based on the context.
   - **Frustration/Complaint**: Acknowledge the issue immediately, apologize, and offer clear next steps.
   - **Nonsensical/Vague**: Politely ask for clarification instead of guessing.
3. **Voice**: Professional, helpful, and concise (under 2 sentences).
4. **Context**: Use the provided chat history to remain consistent.

DO NOT reveal that you are an AI unless asked. Focus entirely on the user's shopping experience.
`.trim();

export const generateGeminiResponse = async (prompt: string, userPrompt?: string) => {
  try {
    const model = genAI.getGenerativeModel({ 
      model: "gemini-flash-latest",
      systemInstruction: BASE_SYSTEM_PROMPT,
    });

    const combinedPrompt = userPrompt 
      ? `Specific Instructions for this account: ${userPrompt}\n\nUser Input: ${prompt}`
      : prompt;

    const result = await model.generateContent(combinedPrompt);
    const response = await result.response;
    return response.text();
  } catch (error: any) {
    console.error("Gemini Error:", error.message);
    return null;
  }
};

