import { ThudAi } from "../ai";
import { Square as Hex210Square } from "./Hex210";

export type Opt<T> = T | null;

export const TROLL = "T";
export const DWARF = "d";

export type Piece = "d" | "T";
export type Side = Piece;

export interface HumanPlayer {
  name: string;
  human: true;
  ai: false;
  ready: boolean;
}

export const HUMAN = {
  name: "Johnny",
  ai: false,
  human: true,
  ready: false,
} as HumanPlayer;

export type Player = HumanPlayer | ThudAi;

export interface Matchup {
  [DWARF]: Player;
  [TROLL]: Player;
}

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

export interface Action {
  move?: Opt<Move>;
  capture?: Opt<Square>;
  ai?: boolean;
}
