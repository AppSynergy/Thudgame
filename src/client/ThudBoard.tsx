export default function ThudBoard() {
  function drawSquare() {
    return (
      <div className="w-9 h-9 bg-stone-200 border-2 border-stone-700"></div>
    );
  }

  function drawRow() {
    const row = Array.from(Array(15)).map(drawSquare);

    return <div className="flex">{row}</div>;
  }

  const squares = Array.from(Array(15)).map(drawRow);

  return <div className="thudboard">{squares}</div>;
}
