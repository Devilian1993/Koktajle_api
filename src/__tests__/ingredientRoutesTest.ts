import request from 'supertest';
import express from 'express';
import ingredientRoutes from '../routes/ingredientRoutes';
import { readData, writeData } from '../dataService';

const app = express();
app.use(express.json());
app.use(ingredientRoutes);

jest.mock('../dataService', () => ({
    readData: jest.fn(),
    writeData: jest.fn()
}));

describe('Ingredient Routes', () => {
    beforeEach(() => {
        (readData as jest.Mock).mockReset();
        (writeData as jest.Mock).mockReset();
    });

    it('GET /ingredients should return all ingredients', async () => {
        (readData as jest.Mock).mockResolvedValueOnce({ ingredients: [{ id: 1, name: 'Whiskey', desc: "Whiskey", is_alcoholic: true }] });

        const response = await request(app).get('/ingredients');
        expect(response.status).toBe(200);
        expect(response.body).toEqual([{ id: 1, name: 'Whiskey', desc: "Whiskey", is_alcoholic: true }]);
    });

    it('GET /ingredients?name=cola should return all ingredients with cola in name', async () => {
        (readData as jest.Mock).mockResolvedValueOnce({ ingredients: [{ id: 1, name: 'Whiskey', desc: "Whiskey", is_alcoholic: true }, { id: 2, name: "lime", desc: "lime", is_alcoholic: false},
                { id: 3, name: "cola", desc: "cola", is_alcoholic: false}, { id: 4, name: "cola zero", desc: "cola zero", is_alcoholic: false}] });

        const response = await request(app).get('/ingredients?name=cola');
        expect(response.status).toBe(200);
        expect(response.body).toEqual([{ id: 3, name: "cola", desc: "cola", is_alcoholic: false}, { id: 4, name: "cola zero", desc: "cola zero", is_alcoholic: false}]);
    });

    it('GET /ingredients?is_alcoholic=false should return all non alcoholic ingredients', async () => {
        (readData as jest.Mock).mockResolvedValueOnce({ ingredients: [{ id: 1, name: 'Whiskey', desc: "Whiskey", is_alcoholic: true }, { id: 2, name: "lime", desc: "lime", is_alcoholic: false} ] });

        const response = await request(app).get('/ingredients?is_alcoholic=false');
        expect(response.status).toBe(200);
        expect(response.body).toEqual([{ id: 2, name: "lime", desc: "lime", is_alcoholic: false}]);
    });

    it('GET /ingredients?sortBy=name should return all ingredients sorted by name descending', async () => {
        (readData as jest.Mock).mockResolvedValueOnce({ ingredients: [{ id: 1, name: 'Whiskey', desc: "Whiskey", is_alcoholic: true }, { id: 2, name: "Lime", desc: "lime", is_alcoholic: false} ] });

        const response = await request(app).get('/ingredients?sortBy=name');
        expect(response.status).toBe(200);
        expect(response.body).toEqual([{ id: 2, name: "Lime", desc: "lime", is_alcoholic: false}, { id: 1, name: 'Whiskey', desc: "Whiskey", is_alcoholic: true }]);
    });

    it('GET /ingredients/:id should return an element with that id', async () => {
        (readData as jest.Mock).mockResolvedValueOnce({ ingredients: [{ id: 1, name: 'Whiskey', desc: "Whiskey", is_alcoholic: true }, { id: 2, name: "lime", desc: "lime", is_alcoholic: false},
                { id: 3, name: "cola", desc: "cola", is_alcoholic: false}, { id: 4, name: "cola zero", desc: "cola zero", is_alcoholic: false}] });

        const response = await request(app).get('/ingredients/3');
        expect(response.status).toBe(200);
        expect(response.body).toEqual({ id: 3, name: "cola", desc: "cola", is_alcoholic: false});
    });

    it('GET /ingredients/:id should return status 404 if there is no ingredient with that id', async () => {
        (readData as jest.Mock).mockResolvedValueOnce({ ingredients: [{ id: 1, name: 'Whiskey', desc: "Whiskey", is_alcoholic: true }, { id: 2, name: "Lime", desc: "lime", is_alcoholic: false} ] });

        const response = await request(app).get('/ingredients/3')
        expect(response.status).toBe(404);
    })

    it('POST /ingredients should add a new ingredient', async () => {
        (readData as jest.Mock).mockResolvedValueOnce({ ingredients: [{ id: 1, name: 'Whiskey', desc: "Whiskey", is_alcoholic: true }] });
        (writeData as jest.Mock).mockResolvedValueOnce(undefined);

        const newIngredient = { id: 2, name: 'Vodka', desc: "Vodka", is_alcoholic: true };
        const response = await request(app).post('/ingredients').send(newIngredient);

        expect(response.status).toBe(201);
        expect(response.body).toEqual(newIngredient);
    });

    it('POST /ingredients should return status 400 when you try to post invalid data', async () => {
        (readData as jest.Mock).mockResolvedValueOnce({ ingredients: [{ id: 1, name: 'Whiskey', desc: "Whiskey", is_alcoholic: true }] });
        (writeData as jest.Mock).mockResolvedValueOnce(undefined);

        const newIngredient = { id: 2, desc: "Vodka", is_alcoholic: true };
        const response = await request(app).post('/ingredients').send(newIngredient);

        expect(response.status).toBe(400);
    });

    it('PUT /ingredients/:id should update an ingredient', async () => {
        (readData as jest.Mock).mockResolvedValueOnce({
            ingredients: [{ id: 1, name: 'Whiskey', desc: "Whiskey", is_alcoholic: true }],
        });
        (writeData as jest.Mock).mockResolvedValueOnce(undefined);

        const updatedIngredient = { name: 'Updated Whiskey' };
        const response = await request(app).put('/ingredients/1').send(updatedIngredient);

        expect(response.status).toBe(200);
        expect(response.body.name).toBe('Updated Whiskey');
    });

    it('DELETE /ingredients/:id should delete an ingredient', async () => {
        (readData as jest.Mock).mockResolvedValueOnce({
            ingredients: [{ id: 1, name: 'Whiskey', desc: "Whiskey", is_alcoholic: true }],
        });
        (writeData as jest.Mock).mockResolvedValueOnce(undefined);

        const response = await request(app).delete('/ingredients/1');
        expect(response.status).toBe(200);
        expect(response.text).toBe('Ingredient deleted');
    });
});
