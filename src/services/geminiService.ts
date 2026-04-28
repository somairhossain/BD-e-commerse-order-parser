import { GoogleGenAI } from "@google/genai";
import { getBornoSystemPrompt, getProyojonSystemPrompt } from "../lib/prompts";

const API_KEY = process.env.GEMINI_API_KEY;

if (!API_KEY) {
  console.warn("GEMINI_API_KEY is not defined in environment variables.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY || "" });

export type ShopType = "borno" | "proyojon";

export async function parseOrder(text: string, shop: ShopType, products: string[]): Promise<string> {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: text,
      config: {
        systemInstruction: shop === "borno" ? getBornoSystemPrompt(products) : getProyojonSystemPrompt(products),
      },
    });

    const output = response.text || "";
    
    // Sometimes the model might wrap the output in code blocks or include empty lines
    return output.trim()
      .split('\n')
      .map(line => line.replace(/^```csv\n?/, "").replace(/\n?```$/, "").trim())
      .filter(line => line.length > 0)
      .join('\n');
  } catch (error) {
    console.error("Gemini Parsing Error:", error);
    throw new Error("Failed to parse order text. Please try again.");
  }
}
