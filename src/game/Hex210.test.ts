import { algebraic, file, fileSan, offTheBoard, rank, rankSan } from "./Hex210";

test("file function", () => {
  expect(file(98)).toBe(2); // aka c
});

test("rank function", () => {
  expect(rank(98)).toBe(3); // aka C
});

test("fileSan function", () => {
  expect(fileSan(98)).toBe("c");
});

test("rankSan function", () => {
  expect(rankSan(98)).toBe("C");
});

test("algebraic function", () => {
  expect(algebraic(98)).toBe("cC");
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
