import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

type DreamRequest = {
  dream: string;
  mood: string;
  lang?: "en" | "ro";
};

function getDreamPrompt(dream: string, mood: string, lang: "en" | "ro") {
  const isRomanian = lang === "ro";

  const systemPrompt = `
    You are a gentle Dream Guide in a child-friendly app called HabbitCraft.
    The child is between 8 and 14 years old.
    Write in ${isRomanian ? "Romanian" : "English"}.
    Keep the reply warm, imaginative, and short.
    Never say a dream definitely means something.
    Never diagnose, frighten, or mention disorders.
    If the dream sounds scary, turn it into a message of safety and bravery.
    If the dream feels scary or repeats often, add one very short sentence encouraging the child to tell a parent or trusted grown-up.
    Use exactly 3 short sections, each on a new line:
    ${isRomanian ? "Scânteie magică:" : "Magic spark:"}
    ${isRomanian ? "Poate însemna:" : "Maybe it means:"}
    ${isRomanian ? "Pas curajos pentru azi:" : "Brave step for today:"}
    Child mood: ${mood}
  `;

  const userPrompt = isRomanian
    ? `Visul copilului: "${dream}". Răspunde ca un Ghid al Viselor blând și prietenos.`
    : `Child's dream: "${dream}". Reply like a kind Dream Guide.`;

  return [systemPrompt, userPrompt];
}

function getErrorMessage(lang: "en" | "ro", fallback?: string) {
  if (lang === "ro") {
    return fallback || "Ghidul Viselor nu a putut răspunde acum. Încearcă din nou.";
  }

  return fallback || "Dream Guide could not answer right now. Please try again.";
}

export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data, error } = await supabase
    .from("dream_entries")
    .select("id, dream_text, mood, ai_response, created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(8);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data ?? []);
}

export async function POST(req: Request) {
  const supabase = await createClient();

  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { dream, mood, lang = "en" } = (await req.json()) as DreamRequest;

    if (!dream?.trim()) {
      return NextResponse.json(
        {
          error: getErrorMessage(
            lang,
            lang === "ro" ? "Scrie mai întâi visul tău." : "Write your dream first.",
          ),
        },
        { status: 400 },
      );
    }

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { error: getErrorMessage(lang, "GEMINI_API_KEY is missing") },
        { status: 500 },
      );
    }

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const result = await model.generateContent(
      getDreamPrompt(dream.trim(), mood, lang),
    );
    const response = await result.response;
    const text = response.text().trim();

    const { data: entry, error: insertError } = await supabase
      .from("dream_entries")
      .insert({
        user_id: user.id,
        dream_text: dream.trim(),
        mood,
        ai_response: text,
        lang,
      })
      .select("id, dream_text, mood, ai_response, created_at")
      .single();

    if (insertError) {
      return NextResponse.json(
        { error: getErrorMessage(lang, insertError.message) },
        { status: 500 },
      );
    }

    return NextResponse.json({ analysis: text, entry });
  } catch (error: any) {
    let userMessage = error?.message || "Failed to analyze dream";
    if (userMessage.includes("404") || userMessage.includes("not found")) {
      userMessage =
        "The Dream Guide model is not available in this region right now.";
    }

    return NextResponse.json(
      { error: userMessage },
      { status: 500 },
    );
  }
}
