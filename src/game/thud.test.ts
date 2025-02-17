import {
  findMoves,
  findMovesForSinglePiece,
  findNearbyDwarfs,
  Piece,
  Thud,
  DWARF,
  TROLL,
  findDwarfLineLength,
  offTheBoard,
} from "./thud";

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

test("finding nearby dwarfs", () => {
  const board = new Array<Piece>(512);
  board[294] = "d"; // g5
  board[327] = "d"; // h4
  board[359] = "d"; // h3
  board[355] = "d"; // d3, not nearby
  const square = 326; // g4

  const result = findNearbyDwarfs(board, square);

  expect(result.length).toEqual(3);
  expect(result).toEqual(expect.arrayContaining([294, 327, 359]));
});

test("finding dwarf line length", () => {
  const board = new Array<Piece>(512);
  board[262] = "d"; // g6
  board[294] = "d"; // g5
  board[359] = "d"; // h3, in line but wrong direction
  board[355] = "d"; // d3, not nearby
  const square = 326; // g4
  const offset = 32; // points south, check to north

  const result = findDwarfLineLength(board, square, offset);

  expect(result).toEqual(3);
});

test("finding dwarf line length doesn't check past board edge", () => {
  const board = new Array<Piece>(512);
  board[48] = "d"; // a5
  const square = 49; // b5
  const offset = 1; // points east, check to west

  const result = findDwarfLineLength(board, square, offset);

  expect(result).toEqual(2);
});

test("off the board check", () => {
  expect(offTheBoard(229)).toBe(false); // f8
  expect(offTheBoard(75)).toBe(false); // lD
  expect(offTheBoard(333)).toBe(false); // n5

  expect(offTheBoard(22)).toBe(true); // not a real row
  expect(offTheBoard(15)).toBe(true); // in the forbidden column
  expect(offTheBoard(482)).toBe(true); // in the forbidden row

  expect(offTheBoard(66)).toBe(true); // NW corner
  expect(offTheBoard(44)).toBe(true); // NE corner
  expect(offTheBoard(365)).toBe(true); // SE corner
  expect(offTheBoard(418)).toBe(true); // SW" corner
});

test("finding troll moves", () => {
  const board = new Array<Piece>(512);
  board[34] = "d"; // cE
  const square = "dD"; // 67

  const moves = findMovesForSinglePiece(board, TROLL, square);

  expect(moves.length).toEqual(5);
  expect(moves).toEqual(
    expect.arrayContaining([
      { from: 67, piece: "T", to: 36 },
      { from: 67, piece: "T", to: 68 },
      { from: 67, piece: "T", to: 98 },
      { from: 67, piece: "T", to: 99 },
      { from: 67, piece: "T", to: 100 },
    ])
  );
});

test("troll can't move on top of other troll", () => {
  const board = new Array<Piece>(512);
  board[259] = "T"; // d7
  board[260] = "T"; // e7
  const square = "d6"; // 291

  const moves = findMovesForSinglePiece(board, TROLL, square);

  expect(moves.length).toEqual(6);
  expect(moves).toEqual(
    expect.not.arrayContaining([
      { from: 291, piece: "T", to: 259 },
      { from: 291, piece: "T", to: 260 },
    ])
  );
});

test("finding moves for multiple trolls", () => {
  const board = new Array<Piece>(512);
  board[37] = "T"; // fE
  board[38] = "T"; // gE

  const moves = findMoves(board, TROLL);

  // TODO I assume this is correct, check
  expect(moves.length).toEqual(13);
  expect(moves).toEqual(
    expect.arrayContaining([
      { piece: "T", from: 37, to: 6 },
      { piece: "T", from: 37, to: 5 },
      { piece: "T", from: 37, to: 68 },
      { piece: "T", from: 37, to: 69 },
      { piece: "T", from: 37, to: 70 },
      { piece: "T", from: 37, to: 36 },
      { piece: "T", from: 38, to: 7 },
      { piece: "T", from: 38, to: 6 },
      { piece: "T", from: 38, to: 5 },
      { piece: "T", from: 38, to: 39 },
      { piece: "T", from: 38, to: 69 },
      { piece: "T", from: 38, to: 70 },
      { piece: "T", from: 38, to: 71 },
    ])
  );
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
