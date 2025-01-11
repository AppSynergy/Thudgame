import { Move } from "../game/thud";

export interface ThudAi {
  name: string;
  description: string;
  decideMove: (moves: Move[]) => Move | null;
}
