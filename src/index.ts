import express, { Request, Response } from 'express';
import cocktailRoutes from "./routes/cocktailRoutes";
import ingredientRoutes from "./routes/ingredientRoutes";

const app = express();
const port = 3000;


// Middleware do parsowania JSON
app.use(express.json());
app.use(cocktailRoutes);
app.use(ingredientRoutes)

// Przykładowy endpoint GET
app.get('/', (req: Request, res: Response) => {
    res.send('Sram ci do mordy!');
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
