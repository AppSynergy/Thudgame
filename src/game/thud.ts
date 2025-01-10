import { boardOx88, algebraic, Square as Ox88Square } from "./0x88";

export const TROLL = "T";
export const DWARF = "d";

export type Piece = "T" | "d";
export type Side = Piece;

export type Square = Ox88Square;
export interface ThudSquare {
  algebraic: Square;
  piece?: Piece;
}

export type ThudBoard = ThudSquare[][];

// TODO improve Thud Board Notation
// Current turn, then an X, then dwarf and troll positions.
// Any other character is an empty space.
export const DEFAULT_POSITION = "dxdoT";

interface InternalMove {
  from: number;
  to: number;
  piece: Piece;
}

export interface Move {
  from: Square;
  to: Square;
  piece: Piece;
  captured?: boolean;
  notation?: string;
}

function internalMoveFromMove(move: Move): InternalMove {
  // TODO convert to InternalMove
  // TODO check if move is legal?
  if (move.piece == DWARF) {
    return { piece: move.piece, from: 0, to: 1 };
  }
  return { piece: move.piece, from: 2, to: 3 };
}

// Filter all available moves to produce just the moves from a given square.
export function filterAvailableMoves(moves: Move[], algebraic: Square): Move[] {
  let output = [];
  for (let i = 0; i < moves.length; i++) {
    if (algebraic == moves[i].from) {
      output.push(moves[i]);
    }
  }
  return output;
}

interface ThudGame {
  board: () => ThudSquare[][];
  moves: (side: Side) => Move[];
  move: (move: Move) => void;
  load: (position: string) => void;
  reset: () => void;
}

export function Thud(position?: string): ThudGame {
  // Internal representation of board
  let _board = new Array<Piece>(128);
  let _turn = DWARF;

  // Data from drawing the current board
  function board() {
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

  // TODO compute legal moves
  function moves(side: Side): Move[] {
    if (side == DWARF) {
      return [{ piece: DWARF, from: "a8", to: "b8" }];
    }
    return [{ piece: TROLL, from: "c8", to: "d8" }];
  }

  // TODO make a move
  function move(move: Move) {
    if (_turn == move.piece) {
      const internalMove = internalMoveFromMove(move);
      _board[internalMove.to] = _board[internalMove.from];
      delete _board[internalMove.from];
    }

    _turn = _turn == DWARF ? TROLL : DWARF;
  }

  // Loard a board position.
  function load(position: string) {
    const [turn, pieces] = position.split("x");
    if (turn && (turn == DWARF || turn == TROLL)) {
      _turn = turn;
    }

    if (pieces) {
      const piecePositions = pieces.split("");
      for (let i = 0; i < piecePositions.length; i++) {
        if (piecePositions[i] == DWARF) {
          _board[i] = DWARF;
        } else if (piecePositions[i] == TROLL) {
          _board[i] = TROLL;
        }
      }
    }
  }

  // Reset the board to starting position
  function reset() {
    load(DEFAULT_POSITION);
  }

  if (position) {
    load(position);
  } else {
    reset();
  }

  return { board, moves, move, load, reset };
}
