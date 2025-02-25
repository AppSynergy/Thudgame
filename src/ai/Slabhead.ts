import { ThudAi } from "./";
import { countNearbyDwarfs, findShortestAttackingMoves } from "./lib";
import { chooseRandom, filterMovesCapturable } from "../game/helper";
import { Board, Move, Opt, Side, Square, TROLL } from "../game/types";

export default {
  name: "Slabhead",
  description:
    "Slabhead likes to play directly, throwing the nearest troll into dwarf lines.",
  ready: false,
  human: false,
  ai: true,
  delay: 300,
  preferredSide: TROLL,
  playingSide: null,

  decideMove: (side: Side, board: Board, moves: Opt<Move[]>): Opt<Move> => {
    if (!moves) return null;

    const capturingMoves = filterMovesCapturable(moves);
    if (capturingMoves.length) return chooseRandom(capturingMoves) as Move;

    if (Math.random() > 0.1) {
      const attackingMoves = findShortestAttackingMoves(side, board, moves);
      if (attackingMoves) return chooseRandom(attackingMoves) as Move;
    }

    return chooseRandom(moves) as Move;
  },

  decideCapture: (board: Board, squares: Opt<Square[]>): Opt<Square> => {
    if (!squares) return null;
    const safeCaptures = squares.filter(
      (s) => countNearbyDwarfs(board, s) == 0
    );
    if (safeCaptures.length) return chooseRandom(safeCaptures) as Square;

    return chooseRandom(squares) as Square;
  },
} as ThudAi;
