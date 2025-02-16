"use client";
import { startTransition } from "react";
import classNames from "clsx";
import {
  Move,
  Side,
  Square,
  ThudSquare as ThudSquareType,
  DWARF,
  TROLL,
} from "../game/thud";
import ThudPiece from "./ThudPiece";
import "./ThudSquare.css";

interface ThudSquareProps {
  yourSide: Side;
  square: ThudSquareType;
  captureSquares: Square[];
  selectedPieceSquare: ThudSquareType | null;
  alternateColors: number;
  canMoveHere: boolean;
  canCaptureHere: boolean;
  availableMoves: Move[] | null;
  availableMovesAction: (square: ThudSquareType | null) => void;
  lastMove: Move | null;
  makeMoveAction: (move: Move) => void;
  lastCapture: Square | null;
  chooseCaptureAction: (square: Square) => void;
}

// Draw a single square of the board.
export default function ThudSquare({
  yourSide,
  square,
  selectedPieceSquare,
  captureSquares,
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

  function clickSquare() {
    // If you click on a square you can move to, you move there.
    if (square?.algebraic && selectedPieceSquare?.piece && canMoveHere) {
      const move: Move = (availableMoves &&
        availableMoves.find((m) => m.to == square.algebraic)) || {
        from: selectedPieceSquare.algebraic as Square,
        to: square.algebraic,
        piece: selectedPieceSquare.piece,
      };
      if (yourSide == TROLL && captureSquares.length) {
        move.capturable = captureSquares;
      }
      startTransition(() => {
        makeMoveAction(move);
      });
    }
    // If you click on a dwarf you can capture, capture them.
    if (square?.algebraic && selectedPieceSquare?.piece && canCaptureHere) {
      startTransition(() => {
        chooseCaptureAction(square.algebraic as Square);
      });
    }
  }

  // Check whether we can move to this square, or capture a dwarf here.

  const thudSquareClassNames = classNames({
    thudSquare: square?.algebraic,
    emptySquare: !square.algebraic,
    lastMoveFrom: lastMove?.from,
    lastMoveTo: lastMove?.to,
    canMoveHere: canMoveHere && !square.piece,
    canHurlHere: canMoveHere && yourSide === DWARF && square.piece === TROLL,
    canCaptureHere: canCaptureHere && yourSide === TROLL,
    dark: alternateColors % 2 === 0,
    light: alternateColors % 2 === 1,
    selectable: yourSide === square.piece,
    selected:
      square.piece && selectedPieceSquare?.algebraic == square.algebraic,
  });

  return (
    <div onClick={clickSquare} className={thudSquareClassNames}>
      <div className="label">{square.algebraic}</div>
      {piece}
    </div>
  );
}
