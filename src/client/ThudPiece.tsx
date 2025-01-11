"use client";
import { startTransition } from "react";
import { Side, ThudSquare } from "../game/thud";
import "./ThudPiece.css";

interface ThudPieceProps {
  square: ThudSquare;
  yourSide: Side;
  availableMovesAction?: (square: ThudSquare | null) => void;
}

export default function ThudPiece({
  square,
  yourSide,
  availableMovesAction,
}: ThudPieceProps) {
  function clickPiece() {
    if (yourSide == square.piece && availableMovesAction) {
      startTransition(() => {
        availableMovesAction(square);
      });
    }
  }

  return (
    <div onClick={clickPiece} className="piece">
      <div className="pieceBackground">{square.piece}</div>
    </div>
  );
}
