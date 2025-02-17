import { Move, Square } from "./thud";

// Filter all available moves to only some squares.
function filterMoves(
  moves: Move[],
  square: Square,
  condition: (move: Move) => Square
): Move[] {
  return moves.filter((m) => condition(m) == square);
}

// Filter all available moves to produce just the moves from a given square.
export function filterMovesFrom(moves: Move[], square: Square): Move[] {
  return filterMoves(moves, square, (m) => m.from);
}

// Find the move to a given square.
export function findMoveTo(moves: Move[], square: Square): Move | null {
  return moves.find((m) => m.to == square) || null;
}

// Check if we can move to a square.
export function isMoveSquare(
  moves: Move[] | null,
  square: Square | undefined
): boolean {
  if (moves && square && moves.find((m) => m.to == square)) {
    return true;
  }
  return false;
}

// Check if we can make a capture on a square.
export function isCaptureSquare(
  moves: Move[] | null,
  square: Square | undefined
): boolean {
  if (
    moves?.length &&
    square &&
    moves
      .reduce((ms, m) => {
        ms = ms.concat(m?.capturable as Square[]);
        return ms;
      }, [] as Square[])
      .includes(square)
  ) {
    return true;
  }
  return false;
}
