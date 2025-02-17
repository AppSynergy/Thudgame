import { Opt, Move, Side, Square, DWARF } from "./types";

// Render a side.
export function sideToText(side: Side): string {
  return side == DWARF ? "Dwarfs" : "Trolls";
}

// Filter all available moves to produce just the moves from a given square.
export function filterMovesFrom(moves: Move[], square: Square): Move[] {
  return moves.filter((m) => m.from == square);
}

// Find the move to a given square.
export function findMoveTo(moves: Opt<Move[]>, square: Square): Opt<Move> {
  if (!moves) return null;
  return moves.find((m) => m.to == square) || null;
}

// List the capturable squares.
function listCapturable(moves: Move[]) {
  return moves.reduce((ms, m) => {
    ms = ms.concat(m?.capturable as Square[]);
    return ms;
  }, [] as Square[]);
}

// Check if we can move to a square.
export function isMoveSquare(moves: Opt<Move[]>, square: Square): boolean {
  if (!moves) return false;
  return Boolean(findMoveTo(moves, square));
}

// Check if we can make a capture on a square.
export function isCaptureSquare(moves: Opt<Move[]>, square: Square): boolean {
  if (!moves) return false;
  return listCapturable(moves).includes(square);
}

// Check if we have a capture to resolve.
export function isCaptureChoice(lastMove: Opt<Move>, square: Square): boolean {
  if (!lastMove?.capturable) return false;
  return lastMove.capturable.includes(square);
}
