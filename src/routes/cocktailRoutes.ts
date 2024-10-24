import express, { Request, Response } from 'express';
import { Cocktail } from "../models/cocktail"

const router = express.Router();

let cocktails:  Cocktail[] = [];

router.get("/cocktails", (req: Request, res: Response) => {
   res.json(cocktails);
});

router.get("/cocktails/:id", (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    const cocktail = cocktails.find(c => c.id === id);

    if (cocktail) {
        res.json(cocktail)
    } else {
        res.status(404).json({ error: "Cocktail not found" });
    }
});

router.post("/cocktails", (req: Request, res: Response) => {
    const newCocktail: Cocktail = req.body;

    if (!newCocktail.name || !newCocktail.category || !newCocktail.recipe || !newCocktail.category) {
        res.status(400).json({ error: "All fields are required. "})
    } else {
        newCocktail.id = cocktails.length + 1;
        cocktails.push(newCocktail);
        res.status(201).json(newCocktail)
    }
})

router.put("/cocktails/:id", (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    const updatedData = req.body;

    const cocktailIndex = cocktails.findIndex(c => c.id === id);
    if (cocktailIndex > -1) {
        cocktails[cocktailIndex] = { ...cocktails[cocktailIndex], ...updatedData};
        res.json(cocktails[cocktailIndex])
    } else {
        res.status(404).json({ error: "Cocktail not found"});
    }
})

router.delete("/cocktails/:id", (req: Request, res: Response) => {
    const id = parseInt(req.params.id);

    const cocktailIndex = cocktails.findIndex(c => c.id === id);
    if (cocktailIndex > -1) {
        cocktails.splice(cocktailIndex, 1);
        res.status(200).send('Cocktail deleted');
    } else {
        res.status(404).json({ error: "Cocktail not found"});
    }
})

export default router;