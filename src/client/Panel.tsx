import { useEffect, useState } from "react";
import axios from "axios";
import { sideToText } from "../game/helper";
import { GameState } from "../game/stateMachine";
import { Side, DWARF, TROLL } from "../game/types";
import "./Panel.css";

interface PanelProps {
  state: GameState;
  startNewGame: (yourside: Side, opponentName: string | null) => void;
}

export default function Panel({ state, startNewGame }: PanelProps) {
  const {
    opponent,
    loser,
    activeSide,
    yourSide,
    moveCount,
    dwarfCount,
    trollCount,
  } = state;
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
  if (loser) {
    winnerLoserText = sideToText(loser) + " lose!";
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

      <p>{message}</p>
      <p>{opponentText}</p>
      <p>Your side is the {sideToText(yourSide)}.</p>
      <p>{sideToText(activeSide)} to move next.</p>

      <h4>Stats</h4>
      <p>
        Move {moveCount + 1} : {dwarfCount} dwarves : {trollCount} trolls
      </p>
      <p>{winnerLoserText}</p>
    </>
  );
}
