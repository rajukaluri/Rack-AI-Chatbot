import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

let genAI = null;
let model = null;
let chatSession = null;

export const initGemini = () => {
  if (!API_KEY) {
    console.error("VITE_GEMINI_API_KEY is missing in environment variables.");
    return false;
  }
  
  try {
    genAI = new GoogleGenerativeAI(API_KEY);
    model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });
    
    // Initialize a chat session
    chatSession = model.startChat({
      history: [
        {
          role: "user",
          parts: [{ text: "You are Rack Ai, a helpful, friendly, and highly intelligent AI assistant. Always provide clear, well-formatted, and accurate answers." }]
        },
        {
          role: "model",
          parts: [{ text: "Hello! I am Rack Ai. I'm ready to help you with whatever you need." }]
        }
      ],
      generationConfig: {
        maxOutputTokens: 2000,
        temperature: 0.7,
      },
    });
    return true;
  } catch (error) {
    console.error("Error initializing Gemini:", error);
    return false;
  }
};

export const sendMessageToGemini = async (messageContent) => {
  if (!chatSession) {
    const initialized = initGemini();
    if (!initialized) {
      throw new Error("Failed to initialize AI model. Check your API key.");
    }
  }

  try {
    // If messageContent is an array, it contains text + inlineData objects (images)
    // If it's a string, it's just plain text
    const result = await chatSession.sendMessage(messageContent);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Error sending message to Gemini:", error);
    throw error;
  }
};
