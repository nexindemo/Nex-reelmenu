
export interface FoodItem {
  id: string;
  name: string;
  price: number;
  description: string;
  pairingNote: string;
  image: string;
  tags: string[];
  spicy?: boolean;
}

export interface CartItem extends FoodItem {
  quantity: number;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

export interface NutritionData {
  calories: number;
  protein: string;
  carbs: string;
  fat: string;
  highlight: string;
}
