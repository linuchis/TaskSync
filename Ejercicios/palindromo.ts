
/**
 * Determina si una palabra o frase es un palíndromo.
 * Ignora mayúsculas, acentos (diacríticos) y espacios en blanco.
 * * @param word - La cadena de texto a evaluar.
 * @returns true si es palíndromo, false en caso contrario.
 */
export function isPalindrome(word: string): boolean {
  if (!word) return false; // Guard clause para strings vacíos

  const cleanWord = word
    .toLowerCase()
    .normalize("NFD")               // Descompone caracteres (ej: á -> a + ´)
    .replace(/[\u0300-\u036f]/g, "") // Elimina los diacríticos
    .replace(/[^a-z0-9]/g, "");      // Elimina todo lo que no sea alfanumérico (espacios, signos)

  // O(N) - Invertimos y comparamos
  const reversedWord = cleanWord.split("").reverse().join("");

  return cleanWord === reversedWord;
}
//ejemplos pa que salgan:
// console.log(isPalindrome("Anita lava la tina")); // true
// console.log(isPalindrome("Aman a Panamá")); // true