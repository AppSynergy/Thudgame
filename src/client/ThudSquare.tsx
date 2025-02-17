"use client";
import { startTransition, useCallback } from "react";
import { findMoveTo } from "../game/helper";
import { Move, Opt, Side, Square, BoardSquare } from "../game/types";
import ThudPiece from "./ThudPiece";
import "./ThudSquare.css";

interface ThudSquareProps {
  yourSide: Side;
  square: BoardSquare;
  thudSquareClassNames?: string;
  canMoveHere: boolean;
  canCaptureHere: boolean | undefined;
  availableMoves: Opt<Move[]>;
  selectAction: (square: Opt<Square>) => void;
  moveAction: (move: Opt<Move>) => void;
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
      const clickedSquare = square.algebraic as Square;
      // If you click on a square you can move to, you move there.
      if (canMoveHere) {
        startTransition(() => {
          moveAction(findMoveTo(availableMoves, clickedSquare));
          selectAction(null);
        });
      }
      // If you click on a dwarf you can capture, capture them.
      if (canCaptureHere) {
        startTransition(() => {
          captureAction(clickedSquare);
        });
      }
    }
  }, [
    availableMoves,
    canMoveHere,
    canCaptureHere,
    selectAction,
    moveAction,
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
