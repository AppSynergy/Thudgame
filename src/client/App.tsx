import { useEffect, useState } from "react";
import axios from "axios";
import ThudBoard from "./ThudBoard";

function App() {
  const [message, setMessage] = useState("");

  async function getMessage() {
    try {
      const { data, status } = await axios.get("/api");
      if (status == 200) {
        setMessage(data);
      }
    } catch (error) {
      console.error("whoops");
    }
  }

  useEffect(() => {
    getMessage();
  }, []);

  return (
    <>
      <h1 className="text-3xl">Vite + React</h1>
      <div className="font-bold underline">{message}</div>
      <p className="font-bold">Hello, thud!</p>
      <ThudBoard />
    </>
  );
}

export default App;
