import { produce } from "immer";
import { Thud } from "./thud";
import {
  Board,
  Matchup,
  Move,
  Opt,
  Side,
  Square,
  ThudGame,
  DWARF,
  HUMAN,
  TROLL,
} from "./types";

export interface GameState {
  thud: Opt<ThudGame>;
  board: Opt<Board>;
  moves: Opt<Move[]>;
  moveCount: number;
  activeSide: Side;
  otherSide: Side;
  yourSide: Side;
  loser: Opt<Side>;
  players: Opt<Matchup>;
  dwarfCount: number;
  trollCount: number;
}

export const initialState = {
  thud: null,
  board: null,
  moves: null,
  moveCount: 0,
  activeSide: DWARF as Side,
  otherSide: TROLL as Side,
  yourSide: DWARF as Side,
  loser: null,
  players: { [DWARF]: HUMAN, [TROLL]: HUMAN },
  dwarfCount: 0,
  trollCount: 0,
};

// Define possible actions
export type GameAction =
  | { type: "NEW_GAME"; yourSide: Side }
  | { type: "SET_MATCHUP"; matchup: Matchup }
  | { type: "MAKE_MOVE"; move: Move }
  | { type: "CHOOSE_CAPTURE"; capture: Square }
  | { type: "AI_TURN"; move: Opt<Move>; capture: Opt<Square> };

// Typical state for new games.
export function newGameState(state: GameState) {
  const newThud = Thud();
  return produce(state, (next) => {
    // Reset the board
    next.thud = newThud;
    next.board = newThud.board();
    next.moveCount = 0;
    next.dwarfCount = 32;
    next.trollCount = 8;
    // Dwarfs always go first
    next.activeSide = DWARF;
    next.otherSide = TROLL;
    next.loser = null;
    next.moves = newThud.moves(next.activeSide);
    // If AI is dwarfs, it goes first.
    if (next.players) next.players[DWARF].ready = true;
  });
}

// Typical state updates for end of a turn.
export function endOfTurnState(state: GameState) {
  return produce(state, (next) => {
    // Swap active side
    next.activeSide = state.otherSide;
    next.otherSide = state.activeSide;
    // Get moves for next player.
    next.moves = next.thud?.moves(next.activeSide) || null;
    // A side loses if it has no moves.
    if (!next.moves?.length) next.loser = next.activeSide;
    // Human might both sides
    if (next.players?.[next.activeSide].human) next.yourSide = next.activeSide;
    // AI player on the other side should move next.
    if (!next.loser && next.players) next.players[next.activeSide].ready = true;
  });
}

export function moveState(state: GameState, move: Move) {
  return produce(state, (next) => {
    next.thud?.move(move);
    if (move.hurl) next.trollCount--;
    next.board = next.thud?.board() || null;
    next.moveCount = next.moveCount + 1;
    // If AI is moving here, it's had its go.
    if (next.players) next.players[next.activeSide].ready = false;
  });
}

export function captureState(state: GameState, capture: Square) {
  return produce(state, (next) => {
    next.thud?.capture(capture);
    next.dwarfCount--;
    next.board = next.thud?.board() || null;
  });
}

export function aiState(
  state: GameState,
  move: Opt<Move>,
  capture: Opt<Square>
) {
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

    case "SET_MATCHUP": {
      const newState = produce(state, (next) => {
        next.players = action.matchup;
        if (next.players[TROLL].human) next.yourSide = TROLL;
        if (next.players[DWARF].human) next.yourSide = DWARF;
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
