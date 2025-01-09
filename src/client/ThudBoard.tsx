"use client";
import { useActionState } from "react";
import { ThudBoard as ThudBoardType, ThudSquare } from "../game/thud";
import ThudPiece from "./ThudPiece";
import "./ThudBoard.css";

interface ThudBoardProps {
  board: ThudBoardType;
}

export default function ThudBoard({ board }: ThudBoardProps) {
  // TODO implement available moves
  async function showAvailableMoves(previousState: number) {
    return previousState + 1;
  }

  // TODO implement available moves
  const [availableMovesState, availableMovesAction] = useActionState(
    showAvailableMoves,
    0
  );

  let alternateColors = 0;

  function drawSquare(square: ThudSquare, key: number) {
    const alternateColorsClassName =
      alternateColors % 2 == 0 ? "dark" : "light";
    alternateColors += 1;

    return (
      <div key={key} className={`thudSquare ${alternateColorsClassName}`}>
        <div className="label">{square.algebraic}</div>
        <ThudPiece
          piece={square.piece}
          availableMovesAction={availableMovesAction}
        />
      </div>
    );
  }

  function drawRow(row: ThudSquare[], key: number) {
    const thudRow = row.map(drawSquare);
    alternateColors += 1;

    return (
      <div key={key} className="thudRow">
        {thudRow}
      </div>
    );
  }

  return (
    <>
      {availableMovesState}
      <div className="thudBoard">{board.map(drawRow)}</div>
    </>
  );
}
