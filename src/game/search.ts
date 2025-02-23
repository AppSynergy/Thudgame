import {
  InternalMove,
  Piece,
  SearchOperator,
  Side,
  Square,
  DWARF,
  TROLL,
} from "./types";
import {
  boardHex210,
  boardHex210Inverse,
  offTheBoard,
  PIECE_OFFSETS,
  INVERSE_PIECE_OFFSETS,
} from "./Hex210";

// Find all possible moves for a given side.
export function findMoves(board: Piece[], side: Side): InternalMove[] {
  let output: InternalMove[] = [];
  for (let i = 0; i < board.length; i++) {
    if (board[i] === undefined) continue;
    if (board[i] !== side) continue;

    const square = boardHex210Inverse[i];
    const found = findMovesForSinglePiece(board, side, square);
    if (found) {
      output = output.concat(found);
    }
  }
  return output;
}

// Find out if there's any dwarfs surrounding a square.
export function findNearbyDwarfs(board: Piece[], square: number): number[] {
  return PIECE_OFFSETS.reduce((xs, x) => {
    const sq = square + x;
    if (board[sq] === DWARF) xs.push(sq);
    return xs;
  }, [] as number[]);
}

// Find out if there's a line of dwarfs that ends with this square.
export function findDwarfLineLength(
  board: Piece[],
  square: number,
  offset: number
): number {
  let lineLength = 1;
  let sq = square;
  while (true) {
    sq = sq + INVERSE_PIECE_OFFSETS[offset];
    if (board[sq] === DWARF) {
      lineLength += 1;
      continue;
    }
    break;
  }
  return lineLength;
}

// return true to break, false to continue.
export function radialSearch(square: Square, operation: SearchOperator) {
  const from: number = boardHex210[square];
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
      if (offTheBoard(to)) break;
      if (operation({ from, to, offset, distance })) break;
    }
  }
}

// Find possible moves for a given piece.
export function findMovesForSinglePiece(
  board: Piece[],
  piece: Piece,
  square: Square
): InternalMove[] {
  // pieces must be on the board
  if (!(square in boardHex210)) {
    return [];
  }

  const moves: InternalMove[] = [];

  radialSearch(square, ({ from, to, offset, distance }) => {
    if (!board[to]) {
      // if square is empty
      if (piece === TROLL) {
        // trolls can move and maybe capture one nearby dwarf
        const nearbyDwarfs = findNearbyDwarfs(board, to);
        const move = { piece, from, to } as InternalMove;
        if (nearbyDwarfs.length) {
          move.capturable = nearbyDwarfs;
        }
        moves.push(move);
      } else {
        // dwarves can move
        moves.push({ piece, from, to });
      }
    } else {
      // else if square has a piece
      // we can't move on top of our own pieces
      if (board[to] === piece) return true;

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
      return true;
    }

    // trolls can only move one square
    if (piece === TROLL) return true;

    // keep going for dwarfs
    return false;
  });

  return moves;
}
