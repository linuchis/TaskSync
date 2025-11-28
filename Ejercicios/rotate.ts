
/**
 * Rota una matriz NxN 90 grados hacia la derecha (sentido horario).
 * Retorna una NUEVA matriz (Inmutabilidad), ideal para evitar efectos secundarios.
 * * @param matrix Matriz bidimensional de números
 * @returns La matriz rotada
 */
export function rotateMatrix(matrix: readonly number[][]): number[][] {
  const n = matrix.length;
  
  // Validación básica de matriz cuadrada (Buenas prácticas defensivas)
  if (n === 0 || matrix[0].length !== n) {
    throw new Error("La matriz debe ser cuadrada (NxN).");
  }

  // Creamos la estructura vacía
  const result: number[][] = Array.from({ length: n }, () => new Array(n));

  // Lógica: La fila 'i' se convierte en la columna 'n-1-i'
  for (let row = 0; row < n; row++) {
    for (let col = 0; col < n; col++) {
      result[col][n - 1 - row] = matrix[row][col];
    }
  }

  return result;
}

// Prueba rápida
/*
const matriz = [
  [1, 2, 3],
  [4, 5, 6],
  [7, 8, 9],
];
console.log(rotateMatrix(matriz));
// Resultado esperado:
// [ [ 7, 4, 1 ], 
//   [ 8, 5, 2 ], 
//   [ 9, 6, 3 ] ]
*/