import { Thud, DWARF, TROLL } from "./thud";

test("each side can find a legal opening move", () => {
  const thud = Thud();

  // TODO correctly setup and shaped board
  expect(thud.moves(DWARF)).toEqual(
    expect.arrayContaining([{ piece: DWARF, from: "a8", to: "b8" }])
  );
  expect(thud.moves(TROLL)).toEqual(
    expect.arrayContaining([{ piece: TROLL, from: "c8", to: "d8" }])
  );
});

test("dwarves go first", () => {
  const thud = Thud();
  const boardAtStart = thud.board();

  // TODO correctly setup and shaped board
  thud.move({ piece: TROLL, from: "c8", to: "d8" });
  const boardAfterFirstMove = thud.board();

  expect(boardAtStart).toEqual(boardAfterFirstMove);
});

test("dwarves and trolls can both move", () => {
  const thud = Thud();
  const boardAtStart = thud.board();

  // TODO correctly setup and shaped board
  thud.move({ piece: DWARF, from: "a8", to: "b8" });
  const boardAfterFirstMove = thud.board();

  expect(boardAtStart).not.toEqual(boardAfterFirstMove);

  thud.move({ piece: TROLL, from: "c8", to: "d8" });
  const boardAfterSecondMove = thud.board();

  expect(boardAtStart).not.toEqual(boardAfterSecondMove);
  expect(boardAfterFirstMove).not.toEqual(boardAfterSecondMove);
});
