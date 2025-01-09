import { Thud, DWARF, TROLL } from "./thud";

test("the rules of thud", () => {
  const thud = Thud();
  expect(thud.moves(TROLL)).toEqual(expect.arrayContaining(["a1"]));
  expect(thud.moves(DWARF)).toEqual(expect.arrayContaining(["a1", "a2"]));
});
