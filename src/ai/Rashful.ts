import { ThudAi } from "./";
import { Move } from "../game/types";

export default {
  name: "Rashful",
  description:
    "Rashful predictably makes the first move that comes into his head.",
  decideMove: (moves: Move[]): Move => {
    const move = moves[0];
    return move;
  },
} as ThudAi;
