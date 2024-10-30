import request from 'supertest';
import express from 'express';
import cocktailRoutes from '../routes/cocktailRoutes';
import { readData, writeData } from '../dataService';

const app = express();
app.use(express.json());
app.use(cocktailRoutes);

jest.mock('../dataService', () => ({
    readData: jest.fn(),
    writeData: jest.fn()
}));

const test_data = { cocktails: [
        {
            "id": 1,
            "name": "Mojito",
            "category": "Cocktail",
            "instructions": "Muddle mint leaves with sugar and lime juice. Add rum and top with soda water.",
            "ingredients": [     {
                "name": "Mint",
                "quantity": "10 leaves"
            },
                {
                    "name": "Sugar",
                    "quantity": "2 tsp"
                },
                {
                    "name": "Lime",
                    "quantity": "1"
                },
                {
                    "name": "Rum",
                    "quantity": "50 ml"
                },
                {
                    "name": "Soda Water",
                    "quantity": "to top"
                }
            ]
        },
        {
            "id": 2,
            "name": "Margarita",
            "category": "Cocktail",
            "instructions": "Shake tequila, lime juice, and triple sec with ice. Strain into a salt-rimmed glass.",
            "ingredients": [
                {
                    "name": "Tequila",
                    "quantity": "45 ml"
                },
                {
                    "name": "Lime Juice",
                    "quantity": "30 ml"
                },
                {
                    "name": "Triple Sec",
                    "quantity": "15 ml"
                },
                {
                    "name": "Salt",
                    "quantity": "for rimming the glass"
                }
            ]
        }
    ]}

