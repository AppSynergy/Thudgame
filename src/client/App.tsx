import { useEffect, useState } from "react";
import axios from "axios";
import { Move, Side, Thud, DWARF, TROLL } from "../game/thud";
import ThudBoard from "./ThudBoard";
import "./App.css";

function App() {
  const [message, setMessage] = useState("");

  async function getMessage() {
    const { data, status } = await axios.get("/api");
    if (status == 200) {
      setMessage(data.message);
    }
  }

  useEffect(() => {
    getMessage();
  }, []);

  // TODO play as either side
  const currentSide = DWARF as Side;

  // TODO move to api?
  const thud = Thud();
  const [yourSide, setYourSide] = useState(currentSide);
  const [activeSide, setActiveSide] = useState(currentSide);
  const [board, setBoard] = useState(thud.board());
  const [moves, setMoves] = useState(thud.moves(yourSide));

  function toggleSide(side: Side) {
    return side == DWARF ? TROLL : DWARF;
  }

  // Handles move logic
  function move(move: Move) {
    thud.move(move);

    // TODO for now play as both sides.
    const otherSide = toggleSide(activeSide);
    setYourSide(otherSide);
    setActiveSide(otherSide);

    // TODO we only need to update two squares, is this efficient?
    setBoard(thud.board());
    const nextMoves = thud.moves(otherSide);

    if (nextMoves) {
      setMoves(nextMoves);
    }
  }

  return (
    <>
      <p>{message}</p>
      <p>Hello, thud!</p>
      <div>
        <ThudBoard
          board={board}
          activeSide={activeSide}
          yourSide={yourSide}
          moves={moves}
          move={move}
        />
      </div>
    </>
  );
}

export default App;
