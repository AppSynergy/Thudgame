import { ThudAi } from "./";
import { Board, Move, Opt, Side, Square, DWARF } from "../game/types";

export default {
  name: "Rashful",
  description:
    "Rashful predictably makes the first move that comes into his head.",
  ready: false,
  preferredSide: DWARF,
  playingSide: null,

  decideMove: (_side: Side, _board: Board, moves: Opt<Move[]>): Opt<Move> => {
    if (!moves) return null;
    return moves[0];
  },

  decideCapture: (_board: Board, squares: Opt<Square[]>): Opt<Square> => {
    if (!squares) return null;
    return squares[0];
  },
} as ThudAi;
