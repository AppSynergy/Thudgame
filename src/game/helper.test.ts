import { Move, DWARF, TROLL } from "./types";
import {
  chooseRandom,
  filterMovesCapturable,
  filterMovesFrom,
  getOtherSide,
  isCaptureChoice,
  isCaptureSquare,
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

test("isCaptureSquare", () => {
  expect(isCaptureSquare(someMoves, "f7")).toBe(true);
  expect(isCaptureSquare(someMoves, "i4")).toBe(false);
  expect(isCaptureSquare(null, "f7")).toBe(false);
});

test("isCaptureChoice", () => {
  expect(isCaptureChoice(capturingMove, "f7")).toBe(true);
  expect(isCaptureChoice(capturingMove, "i4")).toBe(false);
  expect(isCaptureChoice(someMoves[0], "f7")).toBe(false);
});
