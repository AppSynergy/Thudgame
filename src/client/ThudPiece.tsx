"use client";
import { startTransition } from "react";
import { BoardSquare, Opt, Side, Square } from "../game/types";
import "./ThudPiece.css";

interface ThudPieceProps {
  square: BoardSquare;
  yourSide: Side;
  selectAction: (square: Opt<Square>) => void;
}

export default function ThudPiece({
  square,
  yourSide,
  selectAction,
}: ThudPieceProps) {
  function clickPiece() {
    if (square?.algebraic && yourSide == square.piece) {
      startTransition(() => {
        selectAction(square.algebraic as Square);
      });
    }
  }

  return (
    <div onClick={clickPiece} className="piece">
      <div className="pieceBackground">{square.piece}</div>
    </div>
  );
}
