import { ThudAi } from "./";
import { Move, Opt } from "../game/types";

export default {
  name: "Rashful",
  description:
    "Rashful predictably makes the first move that comes into his head.",
  decideMove: (moves: Move[]): Opt<Move> => {
    if (!moves) return null;

    const move = moves[0];
    return move;
  },
} as ThudAi;
