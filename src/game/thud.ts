import { boardOx88, algebraic, Square } from "./0x88";

export const TROLL = "T";
export const DWARF = "d";

type Piece = "T" | "d";
type Side = Piece;

export interface ThudSquare {
  algebraic: string;
  piece?: Piece;
}

interface InternalMove {
  from: number;
  to: number;
  piece: Piece;
}

interface Move {
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

interface ThudGame {
  board: () => ThudSquare[][];
  moves: (side: Side) => Move[];
  move: (move: Move) => void;
}

// TODO maybe this is a class instead
export function Thud(): ThudGame {
  // Internal representation of board
  let _board = new Array<Piece>(128);

  // TODO proper starting locations. Here's one of each piece.
  _board[0] = DWARF;
  _board[2] = TROLL;

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
    const internalMove = internalMoveFromMove(move);
    _board[internalMove.to] = _board[internalMove.from];
    delete _board[internalMove.from];
  }

  return { board, moves, move };
}
