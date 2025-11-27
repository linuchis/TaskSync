type User = { id: number; name: string };

export function uniqueUsers(list: User[]): User[] {
  const seen = new Set<number>();
  const result: User[] = [];

  for (const user of list) {
    if (!seen.has(user.id)) {
      seen.add(user.id);
      result.push(user);
    }
  }

  return result;
}

// Prueba rápida
const users: User[] = [
  { id: 1, name: "Ana" },
  { id: 2, name: "Carlos" },
  { id: 1, name: "Ana Duplicate" },
];

console.log(uniqueUsers(users));
// Resultado esperado:
// [ { id: 1, name: "Ana" }, { id: 2, name: "Carlos" } ]
