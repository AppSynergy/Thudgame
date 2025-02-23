import { DWARF, TROLL } from "./types";
import { Thud } from "./thud";

test("can load positions", () => {
  const thud = Thud("Tx.....T");

  expect(thud.board()[0][5]).toStrictEqual({ algebraic: "fF", piece: "T" });
});

test("dwarves go first", () => {
  const thud = Thud("dx.....dT");
  const boardAtStart = thud.board();

  thud.move({ piece: TROLL, from: "c8", to: "d8" });
  const boardAfterFirstMove = thud.board();

  expect(boardAtStart).toEqual(boardAfterFirstMove);
});

test("dwarves and trolls can both move", () => {
  const thud = Thud("dx.....dT");
  const boardAtStart = thud.board();

  thud.move({ piece: DWARF, from: "fF", to: "fE" });
  const boardAfterFirstMove = thud.board();

  expect(boardAtStart).not.toEqual(boardAfterFirstMove);

  thud.move({ piece: TROLL, from: "gF", to: "hE" });
  const boardAfterSecondMove = thud.board();

  expect(boardAtStart).not.toEqual(boardAfterSecondMove);
  expect(boardAfterFirstMove).not.toEqual(boardAfterSecondMove);
});

test("each side can find a legal opening move", () => {
  const thud = Thud("dx.....d.T");

  // TODO correctly setup and shaped board
  const dwarfMoves = thud.moves(DWARF);
  const trollMoves = thud.moves(TROLL);

  // TODO check dwarf exact moves
  expect(dwarfMoves.length).toEqual(29);
  expect(trollMoves.length).toEqual(5);
  expect(dwarfMoves).toEqual(
    expect.arrayContaining([{ piece: DWARF, from: "fF", to: "f5" }])
  );
  expect(trollMoves).toEqual(
    expect.arrayContaining([
      { from: "hF", piece: "T", to: "iF" },
      { capturable: ["fF"], from: "hF", piece: "T", to: "gE" },
      { from: "hF", piece: "T", to: "hE" },
      { from: "hF", piece: "T", to: "iE" },
      { capturable: ["fF"], from: "hF", piece: "T", to: "gF" },
    ])
  );
});
