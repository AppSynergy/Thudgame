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
      selectedSquare={null}
      alternateColors={1}
      canMoveHere={false}
      canCaptureHere={false}
      availableMoves={null}
      availableMovesAction={jest.fn()}
      lastMove={null}
      makeMoveAction={jest.fn()}
      lastCapture={null}
      chooseCaptureAction={jest.fn()}
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
      selectedSquare={squareWithTroll}
      alternateColors={1}
      canMoveHere={false}
      canCaptureHere={false}
      availableMoves={null}
      availableMovesAction={mockAvailableMovesAction}
      lastMove={null}
      makeMoveAction={jest.fn()}
      lastCapture={null}
      chooseCaptureAction={jest.fn()}
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
      selectedSquare={squareWithTroll}
      alternateColors={1}
      canMoveHere={true}
      canCaptureHere={false}
      availableMoves={[{ from: "e5", to: "e4", piece: TROLL }]}
      availableMovesAction={jest.fn()}
      lastMove={null}
      makeMoveAction={mockMakeMoveAction}
      lastCapture={null}
      chooseCaptureAction={jest.fn()}
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
