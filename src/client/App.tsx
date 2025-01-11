import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import ai, { ThudAi } from "../ai";
import {
  sideToText,
  toggleSide,
  Move,
  Side,
  Thud,
  ThudBoard as ThudBoardType,
  DWARF,
  TROLL,
} from "../game/thud";
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

  // States
  const [moveCount, setMoveCount] = useState(0);
  const [playBothSides, setPlayBothSides] = useState(true);
  const [opponent, setOpponent] = useState<ThudAi | null>(null);
  const [yourSide, setYourSide] = useState<Side>(DWARF);
  const [activeSide, setActiveSide] = useState<Side>(DWARF);
  const [board, setBoard] = useState<ThudBoardType | null>(null);
  const [moves, setMoves] = useState<Move[] | null>(null);
  const [loss, setLoss] = useState<Side | null>(null);
  const [thud, setThud] = useState(Thud());

  // Effects
  // Connect to server effect
  useEffect(() => {
    getMessage();
  }, []);

  // Initialize game effect
  useEffect(() => {
    setBoard(thud.board());
  }, [thud]);

  // Calculate possible moves effect
  useEffect(() => {
    setMoves(thud.moves(yourSide));
  }, [thud, yourSide]);

  // Callbacks
  // Callback - Handles common move logic
  const moveCommon = useCallback(() => {
    setMoveCount(moveCount + 1);

    // TODO we only need to update two squares, is this efficient?
    setBoard(thud.board());

    // Swap the active side
    const otherSide = toggleSide(activeSide);
    setActiveSide(otherSide);

    // Get available moves or lose.
    const nextMoves = thud.moves(otherSide);
    if (nextMoves.length > 0) {
      setMoves(nextMoves);
    } else {
      setLoss(otherSide);
    }
  }, [thud, activeSide, moveCount]);

  // Callback - Handles AI move logic
  const moveAI = useCallback(() => {
    if (moves && opponent) {
      const move = opponent.decideMove(moves);
      if (move) {
        thud.move(move);
      }
    }
    moveCommon();
  }, [thud, moves, moveCommon, opponent]);

  // Effect - AI moves effect
  useEffect(() => {
    if (opponent && activeSide != yourSide) {
      moveAI();
    }
  }, [opponent, moveAI, activeSide, yourSide]);

  // Callback - Handles user move logic
  const moveUser = useCallback(
    (move: Move) => {
      if (!loss) {
        thud.move(move);
        if (playBothSides) {
          setYourSide(toggleSide(activeSide));
        }
        moveCommon();
      }
    },
    [thud, loss, moveCommon, activeSide, playBothSides]
  );

  // Callback - Handles resetting a new game
  const resetGame = useCallback(() => {
    setMoveCount(0);
    setLoss(null);
    setActiveSide(DWARF);
    // TODO or Thud.reset()?
    // TODO selects and move highlights are still on
    setThud(Thud());
  }, []);

  // Callback - Handles new game buttons
  const startNewGame = useCallback(
    (side: Side, opponentName: string | null) => {
      if (opponentName) {
        setOpponent(ai[opponentName]);
        setPlayBothSides(false);
      } else {
        setOpponent(null);
        setPlayBothSides(true);
      }
      setYourSide(side);
      resetGame();
    },
    [resetGame]
  );

  // Layout
  let thudBoard;
  if (board && moves) {
    thudBoard = (
      <ThudBoard
        board={board}
        activeSide={activeSide}
        yourSide={yourSide}
        moves={moves}
        move={moveUser}
      />
    );
  }

  let opponentText = "You are playing both sides.";
  if (opponent) {
    opponentText = "You are playing against " + opponent.name + ".";
  }

  let winnerLoserText = "Neither side has lost yet.";
  if (loss) {
    const losingSide = sideToText(loss);
    winnerLoserText = losingSide + " lose!";
  }

  return (
    <div className="game">
      <div className="messages">
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
      </div>
      <div className="thudBoardWrapper">{thudBoard}</div>
    </div>
  );
}

export default App;
