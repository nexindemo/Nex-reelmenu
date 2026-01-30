
import { GoogleGenAI, Type } from "@google/genai";
import { ChatMessage, FoodItem, NutritionData } from "./types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

const imageCache = new Map<string, string>();

export const generateDishImage = async (item: FoodItem) => {
  if (imageCache.has(item.id)) return imageCache.get(item.id);

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            text: `A hyper-realistic, appetizing, high-resolution vertical food photography shot of ${item.name}. Description: ${item.description}. Professional styling, cinematic lighting, 4k resolution, Michelin star presentation. Aspect Ratio: 9:16. No text.`
          }
        ]
      },
      config: {
        imageConfig: {
          aspectRatio: "9:16"
        }
      }
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        const base64Str = part.inlineData.data;
        const dataUrl = `data:image/png;base64,${base64Str}`;
        imageCache.set(item.id, dataUrl);
        return dataUrl;
      }
    }
  } catch (error) {
    console.error("Image Gen Error", error);
  }
  return item.image;
};

export const getChefResponse = async (history: ChatMessage[], currentMessage: string, foodContext: string) => {
  try {
    const systemInstruction = `You are an expert Executive Chef. 
    You are answering a customer about: "${foodContext}".
    Keep answers concise (<50 words) and appetizing.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: [
        ...history.map(h => ({ role: h.role, parts: [{ text: h.text }] })),
        { role: 'user', parts: [{ text: currentMessage }] }
      ],
      config: { systemInstruction }
    });

    return response.text;
  } catch (error) {
    console.error("Chef Chat Error:", error);
    return "The chef is busy right now! Please try again.";
  }
};

export const getNutritionInfo = async (item: FoodItem): Promise<NutritionData | null> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Estimate nutritional values for: "${item.name}". Description: "${item.description}".`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            calories: { type: Type.INTEGER },
            protein: { type: Type.STRING },
            carbs: { type: Type.STRING },
            fat: { type: Type.STRING },
            highlight: { type: Type.STRING },
          },
          required: ["calories", "protein", "carbs", "fat", "highlight"]
        }
      }
    });
    
    return JSON.parse(response.text || '{}');
  } catch (error) {
    console.error("Nutrition AI Error:", error);
    return null;
  }
};

export const searchMenu = async (query: string, items: FoodItem[]) => {
  try {
    const menuContext = items.map(i => ({ id: i.id, name: i.name, description: i.description, tags: i.tags }));
    
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `User Query: "${query}". Menu: ${JSON.stringify(menuContext)}. Select Food Item IDs that match.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
            type: Type.OBJECT,
            properties: {
                matchedIds: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING }
                }
            },
            required: ["matchedIds"]
        }
      }
    });

    const data = JSON.parse(response.text || '{ "matchedIds": [] }');
    return data.matchedIds || [];
  } catch (error) {
    console.error("Search AI Error:", error);
    return [];
  }
};
