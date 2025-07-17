import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { PROMPT_ENHANCE } from "@/prompt";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY as string;

const SYSTEM_INSTRUCTIONS = PROMPT_ENHANCE;

export async function POST(req: NextRequest) {
  try {
    const { value } = await req.json();

    const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    // Pass a single string to generateContent
    const result = await model.generateContent(
      `${SYSTEM_INSTRUCTIONS}\n${value}`
    );

    const enhanced = result.response.text().trim();

    return NextResponse.json({ enhanced });
  } catch (error) {
    console.error("Enhance prompt error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}
