import { ThudAi } from "./";
import { Board, Move, Opt, Side, Square, DWARF } from "../game/types";
import { chooseRandom, filterMovesHurlable } from "../game/helper";
import { findNearbyDwarfs } from "../game/search";
import { boardHex210, file, rank } from "../game/Hex210";

function findReinforcingMove(board: Board, moves: Opt<Move[]>): Opt<Move> {
  let reinforcingMove = null as Opt<Move>;
  let maxCount = 0;

  moves?.map((move) => {
    const dwarfCount = findNearbyDwarfs(boardHex210[move.to], (sq) => {
      return board?.[rank(sq)]?.[file(sq)]?.piece == DWARF;
    })?.length;
    if (dwarfCount > maxCount) {
      reinforcingMove = move;
      maxCount = dwarfCount;
    }
  });

  return reinforcingMove;
}

export default {
  name: "Rashful",
  description:
    "Rashful predictably makes the first move that comes into his head.",
  ready: false,
  human: false,
  ai: true,
  delay: 300,
  preferredSide: DWARF,
  playingSide: null,

  decideMove: (_side: Side, board: Board, moves: Opt<Move[]>): Opt<Move> => {
    if (!moves) return null;

    const hurlingMoves = filterMovesHurlable(moves);
    if (hurlingMoves.length) return chooseRandom(hurlingMoves) as Move;

    if (Math.random() > 0.1) {
      const reinforcingMove = findReinforcingMove(board, moves);
      if (reinforcingMove) return reinforcingMove;
    }

    return chooseRandom(moves) as Move;
  },

  decideCapture: (_board: Board, squares: Opt<Square[]>): Opt<Square> => {
    if (!squares) return null;
    return squares[0];
  },
} as ThudAi;
