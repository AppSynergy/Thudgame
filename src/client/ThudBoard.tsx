import "./ThudBoard.css";

export default function ThudBoard() {
  const numbers = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];

  function drawSquare(key: number) {
    return <div key={key} className="thudSquare"></div>;
  }

  function drawRow(key: number) {
    const row = numbers.map(drawSquare);

    return (
      <div key={key} className="thudRow">
        {row}
      </div>
    );
  }

  const squares = numbers.map(drawRow);

  return <div className="thudBoard">{squares}</div>;
}
