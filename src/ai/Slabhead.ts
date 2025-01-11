import { ThudAi } from "./types";
import { Move } from "../game/thud";

export default {
  name: "Slabhead",
  description:
    "Slabhead considers all possible moves, but then makes one at random.",
  decideMove: (moves: Move[]): Move | null => {
    if (moves.length == 0) return null;

    const move = moves[Math.floor(Math.random() * moves.length)];
    return move;
  },
} as ThudAi;
