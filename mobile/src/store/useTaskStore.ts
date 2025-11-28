import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Task } from '../types/task';
import { tasksApi } from '../api/tasksApi';

interface TaskState {
  tasks: Task[];
  isLoading: boolean;
  fetchTasks: () => Promise<void>;
  addTask: (title: string) => Promise<void>; // Actualizado a Promise
  toggleTask: (id: number | string) => void;
  deleteTask: (id: number | string) => void;
  syncPendingTasks: () => Promise<void>; // <--- NUEVA ACCIÓN
  updateTaskTitle: (id: number | string, title: string) => void; // <--- NUEVA ACCIÓN
}

export const useTaskStore = create<TaskState>()(
  persist(
    (set, get) => ({
      tasks: [],
      isLoading: false,

      fetchTasks: async () => {
        set({ isLoading: true });
        try {
          const apiTasks = await tasksApi.getAll();
          // Al traer de la API, asumimos que están sincronizadas
          const formattedTasks = apiTasks.map((t: any) => ({
             ...t,
             isCompleted: t.isCompleted ?? t.completed ?? false, // Soporte doble por si el backend manda uno u otro
             needsSync: false // <--- Importante
          }));
          set({ tasks: formattedTasks, isLoading: false });
        } catch (error) {
          console.log('Modo Offline: Usando datos locales');
          set({ isLoading: false });
        }
      },

      // Lógica de sincronización requerida 
      syncPendingTasks: async () => {
        const state = get();
        const pendingTasks = state.tasks.filter(t => t.needsSync);

        if (pendingTasks.length === 0) return;

        console.log(`Sincronizando ${pendingTasks.length} tareas...`);
        
        // Intentamos subir cada tarea pendiente
        for (const task of pendingTasks) {
          try {
            await tasksApi.create(task.title); // Enviar al backend
            
            // Si tiene éxito, actualizamos localmente para quitar la marca needsSync
            set(currentState => ({
              tasks: currentState.tasks.map(t => 
                t.id === task.id ? { ...t, needsSync: false } : t
              )
            }));
          } catch (error) {
            console.error('Fallo al sincronizar tarea:', task.title);
            // Si falla, se queda marcada para el siguiente intento
          }
        }
        
        // Recargar la lista limpia del servidor al final
        await get().fetchTasks(); 
      },

      addTask: async (title) => {
        // 1. Guardamos visualmente de inmediato (Optimistic Update)
        const tempId = Date.now().toString();
        const newTask: Task = {
            id: tempId,
            title,
            isCompleted: false,
            needsSync: true, // Se asume pendiente hasta confirmar
            createdAt: new Date().toISOString(),
        };

        set((state) => ({ tasks: [...state.tasks, newTask] }));

        // 2. Intentamos enviar a la API
        try {
            await tasksApi.create(title);
            // Si hay internet y pasa, marcamos como sincronizada
            set((state) => ({
                tasks: state.tasks.map(t => 
                    t.id === tempId ? { ...t, needsSync: false } : t
                )
            }));
        } catch (error) {
            // Si falla (Offline), ya está guardada con needsSync: true
            console.log('Guardado localmente (Offline)');
        }
      },

      updateTaskTitle: (id, title) => set((state) => ({
        tasks: state.tasks.map((t) =>
          t.id === id ? { ...t, title, needsSync: true } : t // Marcas needsSync true para que se actualice en backend luego
        ),
      })), // <--- NUEVO






      toggleTask: (id) => set((state) => ({
        tasks: state.tasks.map((t) =>
          t.id === id ? { ...t, isCompleted: !t.isCompleted } : t
        ),
      })),

      deleteTask: (id) => set((state) => ({
        tasks: state.tasks.filter((t) => t.id !== id),
      })),
    }),
    {
      name: 'task-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);