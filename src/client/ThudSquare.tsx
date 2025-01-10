"use client";
import { startTransition } from "react";
import { Move, Side, ThudSquare as ThudSquareType } from "../game/thud";
import ThudPiece from "./ThudPiece";

interface ThudSquareProps {
  currentSide: Side;
  square: ThudSquareType;
  alternateColorsClassName: string;
  selectedPiece: ThudSquareType | null;
  availableMoves: Move[] | null;
  availableMovesAction: (square: ThudSquareType | null) => void;
  makeMoveAction: (move: Move) => void;
}

// Draw a single square of the board.
export default function ThudSquare({
  currentSide,
  square,
  selectedPiece,
  alternateColorsClassName,
  availableMoves,
  availableMovesAction,
  makeMoveAction,
}: ThudSquareProps) {
  let className = alternateColorsClassName;
  let canMoveHere = false;

  // Classes for the user interface.
  if (
    availableMoves &&
    availableMoves?.map((m: Move) => m.to).includes(square.algebraic)
  ) {
    className += " canMoveHere";
    canMoveHere = true;
  }

  if (currentSide == square.piece) {
    className += " selectable";
  }

  if (selectedPiece?.algebraic == square.algebraic) {
    className += " selected";
  }

  // Draw the piece if there is one on this square.
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

  function clickSquare() {
    if (canMoveHere) {
      // TODO a real move
      const move: Move = {
        from: "a8",
        to: "a7",
        piece: "d",
      };
      startTransition(() => {
        makeMoveAction(move);
      });
    }
  }

  return (
    <div onClick={clickSquare} className={`thudSquare ${className}`}>
      <div className="label">{square.algebraic}</div>
      {piece}
    </div>
  );
}
