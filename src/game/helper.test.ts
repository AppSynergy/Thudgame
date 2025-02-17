import { filterMovesFrom, isMoveSquare, isCaptureSquare } from "./helper";
import { TROLL } from "./types";

test("can filter available moves", () => {
  const result = filterMovesFrom(
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
  const result = isMoveSquare([{ from: "e8", piece: "d", to: "i8" }], "i8");

  expect(result).toBe(true);
});

test("checking we can't move to a square", () => {
  const result = isMoveSquare([{ from: "i6", piece: "d", to: "g5" }], "g2");

  expect(result).toBe(false);
});

test("checking we can capture a dwarf on a square", () => {
  const result = isCaptureSquare(
    [{ capturable: ["f7"], from: "e5", piece: "T", to: "e6" }],
    "f7"
  );

  expect(result).toBe(true);
});
