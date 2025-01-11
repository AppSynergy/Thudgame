import "@testing-library/jest-dom";
import { fireEvent, render, screen } from "@testing-library/react";
import { Thud, DWARF, TROLL } from "../game/thud";
import ThudBoard from "./ThudBoard";

test("renders a thud board", () => {
  const board = Thud().board();

  render(
    <ThudBoard
      board={board}
      activeSide={DWARF}
      yourSide={TROLL}
      moves={[]}
      move={jest.fn()}
    />
  );

  const dwarf = screen.getByText("d");
  expect(dwarf).toBeInTheDocument();

  const troll = screen.getByText("T");
  expect(troll).toBeInTheDocument();

  // TODO get by testing id
  const emptySquare = screen.getByText(/e4/).closest("div.thudSquare");
  expect(emptySquare).toBeInTheDocument();

  // TODO transition or something for action coverage
  // TODO get by testing id
  const dwarfSquare = dwarf.closest("div.thudSquare");
  if (dwarfSquare && emptySquare) {
    fireEvent.click(dwarfSquare);
    fireEvent.click(emptySquare);
  }
});
