export interface Task {
  id: number | string; // string para IDs temporales offline
  title: string;
  isCompleted: boolean;
  needsSync?: boolean; // Para saber si debemos enviarla al backend luego
  createdAt?: string;
}