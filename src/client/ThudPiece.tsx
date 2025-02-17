"use client";
import { startTransition } from "react";
import { Side, ThudSquare } from "../game/thud";
import "./ThudPiece.css";

interface ThudPieceProps {
  square: ThudSquare;
  yourSide: Side;
  selectAction: (square: ThudSquare | null) => void;
}

export default function ThudPiece({
  square,
  yourSide,
  selectAction,
}: ThudPieceProps) {
  function clickPiece() {
    if (yourSide == square.piece) {
      startTransition(() => {
        selectAction(square);
      });
    }
  }

  return (
    <div onClick={clickPiece} className="piece">
      <div className="pieceBackground">{square.piece}</div>
    </div>
  );
}
