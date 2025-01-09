"use client";
import { useActionState, useState } from "react";
import { Move, ThudBoard as ThudBoardType, ThudSquare } from "../game/thud";
import ThudPiece from "./ThudPiece";
import "./ThudBoard.css";

function filterAvailableMoves(moves: Move[], algebraic: string): Move[] {
  let output = [];
  for (let i = 0; i < moves.length; i++) {
    if (algebraic == moves[i].from) {
      output.push(moves[i]);
    }
  }
  return output;
}

interface ThudBoardProps {
  board: ThudBoardType;
  moves: Move[];
}

export default function ThudBoard({ board, moves }: ThudBoardProps) {
  const [availableMoves, setAvailableMoves] = useState<Move[] | null>(null);

  // If we select one of our pieces, show the available moves.
  async function showAvailableMoves(
    previousSquare: ThudSquare | null,
    currentSquare: ThudSquare | null
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

  // Keep track of the selected piece.
  const [availableMovesState, availableMovesAction] = useActionState(
    showAvailableMoves,
    null
  );

  let alternateColors = 0;

  // Draw a single square of the board.
  function drawSquare(square: ThudSquare, key: number) {
    const alternateColorsClassName =
      alternateColors % 2 == 0 ? "dark" : "light";
    alternateColors += 1;

    return (
      <div key={key} className={`thudSquare ${alternateColorsClassName}`}>
        <div className="label">{square.algebraic}</div>
        <ThudPiece
          square={square}
          availableMovesAction={availableMovesAction}
        />
      </div>
    );
  }

  // Draw a single row of the board.
  function drawRow(row: ThudSquare[], key: number) {
    const thudRow = row.map(drawSquare);
    alternateColors += 1;

    return (
      <div key={key} className="thudRow">
        {thudRow}
      </div>
    );
  }

  // TODO highlight all the available moves
  return (
    <>
      {availableMovesState?.algebraic ?? "No piece selected"}--&gt;
      {availableMoves?.map((move) => move.to)}
      <div className="thudBoard">{board.map(drawRow)}</div>
    </>
  );
}
