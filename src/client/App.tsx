import { useEffect, useState } from "react";
import axios from "axios";
import { Thud } from "../game/thud";
import ThudBoard from "./ThudBoard";
import "./App.css";

function App() {
  const [message, setMessage] = useState("");

  async function getMessage() {
    const { data, status } = await axios.get("/api");
    if (status == 200) {
      setMessage(data);
    }
  }

  useEffect(() => {
    getMessage();
  }, []);

  // TODO move to api
  // TODO redraw board
  const thud = Thud();
  const board = thud.board();

  return (
    <>
      <div className="card">{message}</div>
      <p>Hello, thud!</p>
      <div>
        <ThudBoard board={board} />
      </div>
    </>
  );
}

export default App;
