"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.uniqueUsers = uniqueUsers;
function uniqueUsers(list) {
    const seen = new Set();
    const result = [];
    for (const user of list) {
        if (!seen.has(user.id)) {
            seen.add(user.id);
            result.push(user);
        }
    }
    return result;
}
// Prueba rápida
const users = [
    { id: 1, name: "Ana" },
    { id: 2, name: "Carlos" },
    { id: 1, name: "Ana Duplicate" },
];
console.log(uniqueUsers(users));
// Resultado esperado:
// [ { id: 1, name: "Ana" }, { id: 2, name: "Carlos" } ]
