"use client";
import { useActionState, useCallback, useEffect, useState } from "react";
import classNames from "clsx";
import {
  filterMovesFrom,
  isMoveSquare,
  isCaptureSquare,
  isCaptureChoice,
} from "../game/helper";
import {
  Opt,
  Move,
  Side,
  Square,
  Board,
  BoardSquare,
  TROLL,
} from "../game/types";
import ThudSquare from "./ThudSquare";
import "./ThudBoard.css";

interface ThudBoardProps {
  board: Board;
  yourSide: Side;
  moves: Move[];
  moveCount: number;
  move: (move: Move) => void;
  capture: (square: Square) => void;
}

export default function ThudBoard({
  board,
  yourSide,
  moves,
  moveCount,
  move,
  capture,
}: ThudBoardProps) {
  // States
  const [availableMoves, setAvailableMoves] = useState<Opt<Move[]>>(null);

  // Effect - Dump user states if we've reset the board.
  useEffect(() => {
    if (moveCount == 0) {
      setAvailableMoves(null);
      selectAction(null);
      moveAction(null);
    }
  }, [moveCount]);

  // Callback - If we select one of our pieces, show the available moves.
  const showAvailableMoves = useCallback(
    (previousSquare: Opt<Square>, currentSquare: Opt<Square>) => {
      // Deselect a piece
      if (previousSquare == currentSquare) {
        setAvailableMoves(null);
        return null;
      }
      if (moves && currentSquare) {
        setAvailableMoves(filterMovesFrom(moves, currentSquare));
        return currentSquare;
      }
      return null;
    },
    [moves]
  );

  // Action - Moving to a valid square.
  const makeMove = useCallback(
    (_previousMove: Opt<Move>, currentMove: Opt<Move>) => {
      if (currentMove) move(currentMove);
      setAvailableMoves(null);
      return currentMove;
    },
    [move]
  );

  // Choosing to capture a dwarf piece.
  const chooseCapture = useCallback(
    (_previousCapture: Opt<Square>, currentCapture: Square) => {
      capture(currentCapture);
      return currentCapture;
    },
    [capture]
  );

  // Action for selecting pieces.
  const [selected, selectAction] = useActionState(showAvailableMoves, null);

  // Action for making moves.
  const [lastMove, moveAction] = useActionState(makeMove, null);

  // Action for troll choosing to capture a dwarf.
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_lastCapture, captureAction] = useActionState(chooseCapture, null);

  // Dark and light coloured squares.
  let alternateColors = 0;

  // Draw a single square of the board.
  function drawSquare(square: BoardSquare, keyIndex: number) {
    alternateColors += 1;

    // Check whether we can move to this square, or capture a dwarf here.
    const canMoveHere = isMoveSquare(availableMoves, square?.algebraic);
    const canCaptureHere =
      isCaptureSquare(availableMoves, square?.algebraic) ||
      (yourSide == TROLL && isCaptureChoice(lastMove, square?.algebraic));

    const thudSquareClassNames = classNames({
      thudSquare: square.algebraic,
      emptySquare: !square.algebraic,
      lastMoveFrom: lastMove?.from == square.algebraic,
      lastMoveTo: lastMove?.to == square.algebraic,
      canMoveHere: canMoveHere && !square.piece,
      canHurlHere: canMoveHere && square.piece,
      canCaptureHere: canCaptureHere,
      dark: alternateColors % 2 === 0,
      light: alternateColors % 2 === 1,
      selectable: yourSide === square.piece,
      selected: square.piece && selected == square.algebraic,
    });

    return (
      <ThudSquare
        key={keyIndex}
        yourSide={yourSide}
        square={square}
        thudSquareClassNames={thudSquareClassNames}
        canMoveHere={canMoveHere}
        canCaptureHere={canCaptureHere}
        availableMoves={availableMoves}
        selectAction={selectAction}
        moveAction={moveAction}
        captureAction={captureAction}
      />
    );
  }

  // Draw a single row of the board.
  function drawRow(row: BoardSquare[], keyIndex: number) {
    const thudRow = row.map(drawSquare);

    return (
      <div key={keyIndex} className="thudRow">
        {thudRow}
      </div>
    );
  }

  return (
    <>
      <div className="thudBoard">{board.map(drawRow)}</div>
    </>
  );
}
