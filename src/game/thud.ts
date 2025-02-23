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
import { boardHex210, algebraic, boardHex210Values } from "./Hex210";
import { internalMoveFromMove, moveFromInternalMove } from "./moves";
import { findMoves } from "./search";

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

  // Reset the board to default position
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
