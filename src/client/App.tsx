import { useEffect, useState } from "react";
import axios from "axios";
import { Thud, DWARF } from "../game/thud";
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
  // TODO redraw board
  const thud = Thud();
  const board = thud.board();
  const moves = thud.moves(currentSide);

  return (
    <>
      <div className="card">{message}</div>
      <p>Hello, thud!</p>
      <div>
        <ThudBoard board={board} currentSide={currentSide} moves={moves} />
      </div>
    </>
  );
}

export default App;
