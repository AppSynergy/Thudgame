import {
  boardOx88,
  boardOx88Inverse,
  algebraic,
  Square as Ox88Square,
  PIECE_OFFSETS,
  INVERSE_PIECE_OFFSETS,
} from "./lib0x88";

export const TROLL = "T";
export const DWARF = "d";

export type Piece = "T" | "d";
export type Side = Piece;

export function toggleSide(side: Side): Side {
  return side == DWARF ? TROLL : DWARF;
}

export function sideToText(side: Side): string {
  return side == DWARF ? "Dwarfs" : "Trolls";
}

export type Square = Ox88Square;

export interface ThudSquare {
  algebraic: Square;
  piece?: Piece;
}

export type ThudBoard = ThudSquare[][];

// TODO improve Thud Board Notation
// Current turn, then an X, then dwarf and troll positions.
// Any other character is an empty space.
export const DEFAULT_POSITION = "dxdoTddT";

interface InternalMove {
  from: number;
  to: number;
  piece: Piece;
  capturable?: number[];
  hurl?: boolean;
}

export interface Move {
  from: Square;
  to: Square;
  piece: Piece;
  capturable?: Square[];
  hurl?: boolean;
}

function internalMoveFromMove(move: Move): InternalMove {
  return {
    piece: move.piece,
    from: boardOx88[move.from],
    to: boardOx88[move.to],
  };
}

function moveFromInternalMove(imove: InternalMove): Move {
  const output: Move = {
    piece: imove.piece,
    from: boardOx88Inverse[imove.from],
    to: boardOx88Inverse[imove.to],
  };
  if (imove.capturable) {
    output.capturable = imove.capturable.map((c) => boardOx88Inverse[c]);
  }
  if (imove.piece === DWARF && imove.hurl) {
    output.hurl = true;
  }
  return output;
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

// Check if we can move to a square.
export function isAvailableMoveSquare(
  availableMoves: Move[],
  square: ThudSquare
): boolean {
  if (availableMoves.map((m) => m.to).includes(square.algebraic)) {
    return true;
  }
  return false;
}

// Check if we can make a capture on a square.
export function isAvailableCaptureSquare(
  availableMoves: Move[],
  square: ThudSquare
): boolean {
  if (
    availableMoves
      .reduce((ms, m) => {
        ms = ms.concat(m?.capturable as Square[]);
        return ms;
      }, [] as Square[])
      .includes(square.algebraic)
  ) {
    return true;
  }
  return false;
}

// Find out if there's any dwarfs surrounding a square.
function findNearbyDwarfs(board: Piece[], square: number): number[] {
  return PIECE_OFFSETS.reduce((xs, x) => {
    const d = square + x;
    if (board[d] === DWARF) xs.push(d);
    return xs;
  }, [] as number[]);
}

// Find out if there's a line of dwarfs that ends with this square.
function findDwarfLineLength(
  board: Piece[],
  square: number,
  offset: number
): number {
  let lineLength = 1;
  const maxLength = 3;
  for (let i = 0; i < maxLength; i++) {
    const nearbyDwarfs = findNearbyDwarfs(board, square);
    const dwarfInLine = nearbyDwarfs.includes(
      square + INVERSE_PIECE_OFFSETS[offset]
    );
    if (dwarfInLine) {
      lineLength += 1;
    } else {
      break;
    }
  }
  return lineLength;
}

// Find possible moves for a given piece.
// TODO dwarf working?
export function findMovesForSinglePiece(
  board: Piece[],
  piece: Piece,
  square: Square
): InternalMove[] {
  // pieces must be on the board
  if (!(square in boardOx88)) {
    return [];
  }

  const moves = [];
  const from: number = boardOx88[square];

  let to: number;
  for (let j = 0, len = PIECE_OFFSETS.length; j < len; j++) {
    const offset = PIECE_OFFSETS[j];
    let distance = 0;
    to = from;

    while (true) {
      // check moves in a given direction
      to += offset;
      distance += 1;

      // only check squares on the board
      if (to & 0x88) break;

      if (!board[to]) {
        // if square is empty
        if (piece === TROLL) {
          // trolls can move and maybe capture one nearby dwarf
          const nearbyDwarfs = findNearbyDwarfs(board, to);
          moves.push({ piece, from, to, capturable: nearbyDwarfs });
        } else {
          // dwarves can move
          moves.push({ piece, from, to });
        }
      } else {
        // else if square has a piece
        // we can't move on top of our own pieces
        if (board[to] === piece) break;

        // dwarf hurling
        if (piece === DWARF) {
          // a single dwarf can hurl one square and capture a troll
          if (distance == 1) {
            moves.push({ piece, from, to });
          } else {
            // for dwarfs, find if we're at the front of a line
            const lineLength: number = findDwarfLineLength(board, from, offset);
            // a line of dwarves can hurl further and capture a troll
            if (distance <= lineLength) {
              moves.push({ piece, from, to, hurl: true });
            }
          }
        }

        break;
      }

      // trolls can only move one square
      if (piece === TROLL) break;
    }
  }

  return moves;
}

// Filter all available moves to produce just the moves from a given square.
export function filterAvailableMoves(moves: Move[], algebraic: Square): Move[] {
  const output = [];
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
  const iboard = new Array<Piece>(128);
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
