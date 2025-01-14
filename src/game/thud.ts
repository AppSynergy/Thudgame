import {
  boardHex210,
  boardHex210Inverse,
  algebraic,
  Square as Hex210Square,
  PIECE_OFFSETS,
  INVERSE_PIECE_OFFSETS,
  boardHex210Values,
  boardHex210Corners,
} from "./Hex210";

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

export type Square = Hex210Square;

export interface ThudSquare {
  algebraic?: Square;
  piece?: Piece;
}

export type ThudBoard = ThudSquare[][];

// TODO improve Thud Board Notation
// Current turn, then an X, then dwarf and troll positions.
// Any other character is an empty space.
export const DEFAULT_POSITION = "dx.....dTTdd...";

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
    from: boardHex210[move.from],
    to: boardHex210[move.to],
  };
}

function moveFromInternalMove(imove: InternalMove): Move {
  const output: Move = {
    piece: imove.piece,
    from: boardHex210Inverse[imove.from],
    to: boardHex210Inverse[imove.to],
  };
  if (imove.capturable) {
    output.capturable = imove.capturable.map((c) => boardHex210Inverse[c]);
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

    const square = boardHex210Inverse[i];
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
  if (
    square?.algebraic &&
    availableMoves.map((m) => m.to).includes(square.algebraic)
  ) {
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
    square?.algebraic &&
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

// TODO can this be improved?
export function offTheBoard(square: number): boolean {
  if (square & 0x210) return true;
  if (square > 462) return true;
  if ((square - 15) % 32 == 0) return true;
  if (boardHex210Corners.nwCorner.includes(square)) return true;
  if (boardHex210Corners.neCorner.includes(square)) return true;
  if (boardHex210Corners.swCorner.includes(square)) return true;
  if (boardHex210Corners.seCorner.includes(square)) return true;
  return false;
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

  const moves = [];
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
      // TODO corners and forbidden row / column?
      if (offTheBoard(to)) break;

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
  const iboard = new Array<Piece>(512);
  let iturn = DWARF;

  // Data from drawing the current board
  function board(): ThudBoard {
    const output = [];
    let row = [];

    for (let i = 0; i <= boardHex210.j1; i++) {
      if (!boardHex210Values.includes(i)) {
        // these squares do not exist
        row.push({});
      } else if (iboard[i] == null) {
        // these squares are empty
        row.push({
          algebraic: algebraic(i),
        });
      } else {
        // these squares have pieces
        row.push({
          algebraic: algebraic(i),
          piece: iboard[i],
        });
      }
      // this is the forbidden column
      if ((i + 1) & 0x210) continue;
      // off the board now, finish the row
      if ((i + 2) & 0x210) {
        output.push(row);
        row = [];
        i += 17;
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
