"use client";
import { useActionState, useState } from "react";
import {
  DWARF,
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
  activeSide: Side;
  yourSide: Side;
  moves: Move[];
  move: (move: Move) => void;
}

export default function ThudBoard({
  board,
  activeSide,
  yourSide,
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

  // Enable moving to a valid square.
  function makeMove(_previousMove: Move | null, currentMove: Move) {
    if (activeSide == yourSide) {
      move(currentMove);
      setAvailableMoves(null);
    }

    return currentMove;
  }

  // Action for selecting pieces.
  const [selectedPieceSquare, availableMovesAction] = useActionState(
    showAvailableMoves,
    null
  );

  // Action for making moves.
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
        yourSide={yourSide}
        square={square}
        selectedPieceSquare={selectedPieceSquare}
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

  function sideToText(side: Side) {
    return side == DWARF ? "dwarfs" : "trolls";
  }

  return (
    <>
      <p>Your side is the {sideToText(yourSide)}.</p>
      <p>{sideToText(activeSide)} to move next.</p>
      <div className="thudBoard">{board.map(drawRow)}</div>
    </>
  );
}
