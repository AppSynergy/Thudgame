import { Opt, Move, Side, Square, DWARF, TROLL } from "./types";

// Render a side.
export function sideToText(side: Side): string {
  return side == DWARF ? "Dwarfs" : "Trolls";
}

// Get the opposing side.
export function getOtherSide(side: Side): Side {
  return side == DWARF ? TROLL : DWARF;
}

// Choose a random move or square.
export function chooseRandom(list: (Move | Square)[]) {
  return list[Math.floor(Math.random() * list.length)];
}

// Filter moves to produce just the moves from a given square.
export function filterMovesFrom(moves: Move[], square: Square): Move[] {
  return moves.filter((m) => m.from == square);
}

// Filter moves to produce just the moves which capture.
export function filterMovesCapturable(moves: Move[]): Move[] {
  return moves.filter((m) => m.capturable && m.capturable.length > 0);
}

// Find the move to a given square.
export function findMoveTo(moves: Move[], square: Square): Opt<Move> {
  return moves.find((m) => m.to == square) || null;
}

// List the capturable squares.
function listCapturable(moves: Move[]): Square[] {
  return moves.reduce((ms, m) => {
    ms = ms.concat(m.capturable as Square[]);
    return ms;
  }, [] as Square[]);
}

// Check if we can move to a square.
export function isMoveSquare(moves: Opt<Move[]>, square: Square): boolean {
  if (!moves) return false;
  return Boolean(findMoveTo(moves, square));
}

// Check if we can make a capture on a square.
export function isCaptureRisk(moves: Opt<Move[]>, square: Square): boolean {
  if (!moves) return false;
  return listCapturable(moves).includes(square);
}

// Check if we have a capture to resolve.
export function isCaptureHere(
  move: Opt<Move>,
  square: Square,
  side: Side
): boolean {
  if (side == DWARF) return false;
  if (!move?.capturable) return false;
  return move.capturable.includes(square);
}
