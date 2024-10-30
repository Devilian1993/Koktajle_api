import express, { Request, Response } from 'express';
import { Cocktail } from "../models/cocktail"
import {readData, writeData} from "../dataService";
import {Ingredient} from "../models/ingredient";

const router = express.Router();

router.get("/cocktails", async (req: Request, res: Response) => {
    try {
        const data = await readData();
        let cocktails: Cocktail[] = data.cocktails;

        if (req.query.name) {
            const name = req.query.name as string;
            cocktails = cocktails.filter(cocktail => cocktail.name.toLowerCase().includes(name.toLowerCase()))
        }
        if (req.query.category) {
            const category = req.query.category as string;
            cocktails = cocktails.filter(cocktail => cocktail.category.toLowerCase() === category.toLowerCase())
        }
        if (req.query.ingredientName) {
            const ingredientName = req.query.ingredientName as string
            cocktails = cocktails.filter(cocktail => cocktail.ingredients.some(ingredient => ingredient.name.toLowerCase() === ingredientName.toLowerCase()))
        }
        if (req.query.sortBy) {
            const key = req.query.sortBy as keyof Cocktail
            cocktails.sort((a, b) => {
                if (a[key] > b[key]) return 1;
                if (a[key] < b[key]) return -1;
                return 0;
            })
        }
        res.json(cocktails)
    } catch (error) {
        res.status(500).json({ error: 'Failed to read data' });
    }
});

router.get("/cocktails/:id", async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);

    try {
        const data = await readData();
        const cocktails: Cocktail[] = data.cocktails;

        const cocktail = cocktails.find(i => i.id === id);

        if (cocktail) {
            res.json(cocktail);
        } else {
            res.status(404).json({ error: "Cocktail not found" });
        }
    } catch (error) {
        res.status(500).json({ error: "Error reading data" });
    }
})

router.post("/cocktails", async (req: Request, res: Response) => {
    const newCocktail: Cocktail = req.body;
    try {
        const data = await readData();
        if (!newCocktail.name || !newCocktail.category || !newCocktail.instructions || !newCocktail.ingredients) {
            res.status(400).json({error: "All fields are required. "})
        } else {
            newCocktail.id = data.cocktails.length ? Math.max(...data.cocktails.map((c: Cocktail) => c.id)) + 1 : 1;
            data.cocktails.push(newCocktail);
            await writeData(data);
            res.status(201).json(newCocktail);
        }
    } catch (error) {
        res.status(500).json({ error: 'Failed to add cocktail' });
    }
})

router.put('/cocktails/:id', async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    const updatedData = req.body;

    try {
        const data = await readData();
        const cocktails: Cocktail[] = data.cocktails;
        const cocktailIndex: number = cocktails.findIndex(c => c.id === id);

        if (cocktailIndex > -1) {
            data.cocktails[cocktailIndex] = { ...data.cocktails[cocktailIndex], ...updatedData };
            await writeData(data);
            res.json(data.cocktails[cocktailIndex]);
        } else {
            res.status(404).json({ error: 'Cocktail not found' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Failed to update cocktail' });
    }
});

router.delete('/cocktails/:id', async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);

    try {
        const data = await readData();
        const cocktails: Cocktail[] = data.cocktails;
        const cocktailIndex: number = cocktails.findIndex(c => c.id === id);

        if (cocktailIndex > -1) {
            data.cocktails.splice(cocktailIndex, 1);
            await writeData(data);
            res.status(200).send('Cocktail deleted');
        } else {
            res.status(404).json({ error: 'Cocktail not found' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete cocktail' });
    }
});

export default router;