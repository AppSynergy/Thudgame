import { boardOx88, algebraic, Square } from "./0x88";

export const TROLL = "T";
export const DWARF = "d";

export type Piece = "T" | "d";
export type Side = Piece;

export interface ThudSquare {
  algebraic: string;
  piece?: Piece;
}

export function board() {
  const _board = new Array<Piece>(128);
  const output = [];
  let row = [];

  for (let i = boardOx88.a8; i <= boardOx88.h1; i++) {
    if (_board[i] == null) {
      row.push({
        algebraic: algebraic(i),
      });
    } else {
      row.push({
        algebraic: algebraic(i),
        piece: _board[i],
      });
    }
    if ((i + 1) & 0x88) {
      output.push(row);
      row = [];
      i += 8;
    }
  }

  return output;
}

export type Move = {
  from: Square;
  to: Square;
  piece: Piece;
  captured: boolean;
  notation: string;
};

// TODO maybe this is a class instead
export function Thud() {
  // TODO compute legal moves
  function moves(side: Side): Square[] {
    if (side == TROLL) {
      return ["a1"];
    }
    return ["a1", "a2"];
  }

  return { moves };
}
