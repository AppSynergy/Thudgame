import {
  boardOx88,
  algebraic,
  Square as Ox88Square,
  PIECE_OFFSETS,
} from "./lib0x88";

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

// Find possible moves for a given piece.
// TODO dwarf working?
export function findMoves(
  board: Piece[],
  piece: Piece,
  square: Square
): InternalMove[] {
  let from: number;
  const moves = [];

  // pieces must be on the board
  if (!(square in boardOx88)) {
    return [];
  }
  from = boardOx88[square];

  let to: number;
  for (let j = 0, len = PIECE_OFFSETS[piece].length; j < len; j++) {
    const offset = PIECE_OFFSETS[piece][j];
    to = from;
    while (true) {
      to += offset;

      // if square is empty
      if (!board[to]) {
        moves.push({ piece, from, to });
      } else {
        // we can't move on top of our own pieces
        if (board[to] == piece) break;

        // but trolls can capture dwarfs
        if (board[to] != piece) {
          moves.push({ piece, from, to });
        }
        break;
      }

      // trolls can only move one square
      if (piece === "T") break;
    }
  }

  return moves;
}

function internalMoveFromMove(move: Move): InternalMove {
  // TODO check if move is legal?
  return {
    piece: move.piece,
    from: boardOx88[move.from],
    to: boardOx88[move.to],
  };
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
  function board(): ThudBoard {
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
      return [
        { piece: DWARF, from: "a8", to: "b8" },
        { piece: DWARF, from: "a8", to: "b7" },
        { piece: DWARF, from: "a8", to: "a7" },
      ];
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
