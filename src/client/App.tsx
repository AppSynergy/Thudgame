import { useEffect, useState } from "react";
import axios from "axios";
import { Move, Thud, DWARF } from "../game/thud";
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
  const currentSide = DWARF;

  // TODO move to api
  const thud = Thud();
  let board = thud.board();
  let moves = thud.moves(currentSide);

  // TODO redraw board properly
  function move(move: Move) {
    thud.move(move);
    board = thud.board();
    moves = thud.moves(currentSide);
  }

  return (
    <>
      <div className="card">{message}</div>
      <p>Hello, thud!</p>
      <div>
        <ThudBoard
          board={board}
          currentSide={currentSide}
          moves={moves}
          move={move}
        />
      </div>
    </>
  );
}

export default App;
