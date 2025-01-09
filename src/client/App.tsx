import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch("/api")
      .then((res) => res.text())
      .then((data) => setMessage(data));
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
