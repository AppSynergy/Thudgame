"use client";
import { startTransition } from "react";
import { Move, Side, ThudSquare as ThudSquareType } from "../game/thud";
import ThudPiece from "./ThudPiece";

interface ThudSquareProps {
  yourSide: Side;
  square: ThudSquareType;
  alternateColorsClassName: string;
  selectedPieceSquare: ThudSquareType | null;
  availableMoves: Move[] | null;
  availableMovesAction: (square: ThudSquareType | null) => void;
  makeMoveAction: (move: Move) => void;
}

// Draw a single square of the board.
export default function ThudSquare({
  yourSide,
  square,
  selectedPieceSquare,
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

  if (yourSide == square.piece) {
    className += " selectable";

    if (selectedPieceSquare?.algebraic == square.algebraic) {
      className += " selected";
    }
  }

  // Draw the piece if there is one on this square.
  let piece = null;
  if (square.piece) {
    piece = (
      <ThudPiece
        yourSide={yourSide}
        square={square}
        availableMovesAction={availableMovesAction}
      />
    );
  }

  function clickSquare() {
    if (selectedPieceSquare?.piece && canMoveHere) {
      const move: Move = {
        from: selectedPieceSquare.algebraic,
        to: square.algebraic,
        piece: selectedPieceSquare.piece,
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
