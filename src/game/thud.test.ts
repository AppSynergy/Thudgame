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
  thud.move({ piece: DWARF, from: "aF", to: "bF" });
  const boardAfterFirstMove = thud.board();

  expect(boardAtStart).not.toEqual(boardAfterFirstMove);

  thud.move({ piece: TROLL, from: "cF", to: "dF" });
  const boardAfterSecondMove = thud.board();

  expect(boardAtStart).not.toEqual(boardAfterSecondMove);
  expect(boardAfterFirstMove).not.toEqual(boardAfterSecondMove);
});

test("can filter available moves", () => {
  const result = filterAvailableMoves(
    [
      { piece: TROLL, from: "c8", to: "c7" },
      { piece: TROLL, from: "d2", to: "d3" },
      { piece: TROLL, from: "e4", to: "e5" },
    ],
    "d2"
  );

  expect(result).toEqual(
    expect.arrayContaining([{ piece: TROLL, from: "d2", to: "d3" }])
  );
});

test("can load positions", () => {
  const thud = Thud("TxT");

  expect(thud.board()[0][0]).toStrictEqual({ algebraic: "aF", piece: "T" });
});

test("checking we can move to a square", () => {
  const result = isAvailableMoveSquare([{ from: "b5", piece: "d", to: "b2" }], {
    algebraic: "b2",
  });

  expect(result).toBe(true);
});

test("checking we can't move to a square", () => {
  const result = isAvailableMoveSquare([{ from: "b5", piece: "d", to: "b2" }], {
    algebraic: "c1",
  });

  expect(result).toBe(false);
});

test("checking we can capture a dwarf on a square", () => {
  const result = isAvailableCaptureSquare(
    [{ capturable: ["b1"], from: "b5", piece: "T", to: "b2" }],
    {
      algebraic: "b1",
      piece: DWARF,
    }
  );

  expect(result).toBe(true);
});

test("finding nearby dwarfs", () => {
  const board = new Array<Piece>(128);
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
  const board = new Array<Piece>(128);
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
  const board = new Array<Piece>(128);
  board[48] = "d"; // a5
  const square = 49; // b5
  const offset = 1; // points east, check to west

  const result = findDwarfLineLength(board, square, offset);

  expect(result).toEqual(2);
});

test("finding troll moves", () => {
  const board = new Array<Piece>(128);
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
  const board = new Array<Piece>(128);
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
  const board = new Array<Piece>(128);
  board[34] = "T"; // dD
  board[35] = "T"; // eD

  const moves = findMoves(board, TROLL);

  // TODO I assume this is correct, check
  expect(moves.length).toEqual(14);
  expect(moves).toEqual(
    expect.arrayContaining([
      { piece: "T", from: 34, to: 3, capturable: [] },
      { piece: "T", from: 34, to: 2, capturable: [] },
      { piece: "T", from: 34, to: 1, capturable: [] },
      { piece: "T", from: 34, to: 65, capturable: [] },
      { piece: "T", from: 34, to: 66, capturable: [] },
      { piece: "T", from: 34, to: 67, capturable: [] },
      { piece: "T", from: 34, to: 33, capturable: [] },
      { piece: "T", from: 35, to: 4, capturable: [] },
      { piece: "T", from: 35, to: 3, capturable: [] },
      { piece: "T", from: 35, to: 2, capturable: [] },
      { piece: "T", from: 35, to: 36, capturable: [] },
      { piece: "T", from: 35, to: 66, capturable: [] },
      { piece: "T", from: 35, to: 67, capturable: [] },
      { piece: "T", from: 35, to: 68, capturable: [] },
    ])
  );
});

test("each side can find a legal opening move", () => {
  const thud = Thud("dxdoT");

  // TODO correctly setup and shaped board
  const dwarfMoves = thud.moves(DWARF);
  const trollMoves = thud.moves(TROLL);

  // TODO check dwarf exact moves
  expect(dwarfMoves.length).toEqual(31);
  expect(trollMoves.length).toEqual(5);
  expect(dwarfMoves).toEqual(
    expect.arrayContaining([{ piece: DWARF, from: "aF", to: "bF" }])
  );
  expect(trollMoves).toEqual(
    expect.arrayContaining([
      { capturable: [], from: "cF", piece: "T", to: "dF" },
      { capturable: ["aF"], from: "cF", piece: "T", to: "bE" },
      { capturable: [], from: "cF", piece: "T", to: "cE" },
      { capturable: [], from: "cF", piece: "T", to: "dE" },
      { capturable: ["aF"], from: "cF", piece: "T", to: "bF" },
    ])
  );
});
