import "@testing-library/jest-dom";
import { fireEvent, render, screen } from "@testing-library/react";
import { BoardSquare, DWARF, TROLL } from "../game/types";
import ThudPiece from "./ThudPiece";

const squareWithDwarf: BoardSquare = { piece: DWARF, algebraic: "g6" };
const squareWithTroll: BoardSquare = { piece: TROLL, algebraic: "g6" };

test("renders a dwarf", () => {
  render(
    <ThudPiece
      yourSide={DWARF}
      square={squareWithDwarf}
      selectAction={jest.fn()}
    />
  );
  const piece = screen.getByText(/d/);
  expect(piece).toBeInTheDocument();
});

test("renders a troll", () => {
  render(
    <ThudPiece
      yourSide={TROLL}
      square={squareWithTroll}
      selectAction={jest.fn()}
    />
  );
  const piece = screen.getByText(/T/);
  expect(piece).toBeInTheDocument();
});

test("can click on a dwarf", () => {
  const mockAction = jest.fn();
  render(
    <ThudPiece
      yourSide={DWARF}
      square={squareWithDwarf}
      selectAction={mockAction}
    />
  );

  fireEvent.click(screen.getByText(/d/));

  expect(mockAction).toHaveBeenCalledWith(squareWithDwarf);
});
