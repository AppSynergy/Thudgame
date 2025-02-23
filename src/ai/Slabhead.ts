import { ThudAi } from "./";
import {
  chooseRandom,
  filterMovesCapturable,
  getOtherSide,
} from "../game/helper";
import { Board, Move, Opt, Side, Square, TROLL } from "../game/types";
import { radialSearch } from "../game/thud";
import { rank, file } from "../game/Hex210";

function findShortestAttackingMove(
  side: Side,
  board: Board,
  moves: Opt<Move[]>
): Opt<Move> {
  let attackingMove = null as Opt<Move>;
  let minDistance = Infinity;

  moves?.map((move) => {
    radialSearch(move.to, ({ to, distance }) => {
      if (board[rank(to)][file(to)].piece == getOtherSide(side)) {
        if (distance < minDistance) {
          minDistance = distance;
          attackingMove = move;
        }
      }
      return false;
    });
  });

  return attackingMove;
}

export default {
  name: "Slabhead",
  description:
    "Slabhead considers all possible moves, but then makes one at random.",
  ready: false,
  preferredSide: TROLL,
  playingSide: null,

  decideMove: (side: Side, board: Board, moves: Opt<Move[]>): Opt<Move> => {
    if (!moves) return null;

    const capturingMoves = filterMovesCapturable(moves);
    if (capturingMoves.length) return chooseRandom(capturingMoves) as Move;

    const attackingMove = findShortestAttackingMove(side, board, moves);
    if (attackingMove) return attackingMove;

    return chooseRandom(moves) as Move;
  },

  decideCapture: (_board: Board, squares: Opt<Square[]>): Opt<Square> => {
    if (!squares) return null;
    const square = chooseRandom(squares) as Square;
    return square;
  },
} as ThudAi;
