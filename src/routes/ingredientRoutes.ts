import express, {Request, Response} from "express"
import { Ingredient } from "../models/ingredient"
import { readData, writeData} from "../dataService"

const router = express.Router()

router.get("/ingredients", async (req: Request, res: Response) => {
    try {
        const data = await readData();
        let ingredients: Ingredient[] = data.ingredients

        if (req.query.name) {
            const name = req.query.name as string;
            ingredients = ingredients.filter(ingredient => ingredient.name.toLowerCase().includes(name.toLowerCase()))
        }
        if (req.query.is_alcoholic) {
            const is_alcoholic = req.query.is_alcoholic === "true"
            ingredients = ingredients.filter(ingredient => ingredient.is_alcoholic === is_alcoholic)
        }
        if (req.query.sortBy) {
            const key = req.query.sortBy as keyof Ingredient
            ingredients.sort((a, b) => {
                if (a[key] > b[key]) return 1;
                if (a[key] < b[key]) return -1;
                return 0;
            })
        }
        res.status(200).json(ingredients);
    } catch (error) {
        res.status(500).json({ error: 'Failed to read data' });
    }
});

router.get("/ingredients/:id", async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);

    try {
        const data = await readData();
        const ingredients: Ingredient[] = data.ingredients;

        const ingredient = ingredients.find(i => i.id === id);

        if (ingredient) {
            res.json(ingredient);
        } else {
            res.status(404).json({ error: "Ingredient not found" });
        }
    } catch (error) {
        res.status(500).json({ error: "Error reading data" });
    }
})

router.post("/ingredients", async (req: Request, res: Response) => {
    const newIngredient: Ingredient = req.body;
    try {
        const data = await readData();
        if (!newIngredient.name || !newIngredient.desc || typeof newIngredient.is_alcoholic !== "boolean") {
            res.status(400).json({error: "All fields are required. "})
        } else {
            newIngredient.id = data.ingredients.length ? Math.max(...data.ingredients.map((i: Ingredient) => i.id)) + 1 : 1;
            data.ingredients.push(newIngredient);
            await writeData(data);
            res.status(201).json(newIngredient);
        }
    } catch (error) {
        res.status(500).json({ error: 'Failed to add ingredient' });
    }
})

router.put('/ingredients/:id', async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    const updatedData = req.body;

    try {
        const data = await readData();
        const ingredients: Ingredient[] = data.ingredients;
        const ingredientIndex: number = ingredients.findIndex(i => i.id === id);

        if (ingredientIndex > -1) {
            data.ingredients[ingredientIndex] = { ...data.ingredients[ingredientIndex], ...updatedData };
            await writeData(data);
            res.json(data.ingredients[ingredientIndex]);
        } else {
            res.status(404).json({ error: 'Ingredient not found' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Failed to update ingredient' });
    }
});

router.delete('/ingredients/:id', async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);

    try {
        const data = await readData();
        const ingredients: Ingredient[] = data.ingredients;
        const ingredientIndex: number = ingredients.findIndex(i => i.id === id);

        if (ingredientIndex > -1) {
            data.ingredients.splice(ingredientIndex, 1);
            await writeData(data);
            res.status(200).send('Ingredient deleted');
        } else {
            res.status(404).json({ error: 'Ingredient not found' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete ingredient' });
    }
});

export default router;