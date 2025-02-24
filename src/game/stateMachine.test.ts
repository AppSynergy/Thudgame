import { DWARF, HUMAN, Move, ThudGame, TROLL } from "./types";
import {
  aiState,
  captureState,
  endOfTurnState,
  moveState,
  newGameState,
  stateMachine,
  GameAction,
  GameState,
} from "./stateMachine";

const move: Move = { piece: TROLL, from: "c8", to: "c7" };

const initialState = (): GameState => {
  const thudGame: ThudGame = {
    board: jest.fn(),
    moves: jest.fn(),
    move: jest.fn(),
    capture: jest.fn(),
    load: jest.fn(),
    reset: jest.fn(),
  };
  return {
    thud: thudGame,
    board: null,
    moves: null,
    moveCount: 0,
    dwarfCount: 0,
    trollCount: 0,
    activeSide: DWARF,
    otherSide: TROLL,
    yourSide: DWARF,
    loser: null,
    players: { [DWARF]: HUMAN, [TROLL]: HUMAN },
  };
};

test("newGameState", () => {
  const state = newGameState(initialState());

  expect(state.board).toHaveLength(15);
  expect(state.board?.[0]).toHaveLength(15);
  expect(state.loser).toBe(null);
});

test("endOfTurnState - play both sides", () => {
  const state = endOfTurnState(initialState());

  expect(state.activeSide).toEqual(TROLL);
  expect(state.otherSide).toEqual(DWARF);
  expect(state.yourSide).toEqual(TROLL);
});

test("endOfTurnState - lose with no moves", () => {
  const state = endOfTurnState(initialState());

  expect(state.activeSide).toEqual(TROLL);
  expect(state.otherSide).toEqual(DWARF);
  expect(state.loser).toBe(TROLL);
  expect(state.players?.[state.activeSide].ready).toBe(false);
});

test("moveState", () => {
  const state = moveState(initialState(), move);

  expect(state.players?.[state.activeSide].ready).toBe(false);
  expect(state.thud?.move).toHaveBeenCalledWith(move);
  expect(state.thud?.board).toHaveBeenCalled();
});

test("captureState", () => {
  const state = captureState(initialState(), "d4");

  expect(state.thud?.capture).toHaveBeenCalledWith("d4");
  expect(state.thud?.board).toHaveBeenCalled();
});

test("aiState", () => {
  const state = aiState(initialState(), move, null);

  expect(state.thud?.move).toHaveBeenCalledWith(move);
  expect(state.thud?.board).toHaveBeenCalled();
  expect(state.thud?.capture).not.toHaveBeenCalled();
});

test("stateMachine", () => {
  const actions: GameAction[] = [
    { type: "NEW_GAME", yourSide: TROLL },
    { type: "MAKE_MOVE", move },
    { type: "SET_MATCHUP", matchup: { [DWARF]: HUMAN, [TROLL]: HUMAN } },
    { type: "CHOOSE_CAPTURE", capture: "i3" },
    { type: "AI_TURN", move, capture: null },
  ];
  expect(stateMachine(initialState(), actions[0]));
  expect(stateMachine(initialState(), actions[1]));
  expect(stateMachine(initialState(), actions[2]));
  expect(stateMachine(initialState(), actions[3]));
  expect(stateMachine(initialState(), actions[4]));
});
