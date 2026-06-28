import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "Gemini API key is not configured." }, { status: 500 });
    }

    const body = await request.json();
    const { ingredients, inputMode, dishName, people, skill, mealType, diet, budget } = body;

    if (inputMode === 'dishName' && (!dishName || dishName.trim().length === 0)) {
      return NextResponse.json({ error: "Dish name is required." }, { status: 400 });
    } else if (inputMode !== 'dishName' && (!ingredients || ingredients.length === 0)) {
      return NextResponse.json({ error: "Ingredients are required." }, { status: 400 });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const basePrompt = inputMode === 'dishName' 
      ? `- Recipe to create: ${dishName}` 
      : `- Ingredients available: ${ingredients}`;

    const prompt = `
      You are an expert, highly traditional Master Chef for a premium kitchen app called Flavora (Rasoi AI).
      Your absolute highest priority is CULTURAL AUTHENTICITY. 
      When generating a recipe, especially for cultural or regional dishes (like Indian, Italian, Mexican, etc.), you MUST provide the most authentic, traditional version of that recipe.
      Do not westernize or generalize the recipe. Use traditional spices, authentic cooking techniques, and culturally accurate ingredient combinations.

      LANGUAGE & TONE:
      Write the instructions and tips in very simple, conversational, and warm language. 
      Feel free to naturally weave in Hindi/Hinglish words where appropriate (especially for Indian dishes), such as using words like 'tadka', 'bhuno', 'masala', 'swaad anusaar', or 'garam', to make it feel like an authentic home chef is teaching them. Keep it accessible but deeply rooted in culture.
      
      Create a highly authentic recipe based on these parameters:
      ${basePrompt}
      - Servings (people): ${people}
      - Skill level: ${skill}
      - Meal type: ${mealType}
      - Dietary preference: ${diet}
      - Budget: ${budget}
      
      Respond strictly in the following JSON format. Do not use Markdown blocks (\`\`\`json), just return raw JSON:
      {
        "recipeName": "Creative Name",
        "cookingTime": "X mins",
        "difficulty": "Easy/Medium/Hard",
        "calories": "X kcal per serving",
        "ingredients": [
          {"name": "Ingredient 1", "quantity": "amount"}
        ],
        "instructions": [
          "Step 1", "Step 2"
        ],
        "chefTips": [
          "Tip 1"
        ],
        "mistakesToAvoid": [
          "Mistake 1"
        ],
        "substitutions": [
          {"original": "Ingredient X", "alternative": "Ingredient Y"}
        ]
      }
    `;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    
    // Clean up potential markdown formatting if the model still includes it
    const cleanText = responseText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    
    const recipeData = JSON.parse(cleanText);

    return NextResponse.json(recipeData);

  } catch (error: any) {
    console.error("Recipe Generation Error:", error);
    return NextResponse.json({ error: error.message || "Failed to generate recipe" }, { status: 500 });
  }
}
