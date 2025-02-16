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
      moveCount={0}
      capture={jest.fn()}
    />
  );

  const dwarf = screen.getAllByText("d");
  expect(dwarf.length).toEqual(3);
  expect(dwarf[0]).toBeInTheDocument();

  const troll = screen.getAllByText("T");
  expect(troll.length).toEqual(2);
  expect(troll[1]).toBeInTheDocument();

  // TODO get by testing id
  const emptySquare = screen.getByText(/e4/).closest("div.thudSquare");
  expect(emptySquare).toBeInTheDocument();

  // TODO transition or something for action coverage
  // TODO get by testing id
  const dwarfSquare = dwarf[0].closest("div.thudSquare");
  if (dwarfSquare && emptySquare) {
    fireEvent.click(dwarfSquare);
    fireEvent.click(emptySquare);
  }
});
