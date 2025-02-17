import { useEffect, useState } from "react";
import axios from "axios";
import { ThudAi } from "../ai";
import { sideToText, Side, DWARF, TROLL } from "../game/thud";

interface PanelProps {
  opponent: ThudAi | null;
  loss: Side | null;
  activeSide: Side;
  yourSide: Side;
  moveCount: number;
  startNewGame: (yourside: Side, opponentName: string | null) => void;
}

export default function Panel({
  opponent,
  loss,
  activeSide,
  yourSide,
  moveCount,
  startNewGame,
}: PanelProps) {
  const [message, setMessage] = useState("");

  async function getMessage() {
    const { data, status } = await axios.get("/api");
    if (status == 200) {
      setMessage(data.message);
    }
  }

  // Connect to server effect
  useEffect(() => {
    getMessage();
  }, []);

  let opponentText = "You are playing both sides.";
  if (opponent) {
    opponentText = "You are playing against " + opponent.name + ".";
  }

  let winnerLoserText = "Neither side has lost yet.";
  if (loss) {
    winnerLoserText = sideToText(loss) + " lose!";
  }

  return (
    <>
      <h4>Start New Game</h4>
      <div className="newGameButtons">
        <button onClick={() => startNewGame(DWARF, null)}>
          Play both sides.
        </button>
        <button onClick={() => startNewGame(DWARF, "Slabhead")}>
          Play the dwarfs vs. Slabhead
        </button>
        <button onClick={() => startNewGame(TROLL, "Rashful")}>
          Play the trolls vs. Rashful
        </button>
      </div>

      <h4>Messages</h4>
      <p>{message}</p>
      <p>Hello, thud!</p>
      <p>{opponentText}</p>
      <p>Move number: {moveCount}</p>
      <p>Your side is the {sideToText(yourSide)}.</p>
      <p>{sideToText(activeSide)} to move next.</p>
      <p>{winnerLoserText}</p>
    </>
  );
}
