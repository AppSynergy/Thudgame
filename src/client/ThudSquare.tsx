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
  alternateColors: number;
  canMoveHere: boolean;
  canCaptureHere: boolean;
  captureSquares: Square[];
  mostRecentMoveFrom: boolean;
  mostRecentMoveTo: boolean;
  selectedPieceSquare: ThudSquareType | null;
  availableMovesAction: (square: ThudSquareType | null) => void;
  makeMoveAction: (move: Move) => void;
}

// Draw a single square of the board.
export default function ThudSquare({
  yourSide,
  square,
  selectedPieceSquare,
  alternateColors,
  canMoveHere,
  canCaptureHere,
  captureSquares,
  mostRecentMoveFrom,
  mostRecentMoveTo,
  availableMovesAction,
  makeMoveAction,
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

  // If you click on a square you can move to, you move there.
  function clickSquare() {
    // TODO Should we just have the move passed down?
    if (square?.algebraic && selectedPieceSquare?.piece && canMoveHere) {
      const move: Move = {
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
  }

  // Check whether we can move to this square, or capture a dwarf here.

  const thudSquareClassNames = classNames({
    thudSquare: square?.algebraic,
    emptySquare: !square.algebraic,
    mostRecentMoveFrom: mostRecentMoveFrom,
    mostRecentMoveTo: mostRecentMoveTo,
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
