import { apiClient } from './client';
import { Task } from '../types/task';

export const tasksApi = {
  // 1. Obtener todas las tareas
  getAll: async (): Promise<Task[]> => {
    const response = await apiClient.get('/tasks');
    return response.data;
  },

  // 2. Crear una tarea nueva
  create: async (title: string): Promise<Task> => {
    // Nota: enviamos 'completed: false' porque es estándar, 
    // pero tu interfaz usa 'isCompleted'. Lo manejamos al recibir.
    const response = await apiClient.post('/tasks', { 
      title, 
      isCompleted: false 
    });
    return response.data;
  },
  
  // 3. Actualizar estado (checkbox)
  update: async (id: number | string, isCompleted: boolean) => {
    const response = await apiClient.put(`/tasks/${id}`, { 
      isCompleted 
    });
    return response.data;
  },

  // 4. Eliminar tarea (Requerido para la sección 3)
  delete: async (id: number | string) => {
    await apiClient.delete(`/tasks/${id}`);
  },

  // ... dentro de tasksApi ...
  
  // 5. Actualizar Título (Nuevo)
  updateTitle: async (id: number | string, title: string) => {
    const response = await apiClient.put(`/tasks/${id}`, { title });
    return response.data;
  }
  


};