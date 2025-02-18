import { produce } from "immer";
import { Thud } from "./thud";
import { ThudAi } from "../ai";
import { getOtherSide } from "./helper";
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

interface GameState {
  thud: Opt<ThudGame>;
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
  thud: null,
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
    next.loser = null;
    next.moves = newThud.moves(next.activeSide);
    // If AI is dwarfs, it goes first.
    if (next.opponent && next.theirSide == DWARF) next.opponent.ready = true;
  });
}

// Typical state updates for end of a turn.
function endOfTurnState(state: GameState) {
  return produce(state, (next) => {
    // Swap active side
    next.activeSide = state.otherSide;
    next.otherSide = state.activeSide;
    if (!state.opponent) {
      // Play both sides
      next.yourSide = state.theirSide;
      next.theirSide = state.yourSide;
    }
    // A side loses if it has no moves.
    next.moves = next.thud?.moves(next.activeSide) || null;
    if (!next.moves?.length) next.loser = next.activeSide;
    // AI opponent should move next.
    if (next.opponent && next.activeSide == next.theirSide)
      next.opponent.ready = true;
  });
}

function moveState(state: GameState, move: Move) {
  return produce(state, (next) => {
    next.thud?.move(move);
    next.board = next.thud?.board() || null;
    next.moveCount = next.moveCount + 1;
    // If AI is moving here, it's had its go.
    if (next.opponent) next.opponent.ready = false;
  });
}

function captureState(state: GameState, capture: Square) {
  return produce(state, (next) => {
    next.thud?.capture(capture);
    next.board = next.thud?.board() || null;
  });
}

function aiState(state: GameState, move: Opt<Move>, capture: Opt<Square>) {
  const movedState = move ? moveState(state, move) : state;
  if (capture) return captureState(movedState, capture);
  return movedState;
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
        next.theirSide = getOtherSide(action.yourSide);
        next.opponent = action.opponent;
      });
      return newGameState(newState);
    }

    case "MAKE_MOVE": {
      const newState = moveState(state, action.move);
      // Trolls capturing dwarfs have a choice to make.
      if (action.move?.capturable?.length) return newState;
      return endOfTurnState(newState);
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
