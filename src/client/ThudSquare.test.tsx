import "@testing-library/jest-dom";
import { fireEvent, render, screen } from "@testing-library/react";
import { BoardSquare, TROLL } from "../game/types";
import ThudSquare from "./ThudSquare";

const squareWithTroll: BoardSquare = { piece: TROLL, algebraic: "e5" };
const squareWithNoPiece: BoardSquare = { algebraic: "e4" };

test("renders an empty square", () => {
  render(
    <ThudSquare
      key={0}
      yourSide={TROLL}
      square={squareWithNoPiece}
      canMoveHere={false}
      canCaptureHere={false}
      availableMoves={null}
      selectAction={jest.fn()}
      moveAction={jest.fn()}
      captureAction={jest.fn()}
    />
  );

  const piece = screen.queryByText(/(d|T)/);
  expect(piece).toBeNull();

  const label = screen.getByText(/e4/);
  expect(label).toBeInTheDocument();
});

test("highlights a possible move", async () => {
  const mmockSelectAction = jest.fn();

  render(
    <ThudSquare
      key={22}
      yourSide={TROLL}
      square={squareWithTroll}
      canMoveHere={false}
      canCaptureHere={false}
      availableMoves={null}
      selectAction={mmockSelectAction}
      moveAction={jest.fn()}
      captureAction={jest.fn()}
    />
  );

  fireEvent.click(screen.getByText(/T/));

  expect(mmockSelectAction).toHaveBeenCalledTimes(1);
  expect(mmockSelectAction).toHaveBeenCalledWith("e5");
});

test("can click on a square to move there", () => {
  const mockMoveAction = jest.fn();

  render(
    <ThudSquare
      key={22}
      yourSide={TROLL}
      square={squareWithNoPiece}
      thudSquareClassNames="test"
      canMoveHere={true}
      canCaptureHere={false}
      availableMoves={[{ from: "e5", to: "e4", piece: TROLL }]}
      selectAction={jest.fn()}
      moveAction={mockMoveAction}
      captureAction={jest.fn()}
    />
  );

  // TODO get by testing id
  const square = screen.getByText(/e4/).closest("div.test");
  if (square) {
    fireEvent.click(square);
  }

  expect(mockMoveAction).toHaveBeenCalledTimes(1);
  expect(mockMoveAction).toHaveBeenCalledWith({
    move: { from: "e5", piece: "T", to: "e4" },
  });
});
