import { ThudAi } from "./";
import { Move } from "../game/types";

export default {
  name: "Slabhead",
  description:
    "Slabhead considers all possible moves, but then makes one at random.",
  decideMove: (moves: Move[]): Move => {
    const move = moves[Math.floor(Math.random() * moves.length)];
    return move;
  },
} as ThudAi;
