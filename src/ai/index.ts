import { Move, Opt, Square } from "../game/types";
import Rashful from "./Rashful";
import Slabhead from "./Slabhead";

export interface ThudAi {
  name: string;
  description: string;
  decideMove: (moves: Opt<Move[]>) => Opt<Move>;
  decideCapture: (squares: Opt<Square[]>) => Opt<Square>;
}

export default {
  Rashful,
  Slabhead,
} as Record<string, ThudAi>;
