"use client";
import { startTransition, useCallback } from "react";
import classNames from "clsx";
import { Move, Side, Square, ThudSquare as ThudSquareType } from "../game/thud";
import ThudPiece from "./ThudPiece";
import "./ThudSquare.css";

interface ThudSquareProps {
  yourSide: Side;
  square: ThudSquareType;
  selectedSquare: ThudSquareType | null;
  alternateColors: number;
  canMoveHere: boolean;
  canCaptureHere: boolean | undefined;
  availableMoves: Move[] | null;
  availableMovesAction: (square: ThudSquareType | null) => void;
  lastMove: Move | null;
  makeMoveAction: (move: Move | null) => void;
  lastCapture: Square | null;
  chooseCaptureAction: (square: Square) => void;
}

// Draw a single square of the board.
export default function ThudSquare({
  yourSide,
  square,
  selectedSquare,
  alternateColors,
  canMoveHere,
  canCaptureHere,
  availableMoves,
  availableMovesAction,
  lastMove,
  makeMoveAction,
  chooseCaptureAction,
}: ThudSquareProps) {
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

  const clickSquare = useCallback(() => {
    if (square?.algebraic) {
      // If you click on a square you can move to, you move there.
      if (canMoveHere && availableMoves) {
        const move: Move | null =
          availableMoves.find((m) => m.to == square.algebraic) || null;

        startTransition(() => {
          makeMoveAction(move);
        });
      }
      // If you click on a dwarf you can capture, capture them.
      if (canCaptureHere) {
        startTransition(() => {
          chooseCaptureAction(square.algebraic as Square);
        });
      }
    }
  }, [
    availableMoves,
    canMoveHere,
    makeMoveAction,
    canCaptureHere,
    chooseCaptureAction,
    square.algebraic,
  ]);

  const thudSquareClassNames = classNames({
    thudSquare: square.algebraic,
    emptySquare: !square.algebraic,
    lastMoveFrom: lastMove?.from == square.algebraic,
    lastMoveTo: lastMove?.to == square.algebraic,
    canMoveHere: canMoveHere && !square.piece,
    canHurlHere: canMoveHere && square.piece,
    canCaptureHere: canCaptureHere,
    dark: alternateColors % 2 === 0,
    light: alternateColors % 2 === 1,
    selectable: yourSide === square.piece,
    selected: square.piece && selectedSquare?.algebraic == square.algebraic,
  });

  return (
    <div onClick={clickSquare} className={thudSquareClassNames}>
      <div className="label">{square.algebraic}</div>
      {piece}
    </div>
  );
}
