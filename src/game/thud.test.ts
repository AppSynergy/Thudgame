import {
  findMoves,
  findMovesForSinglePiece,
  findNearbyDwarfs,
  filterAvailableMoves,
  isAvailableCaptureSquare,
  isAvailableMoveSquare,
  Piece,
  Thud,
  DWARF,
  TROLL,
  findDwarfLineLength,
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

test("can filter available moves", () => {
  const result = filterAvailableMoves(
    [
      { piece: TROLL, from: "c8", to: "c7" },
      { piece: TROLL, from: "d3", to: "d4" },
      { piece: TROLL, from: "e4", to: "e5" },
    ],
    "d3"
  );

  expect(result).toEqual(
    expect.arrayContaining([{ piece: TROLL, from: "d3", to: "d4" }])
  );
});

test("checking we can move to a square", () => {
  const result = isAvailableMoveSquare([{ from: "e8", piece: "d", to: "i8" }], {
    algebraic: "i8",
  });

  expect(result).toBe(true);
});

test("checking we can't move to a square", () => {
  const result = isAvailableMoveSquare([{ from: "i6", piece: "d", to: "g5" }], {
    algebraic: "g2",
  });

  expect(result).toBe(false);
});

test("checking we can capture a dwarf on a square", () => {
  const result = isAvailableCaptureSquare(
    [{ capturable: ["f7"], from: "e5", piece: "T", to: "e6" }],
    {
      algebraic: "f7",
      piece: DWARF,
    }
  );

  expect(result).toBe(true);
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

test("finding troll moves", () => {
  const board = new Array<Piece>(512);
  board[34] = "d"; // cE
  const square = "dD"; // 67

  const moves = findMovesForSinglePiece(board, TROLL, square);

  expect(moves.length).toEqual(7);
  expect(moves).toEqual(
    expect.arrayContaining([
      { capturable: [], from: 67, piece: "T", to: 36 },
      { capturable: [34], from: 67, piece: "T", to: 35 },
      { capturable: [34], from: 67, piece: "T", to: 66 },
      { capturable: [], from: 67, piece: "T", to: 68 },
      { capturable: [], from: 67, piece: "T", to: 98 },
      { capturable: [], from: 67, piece: "T", to: 99 },
      { capturable: [], from: 67, piece: "T", to: 100 },
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
  expect(moves.length).toEqual(14);
  expect(moves).toEqual(
    expect.arrayContaining([
      { piece: "T", from: 37, to: 6, capturable: [] },
      { piece: "T", from: 37, to: 5, capturable: [] },
      { piece: "T", from: 37, to: 4, capturable: [] },
      { piece: "T", from: 37, to: 68, capturable: [] },
      { piece: "T", from: 37, to: 69, capturable: [] },
      { piece: "T", from: 37, to: 70, capturable: [] },
      { piece: "T", from: 37, to: 36, capturable: [] },
      { piece: "T", from: 38, to: 7, capturable: [] },
      { piece: "T", from: 38, to: 6, capturable: [] },
      { piece: "T", from: 38, to: 5, capturable: [] },
      { piece: "T", from: 38, to: 39, capturable: [] },
      { piece: "T", from: 38, to: 69, capturable: [] },
      { piece: "T", from: 38, to: 70, capturable: [] },
      { piece: "T", from: 38, to: 71, capturable: [] },
    ])
  );
});

test("each side can find a legal opening move", () => {
  const thud = Thud("dx.....d.T");

  // TODO correctly setup and shaped board
  const dwarfMoves = thud.moves(DWARF);
  const trollMoves = thud.moves(TROLL);

  // TODO check dwarf exact moves
  expect(dwarfMoves.length).toEqual(36);
  expect(trollMoves.length).toEqual(5);
  expect(dwarfMoves).toEqual(
    expect.arrayContaining([{ piece: DWARF, from: "fF", to: "f5" }])
  );
  expect(trollMoves).toEqual(
    expect.arrayContaining([
      { capturable: [], from: "hF", piece: "T", to: "iF" },
      { capturable: ["fF"], from: "hF", piece: "T", to: "gE" },
      { capturable: [], from: "hF", piece: "T", to: "hE" },
      { capturable: [], from: "hF", piece: "T", to: "iE" },
      { capturable: ["fF"], from: "hF", piece: "T", to: "gF" },
    ])
  );
});
