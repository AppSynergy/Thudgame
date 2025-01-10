"use client";
import { useActionState, useState } from "react";
import {
  filterAvailableMoves,
  Move,
  Side,
  ThudBoard as ThudBoardType,
  ThudSquare as ThudSquareType,
} from "../game/thud";
import ThudSquare from "./ThudSquare";
import "./ThudBoard.css";

interface ThudBoardProps {
  board: ThudBoardType;
  currentSide: Side;
  moves: Move[];
  move: (move: Move) => void;
}

export default function ThudBoard({
  board,
  currentSide,
  moves,
  move,
}: ThudBoardProps) {
  const [availableMoves, setAvailableMoves] = useState<Move[] | null>(null);

  // If we select one of our pieces, show the available moves.
  async function showAvailableMoves(
    previousSquare: ThudSquareType | null,
    currentSquare: ThudSquareType | null
  ) {
    if (previousSquare == currentSquare) {
      setAvailableMoves(null);
      return null;
    }
    if (moves && currentSquare?.algebraic) {
      setAvailableMoves(filterAvailableMoves(moves, currentSquare.algebraic));
    }

    return currentSquare;
  }

  // Keep track of the selected piece.
  const [selectedPiece, availableMovesAction] = useActionState(
    showAvailableMoves,
    null
  );

  // Enable moving to a valid square.
  async function makeMove() {
    await move;
  }
  const [_moveBeingMade, makeMoveAction] = useActionState(makeMove, null);

  // Dark and light coloured squares.
  let alternateColors = 0;

  // Draw a single square of the board.
  function drawSquare(square: ThudSquareType, keyIndex: number) {
    alternateColors += 1;
    const alternateColorsClassName =
      alternateColors % 2 == 0 ? "dark" : "light";

    return (
      <ThudSquare
        key={keyIndex}
        currentSide={currentSide}
        square={square}
        selectedPiece={selectedPiece}
        alternateColorsClassName={alternateColorsClassName}
        availableMoves={availableMoves}
        availableMovesAction={availableMovesAction}
        makeMoveAction={makeMoveAction}
      />
    );
  }

  // Draw a single row of the board.
  function drawRow(row: ThudSquareType[], keyIndex: number) {
    const thudRow = row.map(drawSquare);
    alternateColors += 1;

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
