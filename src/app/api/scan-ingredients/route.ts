import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "Gemini API key is not configured." }, { status: 500 });
    }

    const { imageBase64, mimeType } = await request.json();

    if (!imageBase64 || !mimeType) {
      return NextResponse.json({ error: "Image is required." }, { status: 400 });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    // Using gemini-2.5-flash as it supports vision natively and is super fast
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `
      You are an expert AI chef. Look at this image of food ingredients (like inside a fridge, on a counter, or a receipt).
      Identify all the raw edible ingredients you can clearly see. 
      Do NOT include things like containers, plates, or brands. Just the food item itself (e.g., "Tomato", "Chicken breast", "Milk").
      
      Respond strictly in the following JSON format:
      {
        "ingredients": ["Item 1", "Item 2", "Item 3"]
      }
    `;

    const imagePart = {
      inlineData: {
        data: imageBase64,
        mimeType: mimeType
      },
    };

    const result = await model.generateContent([prompt, imagePart]);
    const responseText = result.response.text();
    
    // Clean up potential markdown formatting
    const cleanText = responseText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    
    const data = JSON.parse(cleanText);

    return NextResponse.json(data);

  } catch (error: any) {
    console.error("Scanner Error:", error);
    return NextResponse.json({ error: error.message || "Failed to scan ingredients" }, { status: 500 });
  }
}
