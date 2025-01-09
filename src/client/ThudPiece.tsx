import { Piece, DWARF, TROLL } from "../game/thud";

interface ThudPieceProps {
  piece?: Piece;
}

export default function ThudPiece({ piece }: ThudPieceProps) {
  let pieceIcon;
  let pieceClassName;
  if (piece) {
    if (piece == DWARF) {
      pieceIcon = DWARF;
      pieceClassName = "dwarf";
    } else if (piece == TROLL) {
      pieceIcon = TROLL;
      pieceClassName = "troll";
    }
  }

  return <div className={`piece ${pieceClassName}`}>{pieceIcon}</div>;
}
