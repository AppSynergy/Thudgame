import { render, screen } from "@testing-library/react";
import ThudPiece from "./ThudPiece";
import "@testing-library/jest-dom";
import { DWARF, TROLL } from "../game/thud";

test("renders a dwarf", () => {
  render(
    <ThudPiece currentSide={DWARF} square={{ piece: DWARF, algebraic: "g6" }} />
  );
  const words = screen.getByText(/d/);
  expect(words).toBeInTheDocument();
});

test("renders a troll", () => {
  render(
    <ThudPiece currentSide={TROLL} square={{ piece: TROLL, algebraic: "g6" }} />
  );
  const words = screen.getByText(/T/);
  expect(words).toBeInTheDocument();
});
