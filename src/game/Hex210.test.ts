import { algebraic, file, fileSan, rank, rankSan } from "./Hex210";

test("file function", () => {
  expect(file(98)).toBe(2); // aka c
});

test("rank function", () => {
  expect(rank(98)).toBe(3); // aka B
});

test("fileSan function", () => {
  expect(fileSan(98)).toBe("c");
});

test("rankSan function", () => {
  expect(rankSan(98)).toBe("B");
});

test("algebraic function", () => {
  expect(algebraic(98)).toBe("cB");
});
