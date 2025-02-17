import { Move } from "../game/types";
import Rashful from "./Rashful";
import Slabhead from "./Slabhead";

export interface ThudAi {
  name: string;
  description: string;
  decideMove: (moves: Move[]) => Move | null;
}

export default {
  Rashful,
  Slabhead,
} as Record<string, ThudAi>;
