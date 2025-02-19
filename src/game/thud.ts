import {
  Board,
  Move,
  Piece,
  Side,
  Square,
  ThudGame,
  DWARF,
  TROLL,
} from "./types";
import {
  boardHex210,
  boardHex210Inverse,
  algebraic,
  PIECE_OFFSETS,
  INVERSE_PIECE_OFFSETS,
  boardHex210Values,
  boardHex210Corners,
} from "./Hex210";

// TODO improve Thud Board Notation
// Current turn, then an x, then dwarf and troll positions.
// e marks the end of the row
// Any other character is an empty space.
export const DEFAULT_POSITION = [
  "dx",
  ".....dd.dd.....e",
  "....d.....d....e",
  "...d.......d...e",
  "..d.........d..e",
  ".d...........d.e",
  "d.............de",
  "d.....TTT.....de",
  "......T.T......e",
  "d.....TTT.....de",
  "d.............de",
  ".d...........d.e",
  "..d.........d..e",
  "...d.......d...e",
  "....d.....d....e",
  ".....dd.dd.....e",
];

interface InternalMove {
  from: number;
  to: number;
  piece: Piece;
  capturable?: number[];
  hurl?: boolean;
}

function internalMoveFromMove(move: Move): InternalMove {
  const output: InternalMove = {
    piece: move.piece,
    from: boardHex210[move.from],
    to: boardHex210[move.to],
  };
  if (move?.capturable) {
    output.capturable = move.capturable.map((c) => boardHex210[c]);
  }
  return output;
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

interface SearchOperation {
  from: number;
  to: number;
  offset: number;
  distance: number;
}

// return true to break, false to continue.
type SearchOperator = (op: SearchOperation) => boolean;

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

export function Thud(position?: string): ThudGame {
  // Internal representation of board
  const iboard = new Array<Piece>(512);
  let iturn = DWARF;

  // Data from drawing the current board
  function board(): Board {
    const output = [];
    let row = [];

    // TODO why do we need +5 here?
    for (let i = 0; i <= boardHex210.j1 + 5; i++) {
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
      const imove = internalMoveFromMove(move);
      // move the piece
      iboard[imove.to] = iboard[imove.from];
      delete iboard[imove.from];
    }

    iturn = iturn == DWARF ? TROLL : DWARF;
  }

  // Capture a single dwarf.
  function capture(square: Square) {
    delete iboard[boardHex210[square]];
  }

  // Loard a board position.
  function load(position: string) {
    const [turn, pieces] = position.split("x");
    if (turn && (turn == DWARF || turn == TROLL)) {
      iturn = turn;
    }
    if (pieces) {
      const pos = pieces.split("");
      let k = 0;
      for (let i = 0; i <= boardHex210.j1; i++) {
        const j = i + 16 * k;
        if (pos[i] == "e") k += 1;
        if (pos[i] == DWARF) iboard[j] = DWARF;
        else if (pos[i] == TROLL) iboard[j] = TROLL;
      }
    }
  }

  // Reset the board to starting position
  function reset() {
    load(DEFAULT_POSITION.join(""));
  }

  if (position) {
    load(position);
  } else {
    reset();
  }

  return { board, moves, move, capture, load, reset };
}
