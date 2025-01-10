import { algebraic, file, fileSan, rank, rankSan } from "./lib0x88";

test("file function", () => {
  expect(file(98)).toBe(2); // aka C
});

test("rank function", () => {
  expect(rank(98)).toBe(6); // aka 2
});

test("fileSan function", () => {
  expect(fileSan(98)).toBe("c");
});

test("rankSan function", () => {
  expect(rankSan(98)).toBe("2");
});

test("algebraic function", () => {
  expect(algebraic(98)).toBe("c2");
});
