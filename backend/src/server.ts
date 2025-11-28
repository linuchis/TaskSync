import express, { Request, Response } from 'express';
import cors from 'cors';

const app = express();
const PORT = 3000;

// Middleware
app.use(cors()); // Importante para que el simulador/celular pueda acceder
app.use(express.json());

// Definición del tipo según la prueba
interface Task {
  id: number;
  title: string;
  completed: boolean;
}

// DATOS EN MEMORIA (Persistencia Opción A)
// Inicializamos con el item requerido en la Sección 2.2 [cite: 65]
let tasks: Task[] = [
  {
    id: 1,
    title: "Demo item",
    completed: false
  }
];

// ENDPOINT 1: Obtener tareas (Requisito 2.2 y 3.1)
app.get('/tasks', (req: Request, res: Response) => {
  res.json(tasks);
});

// ENDPOINT EXTRA (Opcional): Para crear tareas si decides sincronizar
// Aunque la persistencia sea local en la app, tener esto muestra proactividad.
app.post('/tasks', (req: Request, res: Response) => {
  const newTask: Task = {
    id: new Date().getTime(), // ID simple basado en tiempo
    title: req.body.title,
    completed: false
  };
  tasks.push(newTask);
  res.status(201).json(newTask);
});

app.listen(PORT, () => {
  console.log(`Backend corriendo en http://localhost:${PORT}`);
  console.log(`Endpoint listo: http://localhost:${PORT}/tasks`);
});