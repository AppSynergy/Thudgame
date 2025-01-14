"use client";
import { useActionState, useEffect, useState } from "react";
import {
  filterAvailableMoves,
  Move,
  Side,
  ThudBoard as ThudBoardType,
  ThudSquare as ThudSquareType,
} from "../game/thud";
import ThudSquare from "./ThudSquare";
import "./ThudBoard.css";

interface ThudBoardProps {
  board: ThudBoardType;
  activeSide: Side;
  yourSide: Side;
  moves: Move[];
  move: (move: Move) => void;
  moveCount: number;
}

export default function ThudBoard({
  board,
  activeSide,
  yourSide,
  moves,
  move,
  moveCount,
}: ThudBoardProps) {
  const [availableMoves, setAvailableMoves] = useState<Move[] | null>(null);

  // If we select one of our pieces, show the available moves.
  function showAvailableMoves(
    previousSquare: ThudSquareType | null,
    currentSquare: ThudSquareType | null
  ) {
    if (previousSquare == currentSquare) {
      setAvailableMoves(null);
      return null;
    }
    if (moves && currentSquare?.algebraic) {
      setAvailableMoves(filterAvailableMoves(moves, currentSquare.algebraic));
    }

    return currentSquare;
  }

  // Enable moving to a valid square.
  function makeMove(_previousMove: Move | null, currentMove: Move) {
    if (activeSide == yourSide) {
      move(currentMove);
      setAvailableMoves(null);
    }

    return currentMove;
  }

  // Action for selecting pieces.
  const [selectedPieceSquare, availableMovesAction] = useActionState(
    showAvailableMoves,
    null
  );

  // Action for making moves.
  // TODO highlight previous move
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_moveBeingMade, makeMoveAction] = useActionState(makeMove, null);

  // dump user states if we've reset the board.
  useEffect(() => {
    setAvailableMoves(null);
    availableMovesAction(null);
    // TODO fix types, should be able to null this
    //makeMoveAction(null);
  }, [moveCount]);

  // Dark and light coloured squares.
  let alternateColors = 0;

  // Draw a single square of the board.
  function drawSquare(square: ThudSquareType, keyIndex: number) {
    alternateColors += 1;

    return (
      <ThudSquare
        key={keyIndex}
        yourSide={yourSide}
        square={square}
        selectedPieceSquare={selectedPieceSquare}
        alternateColors={alternateColors}
        availableMoves={availableMoves}
        availableMovesAction={availableMovesAction}
        makeMoveAction={makeMoveAction}
      />
    );
  }

  // Draw a single row of the board.
  function drawRow(row: ThudSquareType[], keyIndex: number) {
    const thudRow = row.map(drawSquare);

    return (
      <div key={keyIndex} className="thudRow">
        {thudRow}
      </div>
    );
  }

  return (
    <>
      <div className="thudBoard">{board.map(drawRow)}</div>
    </>
  );
}
