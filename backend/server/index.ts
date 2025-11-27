import express, { Request, Response } from "express";

const app = express();
const port = 3000;

// Endpoint solicitado
app.get("/item", (req: Request, res: Response) => {
  res.json({
    id: 1,
    title: "Demo item",
    completed: false,
  });
});

// Iniciar servidor
app.listen(port, () => {
  console.log(`Servidor ejecutándose en http://localhost:${port}`);
});