describe("Cocktail routes", () => {
    beforeEach(() => {
        (readData as jest.Mock).mockReset();
        (writeData as jest.Mock).mockReset();
    });

    it("GET /cocktails should return all cocktails", async () => {
        (readData as jest.Mock).mockResolvedValueOnce(test_data);

        const response = await request(app).get('/cocktails')
        expect(response.status).toBe(200)
        expect(response.body).toEqual([
                {
                    "id": 1,
                    "name": "Mojito",
                    "category": "Cocktail",
                    "instructions": "Muddle mint leaves with sugar and lime juice. Add rum and top with soda water.",
                    "ingredients": [     {
                        "name": "Mint",
                        "quantity": "10 leaves"
                    },
                        {
                            "name": "Sugar",
                            "quantity": "2 tsp"
                        },
                        {
                            "name": "Lime",
                            "quantity": "1"
                        },
                        {
                            "name": "Rum",
                            "quantity": "50 ml"
                        },
                        {
                            "name": "Soda Water",
                            "quantity": "to top"
                        }
                    ]
                },
                {
                    "id": 2,
                    "name": "Margarita",
                    "category": "Cocktail",
                    "instructions": "Shake tequila, lime juice, and triple sec with ice. Strain into a salt-rimmed glass.",
                    "ingredients": [
                        {
                            "name": "Tequila",
                            "quantity": "45 ml"
                        },
                        {
                            "name": "Lime Juice",
                            "quantity": "30 ml"
                        },
                        {
                            "name": "Triple Sec",
                            "quantity": "15 ml"
                        },
                        {
                            "name": "Salt",
                            "quantity": "for rimming the glass"
                        }
                    ]
                }
            ])
    })
    it("GET/cocktails?name=margarita should return all cocktails with margarita in name", async () => {
        (readData as jest.Mock).mockResolvedValueOnce(test_data);

        const response = await request(app).get('/cocktails?name=margarita')
        expect(response.status).toBe(200)
        expect(response.body).toEqual([
            {
                "id": 2,
                "name": "Margarita",
                "category": "Cocktail",
                "instructions": "Shake tequila, lime juice, and triple sec with ice. Strain into a salt-rimmed glass.",
                "ingredients": [
                    {
                        "name": "Tequila",
                        "quantity": "45 ml"
                    },
                    {
                        "name": "Lime Juice",
                        "quantity": "30 ml"
                    },
                    {
                        "name": "Triple Sec",
                        "quantity": "15 ml"
                    },
                    {
                        "name": "Salt",
                        "quantity": "for rimming the glass"
                    }
                ]
            }
        ])
    })
    it("GET/cocktails?ingredientName=sugar should return all cocktails with sugar as an ingredient", async () => {
        (readData as jest.Mock).mockResolvedValueOnce(test_data);

        const response = await request(app).get('/cocktails?ingredientName=sugar')
        expect(response.status).toBe(200)
        expect(response.body).toEqual([
            {
                "id": 1,
                "name": "Mojito",
                "category": "Cocktail",
                "instructions": "Muddle mint leaves with sugar and lime juice. Add rum and top with soda water.",
                "ingredients": [     {
                    "name": "Mint",
                    "quantity": "10 leaves"
                },
                    {
                        "name": "Sugar",
                        "quantity": "2 tsp"
                    },
                    {
                        "name": "Lime",
                        "quantity": "1"
                    },
                    {
                        "name": "Rum",
                        "quantity": "50 ml"
                    },
                    {
                        "name": "Soda Water",
                        "quantity": "to top"
                    }
                ]
            }]
        )
    })
    it("GET/cocktails?sortBy=name should return all ingredients sorted by their name", async () => {
        (readData as jest.Mock).mockResolvedValueOnce(test_data);

        const response = await request(app).get('/cocktails?sortBy=name')
        expect(response.status).toBe(200)
        expect(response.body).toEqual([
            {
                "id": 2,
                "name": "Margarita",
                "category": "Cocktail",
                "instructions": "Shake tequila, lime juice, and triple sec with ice. Strain into a salt-rimmed glass.",
                "ingredients": [
                    {
                        "name": "Tequila",
                        "quantity": "45 ml"
                    },
                    {
                        "name": "Lime Juice",
                        "quantity": "30 ml"
                    },
                    {
                        "name": "Triple Sec",
                        "quantity": "15 ml"
                    },
                    {
                        "name": "Salt",
                        "quantity": "for rimming the glass"
                    }
                ]
            },
            {
                "id": 1,
                "name": "Mojito",
                "category": "Cocktail",
                "instructions": "Muddle mint leaves with sugar and lime juice. Add rum and top with soda water.",
                "ingredients": [     {
                    "name": "Mint",
                    "quantity": "10 leaves"
                },
                    {
                        "name": "Sugar",
                        "quantity": "2 tsp"
                    },
                    {
                        "name": "Lime",
                        "quantity": "1"
                    },
                    {
                        "name": "Rum",
                        "quantity": "50 ml"
                    },
                    {
                        "name": "Soda Water",
                        "quantity": "to top"
                    }
                ]
            }
        ])
    })
    it("GET/cocktails/:id should return a cocktail with a corresponding id", async () => {
        (readData as jest.Mock).mockResolvedValueOnce(test_data);

        const response = await request(app).get('/cocktails/1')
        expect(response.status).toBe(200)
        expect(response.body).toEqual(
            {
                "id": 1,
                "name": "Mojito",
                "category": "Cocktail",
                "instructions": "Muddle mint leaves with sugar and lime juice. Add rum and top with soda water.",
                "ingredients": [     {
                    "name": "Mint",
                    "quantity": "10 leaves"
                },
                    {
                        "name": "Sugar",
                        "quantity": "2 tsp"
                    },
                    {
                        "name": "Lime",
                        "quantity": "1"
                    },
                    {
                        "name": "Rum",
                        "quantity": "50 ml"
                    },
                    {
                        "name": "Soda Water",
                        "quantity": "to top"
                    }
                ]
            }
        )
    })
    it("GET/cocktails/:id should return status 404 if there is no cocktail with that id", async () => {
        (readData as jest.Mock).mockResolvedValueOnce(test_data);

        const response = await request(app).get('/cocktails/3')
        expect(response.status).toBe(404)
    })
    it("POST/cocktails should add a new cocktail", async () => {
        (readData as jest.Mock).mockResolvedValueOnce(test_data);
        (writeData as jest.Mock).mockResolvedValueOnce(undefined)

        const newCocktail = {
            "id": 3,
            "name": "Jagerbomb",
            "category": "Cocktail",
            "instructions": "Jager + red bull.",
            "ingredients": [
                {
                    "name": "Jagermeister",
                    "quantity": "shot"
                },
                {
                    "name": "Red bull",
                    "quantity": "can"
                }
            ]
        };
        const response = await request(app).post('/cocktails').send(newCocktail);

        expect(response.status).toBe(201);
        expect(response.body).toEqual(newCocktail);
    })
    it("POST/cocktails should return status 400 when you try to post invalid data", async () => {
        (readData as jest.Mock).mockResolvedValueOnce(test_data);
        (writeData as jest.Mock).mockResolvedValueOnce(undefined)

        const newCocktail = {
            "id": 3,
            "name": "Jagerbomb",
            "category": "Cocktail",
            "instructions": "Jager + red bull."
        };
        const response = await request(app).post('/cocktails').send(newCocktail);

        expect(response.status).toBe(400);
    })

    it('PUT /cocktails/:id should update a cocktail', async () => {
        (readData as jest.Mock).mockResolvedValueOnce(test_data);
        (writeData as jest.Mock).mockResolvedValueOnce(undefined);

        const updatedCocktail = { name: 'Updated Mojito' };
        const response = await request(app).put('/cocktails/1').send(updatedCocktail);

        expect(response.status).toBe(200);
        expect(response.body.name).toBe('Updated Mojito');
    });

    it('DELETE /cocktails/:id should delete a cocktail', async () => {
        (readData as jest.Mock).mockResolvedValueOnce(test_data);
        (writeData as jest.Mock).mockResolvedValueOnce(undefined);

        const response = await request(app).delete('/cocktails/1');
        expect(response.status).toBe(200);
        expect(response.text).toBe('Cocktail deleted');
    });
})