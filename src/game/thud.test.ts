import {
  findMoves,
  findMovesForSinglePiece,
  filterAvailableMoves,
  Piece,
  Thud,
  DWARF,
  TROLL,
} from "./thud";

test("dwarves go first", () => {
  const thud = Thud("dxdoT");
  const boardAtStart = thud.board();

  // TODO correctly setup and shaped board
  thud.move({ piece: TROLL, from: "c8", to: "d8" });
  const boardAfterFirstMove = thud.board();

  expect(boardAtStart).toEqual(boardAfterFirstMove);
});

test("dwarves and trolls can both move", () => {
  const thud = Thud("dxdoT");
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

test("can filter available moves", () => {
  const result = filterAvailableMoves(
    [
      { piece: TROLL, from: "c8", to: "c2" },
      { piece: TROLL, from: "d2", to: "d8" },
      { piece: TROLL, from: "e4", to: "e8" },
    ],
    "d2"
  );

  expect(result).toEqual(
    expect.arrayContaining([{ piece: TROLL, from: "d2", to: "d8" }])
  );
});

test("can load positions", () => {
  const thud = Thud("TxT");

  expect(thud.board()[0][0]).toStrictEqual({ algebraic: "a8", piece: "T" });
});

test("finding troll moves", () => {
  const board = new Array<Piece>(128);
  board[34] = "d";
  const square = "d5"; // 51

  const moves = findMovesForSinglePiece(board, TROLL, square);

  expect(moves.length).toEqual(8);
  expect(moves).toEqual(
    expect.arrayContaining([
      { from: 51, piece: "T", to: 34 },
      { from: 51, piece: "T", to: 35 },
      { from: 51, piece: "T", to: 36 },
      { from: 51, piece: "T", to: 50 },
      { from: 51, piece: "T", to: 52 },
      { from: 51, piece: "T", to: 66 },
      { from: 51, piece: "T", to: 67 },
      { from: 51, piece: "T", to: 68 },
    ])
  );
});

test("troll can't move on top of other troll", () => {
  const board = new Array<Piece>(128);
  board[34] = "T"; // d6
  board[35] = "T"; // e6
  const square = "d5"; // 51

  const moves = findMovesForSinglePiece(board, TROLL, square);

  expect(moves.length).toEqual(6);
  expect(moves).toEqual(
    expect.not.arrayContaining([
      { from: 51, piece: "T", to: 34 },
      { from: 51, piece: "T", to: 35 },
    ])
  );
});

test("finding moves for multiple trolls", () => {
  const board = new Array<Piece>(128);
  board[34] = "T"; // d6
  board[35] = "T"; // e6

  const moves = findMoves(board, TROLL);

  // TODO I assume this is correct, check
  expect(moves.length).toEqual(14);
  expect(moves).toEqual(
    expect.arrayContaining([
      { piece: "T", from: 34, to: 17 },
      { piece: "T", from: 34, to: 18 },
      { piece: "T", from: 34, to: 19 },
      { piece: "T", from: 34, to: 51 },
      { piece: "T", from: 34, to: 50 },
      { piece: "T", from: 34, to: 49 },
      { piece: "T", from: 34, to: 33 },
      { piece: "T", from: 35, to: 18 },
      { piece: "T", from: 35, to: 19 },
      { piece: "T", from: 35, to: 20 },
      { piece: "T", from: 35, to: 36 },
      { piece: "T", from: 35, to: 52 },
      { piece: "T", from: 35, to: 51 },
      { piece: "T", from: 35, to: 50 },
    ])
  );
});

test("each side can find a legal opening move", () => {
  const thud = Thud("dxdoT");

  // TODO correctly setup and shaped board
  const dwarfMoves = thud.moves(DWARF);
  const trollMoves = thud.moves(TROLL);

  // TODO check dwarf exact moves
  expect(dwarfMoves.length).toEqual(16);
  expect(trollMoves.length).toEqual(5);
  expect(dwarfMoves).toEqual(
    expect.arrayContaining([{ piece: DWARF, from: "a8", to: "b8" }])
  );
  expect(trollMoves).toEqual(
    expect.arrayContaining([{ piece: TROLL, from: "c8", to: "d8" }])
  );
});
