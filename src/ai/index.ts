import { Board, Move, Opt, Side, Square } from "../game/types";
import Rashful from "./Rashful";
import Slabhead from "./Slabhead";

export interface ThudAi {
  name: string;
  description: string;
  decideMove: (side: Side, board: Opt<Board>, moves: Opt<Move[]>) => Opt<Move>;
  decideCapture: (board: Opt<Board>, squares: Opt<Square[]>) => Opt<Square>;
  ready: boolean;
  human: false;
  ai: true;
  preferredSide: Opt<Side>;
}

export default {
  Rashful,
  Slabhead,
} as Record<string, ThudAi>;
