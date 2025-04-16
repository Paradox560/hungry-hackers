import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-pro", generationConfig: {
        responseMimeType: "application/json"
      }
    });

    const { systemPrompt, userPrompt } = await req.json();

    const result = await model.generateContent({
      contents: [
        {
          role: "user",
          parts: [{ text: systemPrompt }]
        },
        {
          role: "user",
          parts: [{ text: userPrompt }]
        }
      ]
    });

    const response = await result.response;
    const textResponse = await response.text();

    // Assuming the response is JSON, parse it
    const information = JSON.parse(textResponse);

    return NextResponse.json(information);
  } catch (error) {
    console.error("GenAI request error:", error);
    return NextResponse.json({ error: "An error occurred processing your request" }, { status: 500 });
  }
}