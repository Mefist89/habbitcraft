import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(req: Request) {
  try {
    const { dream, mood, lang } = await req.json();
    console.log("Dream API Request:", { dream, mood, lang });

    if (!process.env.GEMINI_API_KEY) {
      console.error("Dream API Error: GEMINI_API_KEY is missing from environment");
      return NextResponse.json(
        { error: "Gemini API Key is missing" },
        { status: 500 }
      );
    }

    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const systemPrompt = `
      You are a magical Dream Guide in a kid-friendly app called HabbitCraft. 
      Your goal is to analyze children's dreams in a very positive, encouraging, and imaginative way.
      Keep the response short (2-3 sentences), magical, and supportive. 
      If the dream is scary, turn it into a story of bravery or a misunderstanding by a friendly monster.
      Language of response: ${lang === 'ro' ? 'Romanian' : 'English'}.
      Child's Mood: ${mood}.
    `;

    const prompt = `Here is my dream: "${dream}". What does it mean, Dream Guide?`;

    const result = await model.generateContent([systemPrompt, prompt]);
    const response = await result.response;
    const text = response.text();
    console.log("Dream API Success:", text);

    return NextResponse.json({ analysis: text });
  } catch (error: any) {
    console.error("Dream API Error Detail:", error?.message || error);
    
    let userMessage = error?.message || "Failed to analyze dream";
    if (userMessage.includes("404") || userMessage.includes("not found")) {
      userMessage = "Se pare că acest model Gemini nu e disponibil direct în regiunea ta (Moldova). Încearcă să folosești un VPN setat pe România sau USA.";
    }

    return NextResponse.json(
      { error: "Failed to analyze dream", details: userMessage },
      { status: 500 }
    );
  }
}
