export type RootStackParamList = {
  Home: undefined;
  // Ahora permitimos que reciba parámetros opcionales
  CreateTask: { taskId?: string; currentTitle?: string } | undefined;
};