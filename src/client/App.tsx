import { useCallback, useEffect, useMemo, useState } from "react";
import axios from "axios";
import {
  sideToText,
  toggleSide,
  Move,
  Side,
  Thud,
  ThudBoard as ThudBoardType,
  DWARF,
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

  // TODO play as either side
  const currentSide = DWARF as Side;

  // States
  const [moveCount, setMoveCount] = useState(0);
  const [yourSide, setYourSide] = useState(currentSide);
  const [activeSide, setActiveSide] = useState(currentSide);
  const [board, setBoard] = useState<ThudBoardType | null>(null);
  const [moves, setMoves] = useState<Move[] | null>(null);
  const [loss, setLoss] = useState<Side | null>(null);
  const thud = useMemo(() => Thud(), []);

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
  // Handles move logic
  const move = useCallback(
    (move: Move) => {
      thud.move(move);

      // TODO for now play as both sides.
      const otherSide = toggleSide(activeSide);
      setYourSide(otherSide);
      setActiveSide(otherSide);

      // TODO we only need to update two squares, is this efficient?
      setBoard(thud.board());

      const nextMoves = thud.moves(otherSide);
      if (nextMoves) {
        setMoves(nextMoves);
      } else {
        setLoss(otherSide);
      }

      setMoveCount(moveCount + 1);
    },
    [thud, activeSide, moveCount]
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
        move={move}
      />
    );
  }

  let winnerLoserText = "Neither side has lost yet.";
  if (loss) {
    const losingSide = sideToText(loss);
    winnerLoserText = losingSide + " lose!";
  }

  return (
    <>
      <p>{message}</p>
      <p>Hello, thud!</p>
      <p>Move number: {moveCount}</p>
      <p>Your side is the {sideToText(yourSide)}.</p>
      <p>{sideToText(activeSide)} to move next.</p>
      <p>{winnerLoserText}</p>
      <div>{thudBoard}</div>
    </>
  );
}

export default App;
