
import { GoogleGenAI, Type } from "@google/genai";
import { ChatMessage, FoodItem, NutritionData } from "./types";

const getApiKey = () => {
  try {
    if (typeof process !== 'undefined' && process.env && process.env.API_KEY) {
      return process.env.API_KEY;
    }
  } catch (e) {}
  return '';
};

const apiKey = getApiKey();
const ai = new GoogleGenAI({ apiKey });

const imageCache = new Map<string, string>();

export const generateDishImage = async (item: FoodItem) => {
  if (!apiKey) return item.image;
  if (imageCache.has(item.id)) return imageCache.get(item.id);

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [{
          text: `Hyper-realistic food photography of ${item.name}. ${item.description}. 8k resolution, Michelin star plating, moody lighting, dark background, 9:16 aspect ratio, no text.`
        }]
      },
      config: {
        imageConfig: { aspectRatio: "9:16" }
      }
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        const dataUrl = `data:image/png;base64,${part.inlineData.data}`;
        imageCache.set(item.id, dataUrl);
        return dataUrl;
      }
    }
  } catch (e) {
    console.error("Image Gen Error", e);
  }
  return item.image;
};

export const getChefResponse = async (history: ChatMessage[], currentMessage: string, foodContext: string) => {
  if (!apiKey) return "The chef is unavailable. Please set your API key.";
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: [
        ...history.map(h => ({ role: h.role, parts: [{ text: h.text }] })),
        { role: 'user', parts: [{ text: currentMessage }] }
      ],
      config: {
        systemInstruction: `You are an expert Chef. Answer briefly (<40 words) about ${foodContext}. Be Appetizing.`
      }
    });
    return response.text;
  } catch (e) {
    return "Chef is busy at the moment!";
  }
};

export const getNutritionInfo = async (item: FoodItem): Promise<NutritionData | null> => {
  if (!apiKey) return null;
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Estimate calories, protein, carbs, fat and health highlight for ${item.name}.`,
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
  } catch (e) {
    return null;
  }
};

export const searchMenu = async (query: string, items: FoodItem[]) => {
  if (!apiKey) return items.map(i => i.id);
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `User: "${query}". Menu: ${JSON.stringify(items.map(i => ({id: i.id, n: i.name, d: i.description})))}. Return matchedIds array.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            matchedIds: { type: Type.ARRAY, items: { type: Type.STRING } }
          },
          required: ["matchedIds"]
        }
      }
    });
    const data = JSON.parse(response.text || '{"matchedIds":[]}');
    return data.matchedIds || [];
  } catch (e) {
    return [];
  }
};
