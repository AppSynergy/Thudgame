"use client";
import { startTransition, useCallback } from "react";
import { findMoveTo } from "../game/helper";
import { Move, Side, Square, BoardSquare } from "../game/types";
import ThudPiece from "./ThudPiece";
import "./ThudSquare.css";

interface ThudSquareProps {
  yourSide: Side;
  square: BoardSquare;
  thudSquareClassNames?: string;
  canMoveHere: boolean;
  canCaptureHere: boolean | undefined;
  availableMoves: Move[] | null;
  selectAction: (square: BoardSquare | null) => void;
  moveAction: (move: Move | null) => void;
  captureAction: (square: Square) => void;
}

// Draw a single square of the board.
export default function ThudSquare({
  yourSide,
  square,
  thudSquareClassNames,
  canMoveHere,
  canCaptureHere,
  availableMoves,
  selectAction,
  moveAction,
  captureAction,
}: ThudSquareProps) {
  // Draw the piece if there is one on this square.
  let piece = null;
  if (square.piece) {
    piece = (
      <ThudPiece
        yourSide={yourSide}
        square={square}
        selectAction={selectAction}
      />
    );
  }

  const clickSquare = useCallback(() => {
    if (square?.algebraic) {
      // If you click on a square you can move to, you move there.
      if (canMoveHere) {
        const move = findMoveTo(availableMoves, square.algebraic);
        startTransition(() => {
          moveAction(move);
        });
      }
      // If you click on a dwarf you can capture, capture them.
      if (canCaptureHere) {
        startTransition(() => {
          captureAction(square.algebraic as Square);
        });
      }
    }
  }, [
    availableMoves,
    canMoveHere,
    moveAction,
    canCaptureHere,
    captureAction,
    square.algebraic,
  ]);

  return (
    <div onClick={clickSquare} className={thudSquareClassNames}>
      <div className="label">{square.algebraic}</div>
      {piece}
    </div>
  );
}
