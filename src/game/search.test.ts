import { Piece, DWARF, TROLL } from "./types";
import {
  findMoves,
  findMovesForSinglePiece,
  findNearbyDwarfs,
  findDwarfLineLength,
} from "./search";

test("finding nearby dwarfs", () => {
  const board = new Array<Piece>(512);
  board[294] = DWARF; // g5
  board[327] = DWARF; // h4
  board[359] = DWARF; // h3
  board[355] = DWARF; // d3, not nearby
  const square = 326; // g4

  const result = findNearbyDwarfs(square, (sq) => board[sq] === DWARF);

  expect(result.length).toEqual(3);
  expect(result).toEqual(expect.arrayContaining([294, 327, 359]));
});

test("finding dwarf line length", () => {
  const board = new Array<Piece>(512);
  board[262] = DWARF; // g6
  board[294] = DWARF; // g5
  board[359] = DWARF; // h3, in line but wrong direction
  board[355] = DWARF; // d3, not nearby
  const square = 326; // g4
  const offset = 32; // points south, check to north

  const result = findDwarfLineLength(board, square, offset);

  expect(result).toEqual(3);
});

test("finding dwarf line length doesn't check past board edge", () => {
  const board = new Array<Piece>(512);
  board[48] = DWARF; // a5
  const square = 49; // b5
  const offset = 1; // points east, check to west

  const result = findDwarfLineLength(board, square, offset);

  expect(result).toEqual(2);
});

test("finding troll moves", () => {
  const board = new Array<Piece>(512);
  board[34] = DWARF; // cE
  const square = "dD"; // 67

  const moves = findMovesForSinglePiece(board, TROLL, square);

  expect(moves.length).toEqual(5);
  expect(moves).toEqual(
    expect.arrayContaining([
      { from: 67, piece: TROLL, to: 36 },
      { from: 67, piece: TROLL, to: 68 },
      { from: 67, piece: TROLL, to: 98 },
      { from: 67, piece: TROLL, to: 99 },
      { from: 67, piece: TROLL, to: 100 },
    ])
  );
});

test("troll can't move on top of other troll", () => {
  const board = new Array<Piece>(512);
  board[259] = TROLL; // d7
  board[260] = TROLL; // e7
  const square = "d6"; // 291

  const moves = findMovesForSinglePiece(board, TROLL, square);

  expect(moves.length).toEqual(6);
  expect(moves).toEqual(
    expect.not.arrayContaining([
      { from: 291, piece: TROLL, to: 259 },
      { from: 291, piece: TROLL, to: 260 },
    ])
  );
});

test("finding moves for multiple trolls", () => {
  const board = new Array<Piece>(512);
  board[37] = TROLL; // fE
  board[38] = TROLL; // gE

  const moves = findMoves(board, TROLL);

  // TODO I assume this is correct, check
  expect(moves.length).toEqual(13);
  expect(moves).toEqual(
    expect.arrayContaining([
      { piece: TROLL, from: 37, to: 6 },
      { piece: TROLL, from: 37, to: 5 },
      { piece: TROLL, from: 37, to: 68 },
      { piece: TROLL, from: 37, to: 69 },
      { piece: TROLL, from: 37, to: 70 },
      { piece: TROLL, from: 37, to: 36 },
      { piece: TROLL, from: 38, to: 7 },
      { piece: TROLL, from: 38, to: 6 },
      { piece: TROLL, from: 38, to: 5 },
      { piece: TROLL, from: 38, to: 39 },
      { piece: TROLL, from: 38, to: 69 },
      { piece: TROLL, from: 38, to: 70 },
      { piece: TROLL, from: 38, to: 71 },
    ])
  );
});
