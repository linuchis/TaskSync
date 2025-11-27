"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isPalindrome = isPalindrome;
function isPalindrome(word) {
    // Normalizamos la palabra:
    // - convertimos a minúsculas
    // - eliminamos acentos
    // - quitamos espacios
    const clean = word
        .toLowerCase()
        .normalize("NFD") // separa letra + acento
        .replace(/[\u0300-\u036f]/g, "") // quita acentos
        .replace(/\s+/g, ""); // quita espacios
    // Comparamos con su versión invertida
    const reversed = clean.split("").reverse().join("");
    return clean === reversed;
}
// Prueba rápida
console.log(isPalindrome("Anita lava la tina")); // true
console.log(isPalindrome("Hola")); // false
