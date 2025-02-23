import { Move, Piece } from "./types";
import { boardHex210, boardHex210Inverse } from "./Hex210";

export interface InternalMove {
  from: number;
  to: number;
  piece: Piece;
  capturable?: number[];
  hurl?: boolean;
}

export function internalMoveFromMove(move: Move): InternalMove {
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

export function moveFromInternalMove(imove: InternalMove): Move {
  const output: Move = {
    piece: imove.piece,
    from: boardHex210Inverse[imove.from],
    to: boardHex210Inverse[imove.to],
  };

  if (imove.capturable) {
    output.capturable = imove.capturable.map((c) => boardHex210Inverse[c]);
  }
  if (imove.hurl) {
    output.hurl = true;
  }

  return output;
}
