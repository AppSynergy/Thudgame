import "@testing-library/jest-dom";
import { fireEvent, render, screen } from "@testing-library/react";
import { Move, ThudSquare as ThudSquareType, TROLL } from "../game/thud";
import ThudSquare from "./ThudSquare";

const squareWithTroll: ThudSquareType = { piece: TROLL, algebraic: "e5" };
const squareWithNoPiece: ThudSquareType = { algebraic: "e4" };

test("renders an empty square", () => {
  render(
    <ThudSquare
      key={0}
      yourSide={TROLL}
      square={squareWithNoPiece}
      selectedPieceSquare={null}
      alternateColorsClassName="dark"
      availableMoves={[]}
      availableMovesAction={jest.fn()}
      makeMoveAction={jest.fn()}
    />
  );

  const piece = screen.queryByText(/(d|T)/);
  expect(piece).toBeNull();

  const label = screen.getByText(/e4/);
  expect(label).toBeInTheDocument();
});

test("can click on a square to move there", () => {
  const mockMoveAction = jest.fn();

  render(
    <ThudSquare
      key={22}
      yourSide={TROLL}
      square={squareWithNoPiece}
      selectedPieceSquare={squareWithTroll}
      alternateColorsClassName="dark"
      availableMoves={[{ from: "d4", piece: TROLL, to: "e4" }] as Move[]}
      availableMovesAction={jest.fn()}
      makeMoveAction={mockMoveAction}
    />
  );

  const square = screen.getByText(/e4/).closest("div.thudSquare");
  if (square) {
    fireEvent.click(square);
  }

  expect(mockMoveAction).toHaveBeenCalledTimes(1);
  expect(mockMoveAction).toHaveBeenCalledWith({
    from: "e5",
    piece: "T",
    to: "e4",
  });
});
