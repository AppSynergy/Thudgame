import { ThudAi } from "./";
import { chooseRandom, filterMovesCapturable } from "../game/helper";
import { Board, Move, Opt, Side, Square, TROLL } from "../game/types";

export default {
  name: "Slabhead",
  description:
    "Slabhead considers all possible moves, but then makes one at random.",
  ready: false,
  preferredSide: TROLL,
  playingSide: null,

  decideMove: (_side: Side, _board: Board, moves: Opt<Move[]>): Opt<Move> => {
    if (!moves) return null;
    const capturingMoves = filterMovesCapturable(moves);
    if (capturingMoves) return chooseRandom(capturingMoves) as Move;

    return chooseRandom(moves) as Move;
  },

  decideCapture: (_board: Board, squares: Opt<Square[]>): Opt<Square> => {
    if (!squares) return null;
    const square = chooseRandom(squares) as Square;
    return square;
  },
} as ThudAi;
