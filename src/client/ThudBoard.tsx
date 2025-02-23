"use client";
import classNames from "clsx";
import { isMoveSquare, isCaptureSquare, isCaptureChoice } from "../game/helper";
import {
  Action,
  Board,
  BoardSquare,
  Move,
  Opt,
  Side,
  Square,
} from "../game/types";
import ThudSquare from "./ThudSquare";
import "./ThudBoard.css";

interface ThudBoardProps {
  board: Board;
  yourSide: Side;
  moves: Opt<Move[]>;
  selected: Opt<Square>;
  lastMove: Opt<Move>;
  selectAction: (square: Opt<Square>) => void;
  moveAction: (action: Action) => void;
  captureAction: (action: Action) => void;
}

export default function ThudBoard({
  board,
  yourSide,
  moves,
  selected,
  lastMove,
  selectAction,
  moveAction,
  captureAction,
}: ThudBoardProps) {
  // Dark and light coloured squares.
  let alternateColors = 0;

  // Draw a single square of the board.
  function drawSquare(square: BoardSquare, keyIndex: number) {
    alternateColors += 1;

    if (!square?.algebraic)
      return <div key={keyIndex} className="emptySquare"></div>;

    // Check whether we can move to this square, or capture a dwarf here.
    const canMoveHere = isMoveSquare(moves, square.algebraic);
    const hasCaptureRisk = isCaptureSquare(moves, square.algebraic);
    const canCaptureHere = isCaptureChoice(lastMove, square.algebraic);

    const thudSquareClassNames = classNames({
      lastMoveFrom: lastMove?.from == square.algebraic,
      lastMoveTo: lastMove?.to == square.algebraic,
      canMoveHere: canMoveHere && !square.piece,
      canHurlHere: canMoveHere && square.piece,
      hasCaptureRisk,
      canCaptureHere,
      dark: alternateColors % 2 === 0,
      light: alternateColors % 2 === 1,
      selectable: yourSide === square.piece,
      selected: square.piece && selected == square.algebraic,
    });

    return (
      <div key={keyIndex} className="thudSquare">
        <ThudSquare
          yourSide={yourSide}
          square={square}
          thudSquareClassNames={thudSquareClassNames}
          canMoveHere={canMoveHere}
          canCaptureHere={canCaptureHere}
          availableMoves={moves}
          selectAction={selectAction}
          moveAction={moveAction}
          captureAction={captureAction}
        />
      </div>
    );
  }

  // Draw a single row of the board.
  function drawRow(row: BoardSquare[], keyIndex: number) {
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
