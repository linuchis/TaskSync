"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rotateMatrix = rotateMatrix;
function rotateMatrix(matrix) {
    const n = matrix.length;
    const result = Array.from({ length: n }, () => Array(n).fill(0));
    for (let row = 0; row < n; row++) {
        for (let col = 0; col < n; col++) {
            result[col][n - 1 - row] = matrix[row][col];
        }
    }
    return result;
}
// Prueba rápida
const matriz = [
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9],
];
console.log(rotateMatrix(matriz));
// Resultado esperado:
// [
//   [7, 4, 1],
//   [8, 5, 2],
//   [9, 6, 3]
// ]
