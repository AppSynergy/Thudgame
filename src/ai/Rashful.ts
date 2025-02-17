import { ThudAi } from "./";
import { Move, Opt, Square } from "../game/types";

export default {
  name: "Rashful",
  description:
    "Rashful predictably makes the first move that comes into his head.",

  decideMove: (moves: Opt<Move[]>): Opt<Move> => {
    if (!moves) return null;

    return moves[0];
  },

  decideCapture: (squares: Opt<Square[]>): Opt<Square> => {
    if (!squares) return null;

    return squares[0];
  },
} as ThudAi;
