import { ThudAi } from "./";
import { Board, Move, Opt, Square } from "../game/types";

export default {
  name: "Slabhead",
  description:
    "Slabhead considers all possible moves, but then makes one at random.",
  ready: false,

  decideMove: (_board: Opt<Board>, moves: Opt<Move[]>): Opt<Move> => {
    if (!moves) return null;
    const move = moves[Math.floor(Math.random() * moves.length)];
    return move;
  },

  decideCapture: (_board: Opt<Board>, squares: Opt<Square[]>): Opt<Square> => {
    if (!squares) return null;
    const square = squares[Math.floor(Math.random() * squares.length)];
    return square;
  },
} as ThudAi;
