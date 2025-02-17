import {
  useActionState,
  useCallback,
  useEffect,
  useReducer,
  useState,
} from "react";
import ai from "../ai";
import { filterMovesFrom } from "../game/helper";
import { initialState, stateMachine } from "../game/stateMachine";
import { Move, Opt, Side, Square, DWARF } from "../game/types";
import Panel from "./Panel";
import ThudBoard from "./ThudBoard";
import "./App.css";

function App() {
  // State Machine
  const [state, dispatch] = useReducer(stateMachine, initialState);

  // State - Show just the moves for the selected piece.
  const [availableMoves, setAvailableMoves] = useState<Opt<Move[]>>(null);

  // Effect - Start a new game by default.
  useEffect(() => {
    dispatch({ type: "NEW_GAME", yourSide: DWARF });
  }, []);

  // Callback - Handles new game buttons
  const startNewGame = useCallback(
    (yourSide: Side, opponentName: Opt<string>) => {
      const opponent = (opponentName && ai[opponentName]) || null;
      dispatch({ type: "SET_OPPONENT", opponent, yourSide });
      setAvailableMoves(null);
      selectAction(null);
      moveAction(null);
      captureAction(null);
    },
    []
  );

  // Callback - If we select one of our pieces, show the available moves.
  const showAvailableMoves = useCallback(
    (previousSquare: Opt<Square>, currentSquare: Opt<Square>) => {
      // Deselect a piece
      if (previousSquare == currentSquare) {
        setAvailableMoves(null);
        return null;
      }
      if (state.moves && currentSquare) {
        setAvailableMoves(filterMovesFrom(state.moves, currentSquare));
        return currentSquare;
      }
      return null;
    },
    [state.moves]
  );

  // Callback - Moving to a valid square.
  const makeMove = useCallback((_prevMove: Opt<Move>, move: Opt<Move>) => {
    if (move) dispatch({ type: "MAKE_MOVE", move });
    setAvailableMoves(null);
    return move;
  }, []);

  // Callback - Choosing to capture a dwarf piece.
  const chooseCapture = useCallback(
    (_prevCapture: Opt<Square>, capture: Opt<Square>) => {
      if (capture) dispatch({ type: "CHOOSE_CAPTURE", capture });
      return capture;
    },
    []
  );

  // Callback - Handles AI logic
  useEffect(() => {
    const ai = state.opponent;
    if (ai && state.activeSide == state.theirSide) {
      const move = ai?.decideMove(state.moves);
      const capture = move?.capturable
        ? ai?.decideCapture(move.capturable)
        : null;
      dispatch({ type: "AI_TURN", move, capture });
    }
  }, [state.moves, state.opponent, state.activeSide, state.theirSide]);

  // Action for selecting pieces.
  const [selected, selectAction] = useActionState(showAvailableMoves, null);

  // Action for making moves.
  const [lastMove, moveAction] = useActionState(makeMove, null);

  // Action for troll choosing to capture a dwarf.
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_lastCapture, captureAction] = useActionState(chooseCapture, null);

  // Layout
  let thudBoard;
  if (state.board && state.moves) {
    thudBoard = (
      <ThudBoard
        board={state.board}
        yourSide={state.yourSide}
        moves={availableMoves}
        selected={selected}
        lastMove={lastMove}
        selectAction={selectAction}
        moveAction={moveAction}
        captureAction={captureAction}
      />
    );
  }

  const panel = (
    <Panel
      opponent={state.opponent}
      loss={state.loser}
      activeSide={state.activeSide}
      yourSide={state.yourSide}
      moveCount={state.moveCount}
      startNewGame={startNewGame}
    />
  );

  return (
    <div className="game">
      <div className="messages">{panel}</div>
      <div className="thudBoardWrapper">{thudBoard}</div>
    </div>
  );
}

export default App;
