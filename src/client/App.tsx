import { useEffect, useState } from "react";
import axios from "axios";
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

  return (
    <>
      <h1>Vite + React</h1>
      <div className="card">{message}</div>
      <p className="read-the-docs">Hello, thud!</p>
    </>
  );
}

export default App;
