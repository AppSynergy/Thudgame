import { Square as Hex210Square } from "./Hex210";

export type Opt<T> = T | null;

export const TROLL = "T";
export const DWARF = "d";

export type Piece = "T" | "d";
export type Side = Piece;

export type Square = Hex210Square;

export interface BoardSquare {
  algebraic?: Square;
  piece?: Piece;
}

export type Board = BoardSquare[][];

export interface Move {
  from: Square;
  to: Square;
  piece: Piece;
  capturable?: Square[];
  hurl?: boolean;
}

export interface ThudGame {
  board: () => Board;
  moves: (side: Side) => Move[];
  move: (move: Move) => void;
  capture: (square: Square) => void;
  load: (position: string) => void;
  reset: () => void;
}
