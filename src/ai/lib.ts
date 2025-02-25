import { boardHex210, rank, file, Square } from "../game/Hex210";
import { getOtherSide } from "../game/helper";
import { findNearbyDwarfs, radialSearch } from "../game/search";
import { Board, Move, Opt, Side, DWARF } from "../game/types";

export function countNearbyDwarfs(board: Board, square: Square) {
  return findNearbyDwarfs(boardHex210[square], (sq) => {
    return board?.[rank(sq)]?.[file(sq)]?.piece == DWARF;
  })?.length;
}

export function findReinforcingMoves(board: Board, moves: Opt<Move[]>): Move[] {
  const reinforcingMoves = [] as Move[];
  let maxCount = 0;

  moves?.map((move) => {
    const dwarfCount = countNearbyDwarfs(board, move.to);
    if (dwarfCount > maxCount) {
      reinforcingMoves.push(move);
      maxCount = dwarfCount;
    }
  });

  return reinforcingMoves;
}

export function findShortestAttackingMoves(
  side: Side,
  board: Board,
  moves: Opt<Move[]>
): Move[] {
  const attackingMoves = [] as Move[];
  let minDistance = Infinity;

  moves?.map((move) => {
    radialSearch(boardHex210[move.to], ({ to, distance }) => {
      if (board[rank(to)][file(to)].piece == getOtherSide(side)) {
        if (distance < minDistance) {
          minDistance = distance;
          attackingMoves.push(move);
        }
      }
      return false;
    });
  });

  return attackingMoves;
}
