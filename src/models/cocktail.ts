import { IngredientQuantity } from "./ingredientQuantity";

export interface Cocktail {
    id: number;
    name: string;
    category: string;
    instructions: string;
    ingredients: IngredientQuantity[];
}