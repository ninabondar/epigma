// @flow
import type { Matrix, Point, TransformationMatrix } from "./types"
import { range } from "ramda"

type _getTransformMatrix = (number, number, number) => TransformationMatrix
export const getTransformMatrix: _getTransformMatrix = (z, x, y) => [
  [z, 0, 0],
  [0, z, 0],
  [x, y, 1]
]

type _serializeTransformationMatrix = TransformationMatrix => string
export const serializeTransformationMatrix: _serializeTransformationMatrix = ([
  [a, b],
  [c, d],
  [e, f]
]) => `matrix(${a},${b},${c},${d},${e},${f})`

type _getTransformFns = TransformationMatrix => Point => Point
const getTransformFns: _getTransformFns = ([[a, b], [c, d], [tx, ty]]) => ({
  x,
  y,
  ...rest
}) => ({
  x: a * x + c * y + tx,
  y: b * x + d * y + ty,
  ...rest
})

type _transformPoint = TransformationMatrix => Point => Point
export const transformPoint: _transformPoint = matrix => {
  const transformFn = getTransformFns(matrix)

  transformFn.matrix = matrix
  transformFn.invert = getTransformFns(invertMatrix(matrix))

  return transformFn
}

type _multiplyMatrix = (Matrix, Matrix) => Matrix
export const multiplyMatrix: _multiplyMatrix = (A, B) =>
  range(0, A.length)
    .map(() => range(0, B[0].length))
    .map((row, i) =>
      row.map((val, j) => A[i].reduce((sum, elm, k) => sum + elm * B[k][j], 0))
    )

const clone = a => JSON.parse(JSON.stringify(a))

type _invertMatrix = Matrix => Matrix
// Returns the inverse of matrix `M`.
export const invertMatrix: _invertMatrix = matrix => {
  // I use Guassian Elimination to calculate the inverse:
  // (1) 'augment' the matrix (left) by the identity (on the right)
  // (2) Turn the matrix on the left into the identity by elemetry row ops
  // (3) The matrix on the right is the inverse (was the identity matrix)
  // There are 3 elemtary row ops: (I combine b and c in my code)
  // (a) Swap 2 rows
  // (b) Multiply a row by a scalar
  // (c) Add 2 rows

  //if the matrix isn't square: exit (error)
  if (matrix.length !== matrix[0].length) throw Error("Matrix is not square")

  //create the identity matrix (I), and a copy (C) of the original
  let i = 0,
    ii = 0,
    j = 0,
    dim = matrix.length,
    e = 0,
    I = matrix.map((row, i) => row.map((_, j) => (i === j ? 1 : 0))), //create diagonal matrix;
    C = clone(matrix)

  // Perform elementary row operations
  for (i = 0; i < dim; i += 1) {
    // get the element e on the diagonal
    e = C[i][i]

    // if we have a 0 on the diagonal (we'll need to swap with a lower row)
    if (e === 0) {
      //look through every row below the i'th row
      for (ii = i + 1; ii < dim; ii += 1) {
        //if the ii'th row has a non-0 in the i'th col
        if (C[ii][i] !== 0) {
          //it would make the diagonal have a non-0 so swap it
          for (j = 0; j < dim; j++) {
            e = C[i][j] //temp store i'th row
            C[i][j] = C[ii][j] //replace i'th row by ii'th
            C[ii][j] = e //repace ii'th by temp
            e = I[i][j] //temp store i'th row
            I[i][j] = I[ii][j] //replace i'th row by ii'th
            I[ii][j] = e //repace ii'th by temp
          }
          //don't bother checking other rows since we've swapped
          break
        }
      }
      //get the new diagonal
      e = C[i][i]
      //if it's still 0, not invertable (error)
      if (e === 0) throw Error("Matrix is not invertable")
    }

    // Scale this row down by e (so we have a 1 on the diagonal)
    for (j = 0; j < dim; j++) {
      C[i][j] = C[i][j] / e //apply to original matrix
      I[i][j] = I[i][j] / e //apply to identity
    }

    // Subtract this row (scaled appropriately for each row) from ALL of
    // the other rows so that there will be 0's in this column in the
    // rows above and below this one
    for (ii = 0; ii < dim; ii++) {
      // Only apply to other rows (we want a 1 on the diagonal)
      if (ii === i) continue

      // We want to change this element to 0
      e = C[ii][i]

      // Subtract (the row above(or below) scaled by e) from (the
      // current row) but start at the i'th column and assume all the
      // stuff left of diagonal is 0 (which it should be if we made this
      // algorithm correctly)
      for (j = 0; j < dim; j++) {
        C[ii][j] -= e * C[i][j] //apply to original matrix
        I[ii][j] -= e * I[i][j] //apply to identity
      }
    }
  }

  //we've done all operations, C should be the identity
  //matrix I should be the inverse:
  return I
}

type _multiplyManyMatrices = (...Matrix[]) => Matrix
export const multiplyManyMatrices: _multiplyManyMatrices = (...props) =>
  props.reduce((a: Matrix, b: Matrix): Matrix => multiplyMatrix(a, b))
