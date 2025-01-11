"use client";
import { startTransition } from "react";
import classNames from "classnames";
import {
  Move,
  Side,
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
  alternateColors,
  availableMoves,
  availableMovesAction,
  makeMoveAction,
}: ThudSquareProps) {
  // Check whether we can move to this square.
  let canMoveHere = false;
  if (
    availableMoves &&
    availableMoves?.map((m: Move) => m.to).includes(square.algebraic)
  ) {
    canMoveHere = true;
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

  const thudSquareClassNames = classNames({
    thudSquare: true,
    canMoveHere: canMoveHere && !square.piece,
    canHurlHere: canMoveHere && yourSide === DWARF && square.piece === TROLL,
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
