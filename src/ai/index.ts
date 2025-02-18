import { Board, Move, Opt, Square } from "../game/types";
import Rashful from "./Rashful";
import Slabhead from "./Slabhead";

export interface ThudAi {
  name: string;
  description: string;
  decideMove: (board: Opt<Board>, moves: Opt<Move[]>) => Opt<Move>;
  decideCapture: (board: Opt<Board>, squares: Opt<Square[]>) => Opt<Square>;
  ready: boolean;
}

export default {
  Rashful,
  Slabhead,
} as Record<string, ThudAi>;
