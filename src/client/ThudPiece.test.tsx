import { render, screen } from "@testing-library/react";
import ThudPiece from "./ThudPiece";
import "@testing-library/jest-dom";

test("renders a dwarf", () => {
  render(<ThudPiece square={{ piece: "d", algebraic: "g6" }} />);
  const words = screen.getByText(/d/);
  expect(words).toBeInTheDocument();
});

test("renders a troll", () => {
  render(<ThudPiece square={{ piece: "T", algebraic: "g6" }} />);
  const words = screen.getByText(/T/);
  expect(words).toBeInTheDocument();
});
