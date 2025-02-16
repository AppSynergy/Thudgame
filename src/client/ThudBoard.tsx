"use client";
import { useActionState, useCallback, useEffect, useState } from "react";
import {
  filterMovesFrom,
  isCaptureSquare,
  isMoveSquare,
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
  activeSide: Side;
  yourSide: Side;
  moves: Move[];
  move: (move: Move) => void;
  moveCount: number;
  capture: (square: Square) => void;
}

export default function ThudBoard({
  board,
  activeSide,
  yourSide,
  moves,
  move,
  moveCount,
  capture,
}: ThudBoardProps) {
  // States
  const [availableMoves, setMoves] = useState<Move[] | null>(null);

  // dump user states if we've reset the board.
  useEffect(() => {
    if (moveCount == 0) {
      setMoves(null);
      availableMovesAction(null);
      makeMoveAction(null);
    }
  }, [moveCount]);

  // If we select one of our pieces, show the available moves.
  const showMoves = useCallback(
    (
      previousSquare: ThudSquareType | null,
      currentSquare: ThudSquareType | null
    ) => {
      if (previousSquare == currentSquare) {
        setMoves(null);
        return null;
      }
      if (moves && currentSquare?.algebraic) {
        setMoves(filterMovesFrom(moves, currentSquare.algebraic));
      }

      return currentSquare;
    },
    [moves]
  );

  // Moving to a valid square.
  function makeMove(_previousMove: Move | null, currentMove: Move | null) {
    if (activeSide == yourSide) {
      if (currentMove) {
        move(currentMove);
      }
      setMoves(null);
    }

    return currentMove;
  }

  // Choosing to capture a dwarf piece.
  function chooseCapture(
    _previousCapture: Square | null,
    currentCapture: Square
  ) {
    capture(currentCapture);
    return currentCapture;
  }

  // Action for selecting pieces.
  const [selectedPieceSquare, availableMovesAction] = useActionState(
    showMoves,
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
        selectedPieceSquare={selectedPieceSquare}
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
