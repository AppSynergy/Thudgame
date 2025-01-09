import { render, screen } from "@testing-library/react";
import ThudPiece from "./ThudPiece";
import "@testing-library/jest-dom";

test("renders a dwarf", () => {
  render(<ThudPiece piece="d" />);
  const words = screen.getByText(/d/);
  expect(words).toBeInTheDocument();
});

test("renders a troll", () => {
  render(<ThudPiece piece="T" />);
  const words = screen.getByText(/T/);
  expect(words).toBeInTheDocument();
});
