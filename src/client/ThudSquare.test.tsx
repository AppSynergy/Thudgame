import "@testing-library/jest-dom";
import { fireEvent, render, screen } from "@testing-library/react";
import { Move, ThudSquare as ThudSquareType, TROLL } from "../game/thud";
import ThudSquare from "./ThudSquare";

const squareWithTroll: ThudSquareType = { piece: TROLL, algebraic: "e5" };
const squareWithNoPiece: ThudSquareType = { algebraic: "e4" };
const availableMove = { from: "e5", piece: TROLL, to: "e4" } as Move;

test("renders an empty square", () => {
  render(
    <ThudSquare
      key={0}
      yourSide={TROLL}
      square={squareWithNoPiece}
      selectedPieceSquare={null}
      alternateColors={1}
      availableMoves={[]}
      availableMovesAction={jest.fn()}
      makeMoveAction={jest.fn()}
      mostRecentMove={null}
    />
  );

  const piece = screen.queryByText(/(d|T)/);
  expect(piece).toBeNull();

  const label = screen.getByText(/e4/);
  expect(label).toBeInTheDocument();
});

test("highlights a possible move", async () => {
  const mockAvailableMovesAction = jest.fn();

  render(
    <ThudSquare
      key={22}
      yourSide={TROLL}
      square={squareWithTroll}
      selectedPieceSquare={squareWithTroll}
      alternateColors={1}
      availableMoves={[availableMove]}
      availableMovesAction={mockAvailableMovesAction}
      makeMoveAction={jest.fn()}
      mostRecentMove={null}
    />
  );

  fireEvent.click(screen.getByText(/T/));

  expect(mockAvailableMovesAction).toHaveBeenCalledTimes(1);
  expect(mockAvailableMovesAction).toHaveBeenCalledWith({
    algebraic: "e5",
    piece: "T",
  });
});

test("can click on a square to move there", () => {
  const mockMakeMoveAction = jest.fn();

  render(
    <ThudSquare
      key={22}
      yourSide={TROLL}
      square={squareWithNoPiece}
      selectedPieceSquare={squareWithTroll}
      alternateColors={1}
      availableMoves={[availableMove]}
      availableMovesAction={jest.fn()}
      makeMoveAction={mockMakeMoveAction}
      mostRecentMove={null}
    />
  );

  // TODO get by testing id
  const square = screen.getByText(/e4/).closest("div.thudSquare");
  if (square) {
    fireEvent.click(square);
  }

  expect(mockMakeMoveAction).toHaveBeenCalledTimes(1);
  expect(mockMakeMoveAction).toHaveBeenCalledWith({
    from: "e5",
    piece: "T",
    to: "e4",
  });
});
