"use client";
import { startTransition } from "react";
import { Side, BoardSquare } from "../game/types";
import "./ThudPiece.css";

interface ThudPieceProps {
  square: BoardSquare;
  yourSide: Side;
  selectAction: (square: BoardSquare | null) => void;
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
