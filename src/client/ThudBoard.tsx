import { board, ThudSquare } from "../game/thud";
import "./ThudBoard.css";

export default function ThudBoard() {
  function drawSquare(square: ThudSquare, key: number) {
    return (
      <div key={key} className="thudSquare">
        {square.algebraic}
      </div>
    );
  }

  function drawRow(row: ThudSquare[], key: number) {
    const thudRow = row.map(drawSquare);

    return (
      <div key={key} className="thudRow">
        {thudRow}
      </div>
    );
  }

  const squares = board().map(drawRow);

  return <div className="thudBoard">{squares}</div>;
}
