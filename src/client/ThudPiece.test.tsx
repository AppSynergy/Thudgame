import { fireEvent, render, screen } from "@testing-library/react";
import ThudPiece from "./ThudPiece";
import "@testing-library/jest-dom";
import { ThudSquare, DWARF, TROLL } from "../game/thud";

const squareWithDwarf: ThudSquare = { piece: DWARF, algebraic: "g6" };
const squareWithTroll: ThudSquare = { piece: TROLL, algebraic: "g6" };

test("renders a dwarf", () => {
  render(<ThudPiece yourSide={DWARF} square={squareWithDwarf} />);
  const words = screen.getByText(/d/);
  expect(words).toBeInTheDocument();
});

test("renders a troll", () => {
  render(<ThudPiece yourSide={TROLL} square={squareWithTroll} />);
  const words = screen.getByText(/T/);
  expect(words).toBeInTheDocument();
});

test("can click on a dwarf", () => {
  const mockAction = jest.fn();
  render(
    <ThudPiece
      yourSide={DWARF}
      square={squareWithDwarf}
      availableMovesAction={mockAction}
    />
  );

  fireEvent.click(screen.getByText(/d/));

  expect(mockAction).toHaveBeenCalledWith(squareWithDwarf);
});
