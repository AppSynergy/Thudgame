import { Move, DWARF, TROLL } from "./types";
import {
  chooseRandom,
  filterMovesCapturable,
  filterMovesFrom,
  getOtherSide,
  isCaptureRisk,
  isCaptureHere,
  isMoveSquare,
  sideToText,
} from "./helper";

test("sideToText", () => {
  expect(sideToText(DWARF)).toEqual("Dwarfs");
  expect(sideToText(TROLL)).toEqual("Trolls");
});

test("getOtherSide", () => {
  expect(getOtherSide(TROLL)).toEqual(DWARF);
  expect(getOtherSide(DWARF)).toEqual(TROLL);
});

const capturingMove: Move = {
  capturable: ["f7"],
  from: "e5",
  piece: TROLL,
  to: "e6",
};

const someMoves: Move[] = [
  { piece: TROLL, from: "c8", to: "c7" },
  { piece: TROLL, from: "d3", to: "d4" },
  capturingMove,
];

test("choosing randomly", () => {
  expect(chooseRandom(someMoves));
});

test("filtering moves from a square", () => {
  expect(filterMovesFrom(someMoves, "d3")).toEqual(
    expect.arrayContaining([{ piece: TROLL, from: "d3", to: "d4" }])
  );
});

test("filtering capturing moves", () => {
  expect(filterMovesCapturable(someMoves)).toEqual(
    expect.arrayContaining([capturingMove])
  );
});

test("isMoveSquare", () => {
  expect(isMoveSquare(someMoves, "c7")).toBe(true);
  expect(isMoveSquare(someMoves, "g2")).toBe(false);
  expect(isMoveSquare(null, "c7")).toBe(false);
});

test("isCaptureRisk", () => {
  expect(isCaptureRisk(someMoves, "f7")).toBe(true);
  expect(isCaptureRisk(someMoves, "i4")).toBe(false);
  expect(isCaptureRisk(null, "f7")).toBe(false);
});

test("isCaptureHere", () => {
  expect(isCaptureHere(capturingMove, "f7", TROLL)).toBe(true);
  expect(isCaptureHere(capturingMove, "i4", TROLL)).toBe(false);
  expect(isCaptureHere(someMoves[0], "f7", TROLL)).toBe(false);
});
