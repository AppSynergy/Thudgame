"use client";
import { useActionState, useCallback, useEffect, useState } from "react";
import { filterMovesFrom, isCaptureSquare, isMoveSquare } from "../game/helper";
import {
  Move,
  Side,
  Square,
  ThudBoard as ThudBoardType,
  ThudSquare as ThudSquareType,
  TROLL,
} from "../game/thud";
import ThudSquare from "./ThudSquare";
import "./ThudBoard.css";

interface ThudBoardProps {
  board: ThudBoardType;
  yourSide: Side;
  moves: Move[];
  move: (move: Move) => void;
  moveCount: number;
  capture: (square: Square) => void;
}

export default function ThudBoard({
  board,
  yourSide,
  moves,
  move,
  moveCount,
  capture,
}: ThudBoardProps) {
  // States
  const [availableMoves, setAvailableMoves] = useState<Move[] | null>(null);

  // Effect - Dump user states if we've reset the board.
  useEffect(() => {
    if (moveCount == 0) {
      setAvailableMoves(null);
      availableMovesAction(null);
      makeMoveAction(null);
    }
  }, [moveCount]);

  // Callback - If we select one of our pieces, show the available moves.
  const showAvailableMoves = useCallback(
    (
      previousSquare: ThudSquareType | null,
      currentSquare: ThudSquareType | null
    ) => {
      // Deselect a piece
      if (previousSquare == currentSquare) {
        setAvailableMoves(null);
        return null;
      }
      if (moves && currentSquare?.algebraic) {
        setAvailableMoves(filterMovesFrom(moves, currentSquare.algebraic));
      }
      return currentSquare;
    },
    [moves]
  );

  // Action - Moving to a valid square.
  const makeMove = useCallback(
    (_previousMove: Move | null, currentMove: Move | null) => {
      if (currentMove) move(currentMove);
      setAvailableMoves(null);
      return currentMove;
    },
    [move]
  );

  // Choosing to capture a dwarf piece.
  const chooseCapture = useCallback(
    (_previousCapture: Square | null, currentCapture: Square) => {
      capture(currentCapture);
      return currentCapture;
    },
    [capture]
  );

  // Action for selecting pieces.
  const [selectedSquare, availableMovesAction] = useActionState(
    showAvailableMoves,
    null
  );

  // Action for making moves.
  const [lastMove, makeMoveAction] = useActionState(makeMove, null);

  // Action for troll choosing to capture a dwarf.
  const [lastCapture, chooseCaptureAction] = useActionState(
    chooseCapture,
    null
  );

  // Dark and light coloured squares.
  let alternateColors = 0;

  // Draw a single square of the board.
  function drawSquare(square: ThudSquareType, keyIndex: number) {
    alternateColors += 1;

    // Check whether we can move to this square, or capture a dwarf here.
    const canMoveHere = isMoveSquare(availableMoves, square?.algebraic);
    const canCaptureHere =
      isCaptureSquare(availableMoves, square?.algebraic) ||
      (yourSide == TROLL &&
        square?.algebraic &&
        lastMove?.capturable &&
        lastMove.capturable.includes(square.algebraic));

    return (
      <ThudSquare
        key={keyIndex}
        yourSide={yourSide}
        square={square}
        selectedSquare={selectedSquare}
        alternateColors={alternateColors}
        canMoveHere={canMoveHere}
        canCaptureHere={canCaptureHere}
        availableMoves={availableMoves}
        availableMovesAction={availableMovesAction}
        lastMove={lastMove}
        makeMoveAction={makeMoveAction}
        lastCapture={lastCapture}
        chooseCaptureAction={chooseCaptureAction}
      />
    );
  }

  // Draw a single row of the board.
  function drawRow(row: ThudSquareType[], keyIndex: number) {
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
