import { produce } from "immer";
import { ThudAi } from "../ai";
import {
  Board,
  Move,
  Opt,
  Side,
  Square,
  ThudGame,
  DWARF,
  TROLL,
} from "./types";
import { Thud } from "./thud";

interface GameState {
  thud: ThudGame;
  board: Opt<Board>;
  moves: Opt<Move[]>;
  moveCount: number;
  activeSide: Side;
  otherSide: Side;
  yourSide: Side;
  theirSide: Side;
  loser: Opt<Side>;
  opponent: Opt<ThudAi>;
}

export const initialState = {
  thud: Thud(),
  board: null,
  moves: null,
  moveCount: 0,
  activeSide: DWARF as Side,
  otherSide: TROLL as Side,
  yourSide: DWARF as Side,
  theirSide: TROLL as Side,
  loser: null,
  opponent: null,
};

// Define possible actions
type GameAction =
  | { type: "NEW_GAME"; yourSide: Side }
  | { type: "SET_OPPONENT"; opponent: Opt<ThudAi>; yourSide: Side }
  | { type: "MAKE_MOVE"; move: Move }
  | { type: "CHOOSE_CAPTURE"; capture: Square }
  | { type: "AI_TURN"; move: Opt<Move>; capture: Opt<Square> };

// Typical state for new games.
function newGameState(state: GameState) {
  const newThud = Thud();
  return produce(state, (next) => {
    // Reset the board
    next.thud = newThud;
    next.board = newThud.board();
    next.moveCount = 0;
    // Dwarfs always go first
    next.activeSide = DWARF;
    next.otherSide = TROLL;
    next.moves = newThud.moves(next.activeSide);
  });
}

function moveState(state: GameState, move: Move) {
  return produce(state, (next) => {
    next.thud.move(move);
    next.board = next.thud.board();
    next.moveCount = next.moveCount + 1;
    //console.log(`move ${move.piece} ${move.from} => ${move.to}`);
  });
}

function captureState(state: GameState, capture: Square) {
  return produce(state, (next) => {
    next.thud.capture(capture);
    next.board = next.thud.board();
    //console.log(`capture on ${capture}`);
  });
}

function aiState(state: GameState, move: Opt<Move>, capture: Opt<Square>) {
  const nextPostMove = move ? moveState(state, move) : state;
  if (capture) return captureState(nextPostMove, capture);
  return nextPostMove;
}

// Typical state updates for end of a turn.
function endOfTurnState(state: GameState) {
  // Upkeep Phase
  return produce(state, (next) => {
    // Swap active side
    next.activeSide = state.otherSide;
    next.otherSide = state.activeSide;
    if (!state.opponent) {
      // Play both sides
      next.yourSide = state.theirSide;
      next.theirSide = state.yourSide;
    }
    next.moves = next.thud.moves(next.activeSide);
    //console.log(`EOT ${state.activeSide} - next ${next.activeSide}`);
  });
}

export const stateMachine = (
  state: GameState,
  action: GameAction
): GameState => {
  switch (action.type) {
    case "NEW_GAME": {
      return newGameState(state);
    }

    case "SET_OPPONENT": {
      const newState = produce(state, (next) => {
        next.yourSide = action.yourSide;
        next.theirSide = action.yourSide == DWARF ? TROLL : DWARF;
        next.opponent = action.opponent;
      });
      return newGameState(newState);
    }

    case "MAKE_MOVE": {
      const newState = moveState(state, action.move);
      if (state.yourSide == TROLL && action.move?.capturable?.length) {
        // Trolls capturing dwarfs have a choice to make.
        return newState;
      } else {
        return endOfTurnState(newState);
      }
    }

    case "CHOOSE_CAPTURE": {
      const newState = captureState(state, action.capture);
      return endOfTurnState(newState);
    }

    case "AI_TURN": {
      const newState = aiState(state, action.move, action.capture);
      return endOfTurnState(newState);
    }

    default:
      return state;
  }
};
