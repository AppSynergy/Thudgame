import {
  ThudBoard as ThudBoardType,
  ThudSquare,
  DWARF,
  TROLL,
} from "../game/thud";
import "./ThudBoard.css";

interface ThudBoardProps {
  board: ThudBoardType;
}

export default function ThudBoard({ board }: ThudBoardProps) {
  let alternateColors = 0;

  function drawSquare(square: ThudSquare, key: number) {
    const alternateColorsClassName =
      alternateColors % 2 == 0 ? "dark" : "light";
    alternateColors += 1;

    let piece;
    let pieceClassName;
    if (square.piece) {
      if (square.piece == DWARF) {
        piece = DWARF;
        pieceClassName = "dwarf";
      } else if (square.piece == TROLL) {
        piece = TROLL;
        pieceClassName = "troll";
      }
    }

    return (
      <div key={key} className={`thudSquare ${alternateColorsClassName}`}>
        <div className="label">{square.algebraic}</div>
        <div className={`piece ${pieceClassName}`}>{square.piece}</div>
      </div>
    );
  }

  function drawRow(row: ThudSquare[], key: number) {
    const thudRow = row.map(drawSquare);
    alternateColors += 1;

    return (
      <div key={key} className="thudRow">
        {thudRow}
      </div>
    );
  }

  return <div className="thudBoard">{board.map(drawRow)}</div>;
}
