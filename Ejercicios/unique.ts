

// Definimos la interfaz base requerida por el ejercicio
interface EntityWithId {
  id: number | string;
}

/**
 * * @template T Tipo del objeto que extiende de EntityWithId
 * @param list Lista de objetos a filtrar
 * @returns Nueva lista sin duplicados
 */
export function uniqueItems<T extends EntityWithId>(list: T[]): T[] {
  const seen = new Set<number | string>();
  
  // filter es más declarativo y "limpio" que un bucle for-of manual en este caso
  return list.filter((item) => {
    if (seen.has(item.id)) {
      return false;
    }
    seen.add(item.id);
    return true;
  });
}

// Implementación específica para el ejercicio usando la función genérica
type User = { id: number; name: string };

const users: User[] = [
  { id: 1, name: "Ana" },
  { id: 2, name: "Carlos" },
  { id: 1, name: "Ana Duplicate" },
];

export function uniqueUsers(list: User[]): User[] {
    return uniqueItems(list);
}

// console.log(uniqueUsers(users));