import {
  boardOx88,
  boardOx88Inverse,
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

function internalMoveFromMove(move: Move): InternalMove {
  return {
    piece: move.piece,
    from: boardOx88[move.from],
    to: boardOx88[move.to],
  };
}

function moveFromInternalMove(imove: InternalMove): Move {
  return {
    piece: imove.piece,
    from: boardOx88Inverse[imove.from],
    to: boardOx88Inverse[imove.to],
  };
}

// Find all possible moves for a given side.
export function findMoves(board: Piece[], side: Side): InternalMove[] {
  let output: InternalMove[] = [];
  for (let i = 0; i < board.length; i++) {
    if (board[i] === undefined) continue;
    if (board[i] !== side) continue;

    const square = boardOx88Inverse[i];
    const found = findMovesForSinglePiece(board, side, square);
    if (found) {
      output = output.concat(found);
    }
  }
  return output;
}

// Find possible moves for a given piece.
// TODO dwarf working?
export function findMovesForSinglePiece(
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
      // only check squares on the board
      if (to & 0x88) break;

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
  let iboard = new Array<Piece>(128);
  let iturn = DWARF;

  // Data from drawing the current board
  function board(): ThudBoard {
    const output = [];
    let row = [];

    for (let i = boardOx88.a8; i <= boardOx88.h1; i++) {
      if (iboard[i] == null) {
        row.push({
          algebraic: algebraic(i),
        });
      } else {
        row.push({
          algebraic: algebraic(i),
          piece: iboard[i],
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

  // Find all the legal moves for a piece.
  function moves(side: Side): Move[] {
    const found = findMoves(iboard, side);
    return found.map((m) => moveFromInternalMove(m));
  }

  // Move a single piece.
  function move(move: Move) {
    if (iturn == move.piece) {
      const internalMove = internalMoveFromMove(move);
      iboard[internalMove.to] = iboard[internalMove.from];
      delete iboard[internalMove.from];
    }

    iturn = iturn == DWARF ? TROLL : DWARF;
  }

  // Loard a board position.
  function load(position: string) {
    const [turn, pieces] = position.split("x");
    if (turn && (turn == DWARF || turn == TROLL)) {
      iturn = turn;
    }

    if (pieces) {
      const piecePositions = pieces.split("");
      for (let i = 0; i < piecePositions.length; i++) {
        if (piecePositions[i] == DWARF) {
          iboard[i] = DWARF;
        } else if (piecePositions[i] == TROLL) {
          iboard[i] = TROLL;
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
