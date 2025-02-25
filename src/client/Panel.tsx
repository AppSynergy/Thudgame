import { useEffect, useState } from "react";
import axios from "axios";
import ai from "../ai";
import { sideToText } from "../game/helper";
import { GameState } from "../game/stateMachine";
import { Matchup, DWARF, HUMAN, TROLL } from "../game/types";
import "./Panel.css";

interface PanelProps {
  state: GameState;
  startGame: (matchup: Matchup) => void;
}

export default function Panel({ state, startGame }: PanelProps) {
  const {
    players,
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

  const playerNames = (
    <>
      <p>{players?.[DWARF].name} as dwarfs</p>
      <p>{players?.[TROLL].name} as trolls</p>
    </>
  );
  const winnerLoserText = loser ? sideToText(loser) + " lose!" : "";

  return (
    <>
      <h4>Start New Game</h4>
      <div className="newGameButtons">
        <button onClick={() => startGame({ [DWARF]: HUMAN, [TROLL]: HUMAN })}>
          Play both sides.
        </button>
        <button
          onClick={() => startGame({ [DWARF]: HUMAN, [TROLL]: ai["Slabhead"] })}
        >
          Play the dwarfs vs. Slabhead
        </button>
        <button
          onClick={() => startGame({ [DWARF]: ai["Rashful"], [TROLL]: HUMAN })}
        >
          Play the trolls vs. Rashful
        </button>
        <button
          onClick={() =>
            startGame({ [DWARF]: ai["Rashful"], [TROLL]: ai["Slabhead"] })
          }
        >
          Watch Rashful vs. Slabhead
        </button>
        <button
          onClick={() =>
            startGame({ [DWARF]: ai["Slabhead"], [TROLL]: ai["Rashful"] })
          }
        >
          Watch AI play wrong sides
        </button>
      </div>

      <p>{message}</p>
      {playerNames}
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
