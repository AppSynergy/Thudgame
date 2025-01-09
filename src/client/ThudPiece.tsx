import { startTransition } from "react";
import { DWARF, TROLL, ThudSquare } from "../game/thud";

interface ThudPieceProps {
  square: ThudSquare;
  availableMovesAction?: (square: ThudSquare | null) => void;
}

export default function ThudPiece({
  square,
  availableMovesAction,
}: ThudPieceProps) {
  let pieceIcon;
  let pieceClassName;
  if (square.piece) {
    if (square.piece == DWARF) {
      pieceIcon = DWARF;
      pieceClassName = "dwarf";
    } else if (square.piece == TROLL) {
      pieceIcon = TROLL;
      pieceClassName = "troll";
    }
  }

  function clickPiece() {
    if (availableMovesAction) {
      startTransition(() => {
        availableMovesAction(square);
      });
    }
  }

  return (
    <div onClick={clickPiece} className={`piece ${pieceClassName}`}>
      {pieceIcon}
    </div>
  );
}
