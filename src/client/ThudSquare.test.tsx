import "@testing-library/jest-dom";
import { fireEvent, render, screen } from "@testing-library/react";
import { ThudSquare as ThudSquareType, TROLL } from "../game/thud";
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
      alternateColors={1}
      canMoveHere={false}
      canCaptureHere={false}
      captureSquares={[]}
      mostRecentMoveFrom={false}
      mostRecentMoveTo={false}
      availableMovesAction={jest.fn()}
      makeMoveAction={jest.fn()}
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
      canMoveHere={false}
      canCaptureHere={false}
      captureSquares={[]}
      mostRecentMoveFrom={false}
      mostRecentMoveTo={false}
      availableMovesAction={mockAvailableMovesAction}
      makeMoveAction={jest.fn()}
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
      canMoveHere={true}
      canCaptureHere={false}
      captureSquares={[]}
      mostRecentMoveFrom={false}
      mostRecentMoveTo={false}
      availableMovesAction={jest.fn()}
      makeMoveAction={mockMakeMoveAction}
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
