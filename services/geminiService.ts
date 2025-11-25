import { GoogleGenAI, Type } from "@google/genai";
import { ChatMessage, FoodItem } from "../types";

// Initialize Gemini Client
// In a real app, ensure process.env.API_KEY is set.
const apiKey = process.env.API_KEY || ''; 
const ai = new GoogleGenAI({ apiKey });

// In-memory cache for generated images to keep them "static" during session
const imageCache = new Map<string, string>();

export const generateDishImage = async (item: FoodItem) => {
  if (!apiKey) return item.image;
  
  // Return cached image if available
  if (imageCache.has(item.id)) {
      return imageCache.get(item.id);
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            text: `A hyper-realistic, appetizing, high-resolution vertical food photography shot of ${item.name}. 
            Description: ${item.description}. 
            Context: Professional food styling, cinematic lighting, 4k resolution, Michelin star presentation.
            Aspect Ratio: 9:16.
            Do not include text in the image.`
          }
        ]
      },
      config: {
        // @ts-ignore - Explicitly requested to use Nano Banana with image generation
        imageConfig: {
            aspectRatio: "9:16"
        }
      }
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        const base64Str = part.inlineData.data;
        const mimeType = part.inlineData.mimeType || 'image/png';
        const dataUrl = `data:${mimeType};base64,${base64Str}`;
        
        // Cache the result
        imageCache.set(item.id, dataUrl);
        return dataUrl;
      }
    }
  } catch (error) {
    console.error("Image Gen Error", error);
  }
  
  return item.image; // Fallback to constant image
};

export const getChefResponse = async (history: ChatMessage[], currentMessage: string, foodContext: string) => {
  if (!apiKey) {
      console.warn("No API Key provided");
      return "I'm sorry, I can't connect to the kitchen right now (Missing API Key).";
  }

  try {
    const model = 'gemini-2.5-flash';
    const systemInstruction = `You are an expert Executive Chef at a high-end restaurant. 
    You are passionate, knowledgeable, and friendly. 
    You are currently answering a customer's question about the following dish: "${foodContext}".
    Keep your answers concise (under 50 words) but appetizing. 
    If asked about ingredients or allergens, be precise but creative.`;

    const chat = ai.chats.create({
      model,
      config: {
        systemInstruction,
      },
      history: history.map(h => ({
        role: h.role,
        parts: [{ text: h.text }]
      }))
    });

    const result = await chat.sendMessage({ message: currentMessage });
    return result.text;
  } catch (error) {
    console.error("Chef Chat Error:", error);
    return "The chef is a bit busy right now! Please ask again in a moment.";
  }
};

export const getNutritionInfo = async (item: FoodItem) => {
  if (!apiKey) return null;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Estimate the nutritional values for this dish: "${item.name}". Description: "${item.description}". Ingredients hints: ${item.tags.join(', ')}. Return a JSON object with keys: calories (number), protein (string like '20g'), carbs (string), fat (string), and a 'highlight' (string, a 1-sentence health benefit).`,
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
          }
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
  if (!apiKey) return items.map(i => i.id);

  try {
    const menuContext = items.map(i => ({ id: i.id, name: i.name, description: i.description, tags: i.tags }));
    
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `User Query: "${query}". 
      Menu: ${JSON.stringify(menuContext)}. 
      Select the Food Item IDs that best match the user's craving, mood, or dietary request. 
      Return a JSON object with a property 'matchedIds' which is an array of strings.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
            type: Type.OBJECT,
            properties: {
                matchedIds: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING }
                }
            }
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