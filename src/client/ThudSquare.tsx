"use client";
import { Move, Side, ThudSquare as ThudSquareType } from "../game/thud";
import ThudPiece from "./ThudPiece";

interface ThudSquareProps {
  currentSide: Side;
  square: ThudSquareType;
  alternateColorsClassName: string;
  selectedPiece: ThudSquareType | null;
  availableMoves: Move[] | null;
  availableMovesAction: (square: ThudSquareType | null) => void;
}

// Draw a single square of the board.
export default function ThudSquare({
  currentSide,
  square,
  selectedPiece,
  alternateColorsClassName,
  availableMoves,
  availableMovesAction,
}: ThudSquareProps) {
  let className = alternateColorsClassName;

  if (
    availableMoves &&
    availableMoves?.map((m: Move) => m.to).includes(square.algebraic)
  ) {
    className += " canMoveHere";
  }

  if (currentSide == square.piece) {
    className += " selectable";
  }

  if (selectedPiece?.algebraic == square.algebraic) {
    className += " selected";
  }

  let piece = null;
  if (square.piece) {
    piece = (
      <ThudPiece
        currentSide={currentSide}
        square={square}
        availableMovesAction={availableMovesAction}
      />
    );
  }

  return (
    <div className={`thudSquare ${className}`}>
      <div className="label">{square.algebraic}</div>
      {piece}
    </div>
  );
}
