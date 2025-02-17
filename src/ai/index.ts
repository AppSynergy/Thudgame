import { Move, Opt } from "../game/types";
import Rashful from "./Rashful";
import Slabhead from "./Slabhead";

export interface ThudAi {
  name: string;
  description: string;
  decideMove: (moves: Move[]) => Opt<Move>;
}

export default {
  Rashful,
  Slabhead,
} as Record<string, ThudAi>;
