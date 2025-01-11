import { ThudAi } from "./types";
import { Move } from "../game/thud";

export default {
  name: "Rashful",
  description:
    "Rashful predictably makes the first move that comes into his head.",
  decideMove: (moves: Move[]): Move | null => {
    if (moves.length == 0) return null;

    const move = moves[0];
    return move;
  },
} as ThudAi;
