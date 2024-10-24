import express, {Request, Response} from "express"
import { Ingredient } from "../models/ingredient"

const router = express.Router()

let ingredients: Ingredient[] = [];

router.get("/ingredients", (req: Request, res: Response) => {
    res.json(ingredients);
});

router.get("/ingredients/:id", (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    const ingredient = ingredients.find(i => i.id === id);

    if (ingredient) {
        res.json(ingredient);
    } else {
        res.status(404).json({ error: "Ingredient not found" });
    }
})

router.post("/ingredients", (req: Request, res: Response) => {
    const newIngredient: Ingredient = req.body;

    if (!newIngredient.name || !newIngredient.desc || typeof newIngredient.is_alcoholic !== "boolean") {
        res.status(400).json({ error: "All fields are required. "})
    } else {
        newIngredient.id = ingredients.length + 1
        ingredients.push(newIngredient)
        res.status(201).json(newIngredient)
    }
})

router.put("/ingredients/:id", (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    const updatedData = req.body;

    const ingredientIndex = ingredients.findIndex(i => i.id === id);
    if (ingredientIndex > -1) {
        ingredients[ingredientIndex] = { ...ingredients[ingredientIndex], ...updatedData};
        res.json(ingredients[ingredientIndex])
    } else {
        res.status(404).json({ error: "Ingredient not found"});
    }
})

router.delete("/cocktails/:id", (req: Request, res: Response) => {
    const id = parseInt(req.params.id);

    const ingredientIndex = ingredients.findIndex(c => c.id === id);
    if (ingredientIndex > -1) {
        ingredients.splice(ingredientIndex, 1);
        res.status(200).send('Ingredient deleted');
    } else {
        res.status(404).json({ error: "Ingredient not found"});
    }
})

export default router;