import "@testing-library/jest-dom";
import { fireEvent, render, screen } from "@testing-library/react";
import { ThudSquare, DWARF, TROLL } from "../game/thud";
import ThudPiece from "./ThudPiece";

const squareWithDwarf: ThudSquare = { piece: DWARF, algebraic: "g6" };
const squareWithTroll: ThudSquare = { piece: TROLL, algebraic: "g6" };

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
