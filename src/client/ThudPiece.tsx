import { Piece, DWARF, TROLL } from "../game/thud";

interface ThudPieceProps {
  piece?: Piece;
  availableMovesAction?: () => void;
}

export default function ThudPiece({
  piece,
  availableMovesAction,
}: ThudPieceProps) {
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

  function clickPiece() {
    if (availableMovesAction) {
      availableMovesAction();
    }
  }

  return (
    <div onClick={clickPiece} className={`piece ${pieceClassName}`}>
      {pieceIcon}
    </div>
  );
}
