"use client";
import { useActionState, useCallback, useEffect, useState } from "react";
import {
  filterMovesFrom,
  getCaptureSquares,
  isCaptureSquare,
  isMoveSquare,
  Move,
  Side,
  ThudBoard as ThudBoardType,
  ThudSquare as ThudSquareType,
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
}

export default function ThudBoard({
  board,
  activeSide,
  yourSide,
  moves,
  move,
  moveCount,
}: ThudBoardProps) {
  const [availableMoves, setMoves] = useState<Move[] | null>(null);

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

  // Enable moving to a valid square.
  function makeMove(_previousMove: Move | null, currentMove: Move | null) {
    if (activeSide == yourSide) {
      if (currentMove) {
        move(currentMove);
      }
      setMoves(null);
    }

    return currentMove;
  }

  // Action for selecting pieces.
  const [selectedPieceSquare, availableMovesAction] = useActionState(
    showMoves,
    null
  );

  // Action for making moves.
  const [mostRecentMove, makeMoveAction] = useActionState(makeMove, null);

  // dump user states if we've reset the board.
  useEffect(() => {
    if (moveCount == 0) {
      setMoves(null);
      availableMovesAction(null);
      makeMoveAction(null);
    }
  }, [moveCount]);

  // Dark and light coloured squares.
  let alternateColors = 0;

  // Draw a single square of the board.
  function drawSquare(square: ThudSquareType, keyIndex: number) {
    alternateColors += 1;

    const canMoveHere = isMoveSquare(availableMoves, square?.algebraic);
    const canCaptureHere = isCaptureSquare(availableMoves, square?.algebraic);
    const captureSquares = getCaptureSquares(availableMoves, square?.algebraic);

    return (
      <ThudSquare
        key={keyIndex}
        yourSide={yourSide}
        square={square}
        selectedPieceSquare={selectedPieceSquare}
        alternateColors={alternateColors}
        canMoveHere={canMoveHere}
        canCaptureHere={canCaptureHere}
        captureSquares={captureSquares}
        mostRecentMoveFrom={mostRecentMove?.from === square?.algebraic}
        mostRecentMoveTo={mostRecentMove?.to === square?.algebraic}
        availableMovesAction={availableMovesAction}
        makeMoveAction={makeMoveAction}
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
