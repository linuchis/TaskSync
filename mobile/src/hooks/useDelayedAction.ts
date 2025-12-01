import { useState, useCallback } from 'react';

// Este hook maneja una lista temporal de IDs y ejecuta una acción después de X tiempo
export const useDelayedAction = (
  finalAction: (id: string | number) => void, // La acción real (ej: borrar/tachar en DB)
  delay: number = 5000 // Tiempo de espera por defecto
) => {
  const [pendingIds, setPendingIds] = useState<string[]>([]);

  const trigger = useCallback((id: string | number) => {
    const idString = id.toString();
    
    // 1. Agregamos visualmente a la lista de "pendientes"
    setPendingIds((prev) => [...prev, idString]);

    // 2. Programamos la acción final
    setTimeout(() => {
      finalAction(id);
      
      // 3. Limpiamos el ID de la lista temporal
      setPendingIds((prev) => prev.filter((i) => i !== idString));
    }, delay);
  }, [finalAction, delay]);

  // Función helper para saber si un ID está en espera
  const isPending = useCallback((id: string | number) => {
    return pendingIds.includes(id.toString());
  }, [pendingIds]);

  return { trigger, isPending };
};