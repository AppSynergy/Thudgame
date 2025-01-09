import { ThudBoard as ThudBoardType, ThudSquare } from "../game/thud";
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

    return (
      <div key={key} className={`thudSquare ${alternateColorsClassName}`}>
        {square.algebraic}
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
