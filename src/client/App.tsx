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

  const thud = Thud();
  const board = thud.board();

  return (
    <>
      <h1>Vite + React</h1>
      <div className="card">{message}</div>
      <p className="read-the-docs">Hello, thud!</p>
      <div>
        <ThudBoard board={board} />
      </div>
    </>
  );
}

export default App;
