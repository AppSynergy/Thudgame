import { ThudAi } from "./";
import { findReinforcingMoves } from "./lib";
import { chooseRandom, filterMovesHurlable } from "../game/helper";
import { Board, Move, Opt, Side, Square, DWARF } from "../game/types";

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
      const reinforcingMoves = findReinforcingMoves(board, moves);
      if (reinforcingMoves) return chooseRandom(reinforcingMoves) as Move;
    }

    return chooseRandom(moves) as Move;
  },

  decideCapture: (_board: Board, squares: Opt<Square[]>): Opt<Square> => {
    if (!squares) return null;
    return squares[0];
  },
} as ThudAi;
