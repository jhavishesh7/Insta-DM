const { GoogleGenerativeAI } = require("@google/generative-ai");
const apiKey = "AIzaSyApl-ax0Ulrfwj-qP2XyvJNapB6jUQ6Crg";
const genAI = new GoogleGenerativeAI(apiKey);

async function test() {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });
    const result = await model.generateContent("hi");
    const response = await result.response;
    console.log("Success:", response.text());
  } catch (err) {
    console.error("Error:", err.message);
  }
}

test();
