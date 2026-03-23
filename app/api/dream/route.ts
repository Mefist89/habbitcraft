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
  const systemPrompt = isRomanian
    ? `
Ești un Ghid al Viselor blând și prietenos într-o aplicație pentru copii numită HabbitCraft.
Copilul are între 8 și 14 ani.

Reguli:
- Răspunde doar în limba română.
- Fii cald, jucăuș, liniștitor și imaginativ.
- Răspunsul trebuie să fie scurt, clar și ușor de înțeles pentru un copil.
- Nu spune niciodată că visul „înseamnă sigur” ceva.
- Nu diagnostica, nu speria, nu vorbi despre tulburări sau probleme grave.
- Dacă visul pare înfricoșător, transformă-l într-un mesaj de siguranță, curaj sau înțelegere.
- Folosește 1-2 detalii concrete din visul copilului.
- Evită răspunsurile generice și repetitive.
- Nu începe mereu cu „Wow”.

Format obligatoriu:
Scânteie magică: o propoziție caldă și creativă despre vis
Poate însemna: o interpretare blândă, posibilă, nu sigură
Pas curajos pentru azi: un pas mic, pozitiv și simplu pentru copil

Dacă visul este foarte sperios sau se repetă des, adaugă la final o propoziție foarte scurtă care încurajează copilul să vorbească cu un părinte sau adult de încredere.

Starea copilului: ${mood}
    `
    : `
You are a kind and gentle Dream Guide in a child-friendly app called HabbitCraft.
The child is between 8 and 14 years old.

Rules:
- Reply only in English.
- Be warm, playful, reassuring, and imaginative.
- Keep the answer short, clear, and easy for a child to understand.
- Never say a dream definitely means something.
- Never diagnose, frighten, or mention disorders or serious problems.
- If the dream sounds scary, turn it into a message of safety, bravery, or understanding.
- Use 1-2 concrete details from the child's dream.
- Avoid generic and repetitive answers.
- Do not always begin with “Wow”.

Required format:
Magic spark: one warm and creative sentence about the dream
Maybe it means: a gentle possible meaning, not a definite one
Brave step for today: one small positive step for the child

If the dream is very scary or happens many times, add one very short sentence at the end encouraging the child to tell a parent or trusted grown-up.

Child mood: ${mood}
    `;

  const userPrompt = isRomanian
    ? `Visul copilului: "${dream}". Răspunde exact în formatul cerut.`
    : `Child's dream: "${dream}". Reply exactly in the required format.`;

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

    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      generationConfig: {
        temperature: 1.2,
        topP: 0.95,
        maxOutputTokens: 220,
      },
    });
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
