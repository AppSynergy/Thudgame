import { useCallback, useEffect, useState } from "react";
import ai, { ThudAi } from "../ai";
import { toggleSide } from "../game/helper";
import { Thud } from "../game/thud";
import { Move, Side, Square, Board, DWARF } from "../game/types";
import Panel from "./Panel";
import ThudBoard from "./ThudBoard";
import "./App.css";

function App() {
  // States
  const [moveCount, setMoveCount] = useState(0);
  const [playBothSides, setPlayBothSides] = useState(true);
  const [opponent, setOpponent] = useState<ThudAi | null>(null);
  const [yourSide, setYourSide] = useState<Side>(DWARF);
  const [activeSide, setActiveSide] = useState<Side>(DWARF);
  const [board, setBoard] = useState<Board | null>(null);
  const [moves, setMoves] = useState<Move[] | null>(null);
  const [loss, setLoss] = useState<Side | null>(null);
  const [thud, setThud] = useState(Thud());

  // Effects

  // Initialize game effect
  useEffect(() => {
    setBoard(thud.board());
  }, [thud]);

  // Calculate possible moves effect
  useEffect(() => {
    setMoves(thud.moves(yourSide));
  }, [thud, yourSide]);

  // Callbacks
  // Callback - Handles end of turn logic
  const endOfTurn = useCallback(() => {
    // Swap the active side
    const otherSide = toggleSide(activeSide);
    setActiveSide(otherSide);
    if (playBothSides) {
      setYourSide(toggleSide(activeSide));
    }

    // Get available moves or lose.
    const nextMoves = thud.moves(otherSide);
    if (nextMoves.length > 0) {
      setMoves(nextMoves);
    } else {
      setLoss(otherSide);
    }
  }, [thud, activeSide, playBothSides]);

  // Callback - Handles common move logic
  const moveCommon = useCallback(
    (move: Move | null) => {
      setMoveCount(moveCount + 1);

      // TODO we only need to update two squares, is this efficient?
      setBoard(thud.board());

      // Trolls capturing dwarfs have a choice.
      if (!(move?.capturable && move.capturable.length > 1)) {
        endOfTurn();
      }
    },
    [thud, moveCount, endOfTurn]
  );

  // Callback - Handles AI move logic
  const moveAI = useCallback(() => {
    let move = null;
    if (moves && opponent) {
      move = opponent.decideMove(moves);
      if (move) {
        thud.move(move);
      }
    }
    moveCommon(move);
  }, [thud, moves, moveCommon, opponent]);

  // Effect - AI moves effect
  useEffect(() => {
    if (opponent && activeSide != yourSide) {
      moveAI();
    }
  }, [opponent, moveAI, activeSide, yourSide]);

  // Callback - Handles user move logic
  const moveUser = useCallback(
    (move: Move) => {
      if (!loss) {
        thud.move(move);
        moveCommon(move);
      }
    },
    [thud, loss, moveCommon]
  );

  // Callback - Handles user capture logic
  const captureUser = useCallback(
    (square: Square) => {
      thud.capture(square);
      setBoard(thud.board());
      endOfTurn();
    },
    [thud, endOfTurn]
  );

  // Callback - Handles resetting a new game
  const resetGame = useCallback(() => {
    setMoveCount(0);
    setLoss(null);
    setActiveSide(DWARF);
    setThud(Thud());
  }, []);

  // Callback - Handles new game buttons
  const startNewGame = useCallback(
    (side: Side, opponentName: string | null) => {
      if (opponentName) {
        setOpponent(ai[opponentName]);
        setPlayBothSides(false);
      } else {
        setOpponent(null);
        setPlayBothSides(true);
      }
      setYourSide(side);
      resetGame();
    },
    [resetGame]
  );

  // Layout
  let thudBoard;
  if (board && moves) {
    thudBoard = (
      <ThudBoard
        board={board}
        yourSide={yourSide}
        moves={moves}
        moveCount={moveCount}
        move={moveUser}
        capture={captureUser}
      />
    );
  }

  const panel = (
    <Panel
      opponent={opponent}
      loss={loss}
      activeSide={activeSide}
      yourSide={yourSide}
      moveCount={moveCount}
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
