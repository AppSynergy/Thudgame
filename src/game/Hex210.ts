// prettier-ignore
// TODO remove corners
export type Square =
  "aE" |"bE" |"cE" |"dE" |"eE" |"fE" |"gE" |"hE" |"iE" |"jE" |"kE" |"lE" |"mE" |"nE" |"oE" |
  "aD" |"bD" |"cD" |"dD" |"eD" |"fD" |"gD" |"hD" |"iD" |"jD" |"kD" |"lD" |"mD" |"nD" |"oD" |
  "aC" |"bC" |"cC" |"dC" |"eC" |"fC" |"gC" |"hC" |"iC" |"jC" |"kC" |"lC" |"mC" |"nC" |"oC" |
  "aB" |"bB" |"cB" |"dB" |"eB" |"fB" |"gB" |"hB" |"iB" |"jB" |"kB" |"lB" |"mB" |"nB" |"oB" |
  "aA" |"bA" |"cA" |"dA" |"eA" |"fA" |"gA" |"hA" |"iA" |"jA" |"kA" |"lA" |"mA" |"nA" |"oA" |
  "a9" |"b9" |"c9" |"d9" |"e9" |"f9" |"g9" |"h9" |"i9" |"j9" |"k9" |"l9" |"m9" |"n9" |"o9" |
  "a8" |"b8" |"c8" |"d8" |"e8" |"f8" |"g8" |"h8" |"i8" |"j8" |"k8" |"l8" |"m8" |"n8" |"o8" |
  "a7" |"b7" |"c7" |"d7" |"e7" |"f7" |"g7" |"h7" |"i7" |"j7" |"k7" |"l7" |"m7" |"n7" |"o7" |
  "a6" |"b6" |"c6" |"d6" |"e6" |"f6" |"g6" |"h6" |"i6" |"j6" |"k6" |"l6" |"m6" |"n6" |"o6" |
  "a5" |"b5" |"c5" |"d5" |"e5" |"f5" |"g5" |"h5" |"i5" |"j5" |"k5" |"l5" |"m5" |"n5" |"o5" |
  "a4" |"b4" |"c4" |"d4" |"e4" |"f4" |"g4" |"h4" |"i4" |"j4" |"k4" |"l4" |"m4" |"n4" |"o4" |
  "a3" |"b3" |"c3" |"d3" |"e3" |"f3" |"g3" |"h3" |"i3" |"j3" |"k3" |"l3" |"m3" |"n3" |"o3" |
  "a2" |"b2" |"c2" |"d2" |"e2" |"f2" |"g2" |"h2" |"i2" |"j2" |"k2" |"l2" |"m2" |"n2" |"o2" |
  "a1" |"b1" |"c1" |"d1" |"e1" |"f1" |"g1" |"h1" |"i1" |"j1" |"k1" |"l1" |"m1" |"n1" |"o1" ;

// prettier-ignore
// TODO remove corners
export const boardHex210:  Record<string,  number> = {
  aE: 0,   bE: 1,   cE: 2,   dE: 3,   eE: 4,   fE: 5,   gE: 6, hE: 7, iE: 8, jE: 9, kE: 10, lE: 11, mE: 12, nE: 13, oE: 14, 
  aD: 32,  bD: 33,  cD: 34,  dD: 35,  eD: 36,  fD: 37,  gD: 38, hD: 39, iD: 40, jD: 41, kD: 42, lD: 43, mD: 44, nD: 45, oD: 46, 
  aC: 64,  bC: 65,  cC: 66,  dC: 67,  eC: 68,  fC: 69,  gC: 70, hC: 71, iC: 72, jC: 73, kC: 74, lC: 75, mC: 76, nC: 77, oC: 78, 
  aB: 96,  bB: 97,  cB: 98,  dB: 99,  eB: 100, fB: 101, gB: 102, hB: 103, iB: 104, jB: 105, kB: 106, lB: 107, mB: 108, nB: 109, oB: 110, 
  aA: 128, bA: 129, cA: 130, dA: 131, eA: 132, fA: 133, gA: 134, hA: 135, iA: 136, jA: 137, kA: 138, lA: 139, mA: 140, nA: 141, oA: 142, 
  a9: 160, b9: 161, c9: 162, d9: 163, e9: 164, f9: 165, g9: 166, h9: 167, i9: 168, j9: 169, k9: 170, l9: 171, m9: 172, n9: 173, o9: 174, 
  a8: 192, b8: 193, c8: 194, d8: 195, e8: 196, f8: 197, g8: 198, h8: 199, i8: 200, j8: 201, k8: 202, l8: 203, m8: 204, n8: 205, o8: 206, 
  a7: 224, b7: 225, c7: 226, d7: 227, e7: 228, f7: 229, g7: 230, h7: 231, i7: 232, j7: 233, k7: 234, l7: 235, m7: 236, n7: 237, o7: 238, 
  a6: 256, b6: 257, c6: 258, d6: 259, e6: 260, f6: 261, g6: 262, h6: 263, i6: 264, j6: 265, k6: 266, l6: 267, m6: 268, n6: 269, o6: 270, 
  a5: 288, b5: 289, c5: 290, d5: 291, e5: 292, f5: 293, g5: 294, h5: 295, i5: 296, j5: 297, k5: 298, l5: 299, m5: 300, n5: 301, o5: 302, 
  a4: 320, b4: 321, c4: 322, d4: 323, e4: 324, f4: 325, g4: 326, h4: 327, i4: 328, j4: 329, k4: 330, l4: 331, m4: 332, n4: 333, o4: 334, 
  a3: 352, b3: 353, c3: 354, d3: 355, e3: 356, f3: 357, g3: 358, h3: 359, i3: 360, j3: 361, k3: 362, l3: 363, m3: 364, n3: 365, o3: 366, 
  a2: 384, b2: 385, c2: 386, d2: 387, e2: 388, f2: 389, g2: 390, h2: 391, i2: 392, j2: 393, k2: 394, l2: 395, m2: 396, n2: 397, o2: 398, 
  a1: 416, b1: 417, c1: 418, d1: 419, e1: 420, f1: 421, g1: 422, h1: 423, i1: 424, j1: 425, k1: 426, l1: 427, m1: 428, n1: 429, o1: 430, 
}

export const boardHex210Inverse = Object.fromEntries(
  Object.entries(boardHex210).map(([key, value]) => [value, key])
) as Record<number, Square>;

export const PIECE_OFFSETS = [-31, -32, -33, 1, 31, 32, 33, -1];
export const INVERSE_PIECE_OFFSETS: Record<number, number> = {
  "-33": 31,
  "-32": 32,
  "-31": 33,
  "-1": 1,
  1: -1,
  31: -33,
  32: -32,
  33: -31,
};

// Extracts the zero-based rank of an Hex210 square.
export function rank(square: number): number {
  return square >> 5;
}

// Extracts the zero-based file of an Hex210 square.
export function file(square: number): number {
  return square & 0x1f;
}

// Rank in SAN
export function rankSan(square: number): string {
  const r = rank(square);
  return "EDCBA987654321".substring(r, r + 1);
}

// File in SAN
export function fileSan(square: number): string {
  const f = file(square);
  return "abcdefghijklmno".substring(f, f + 1);
}

// Converts a Hex210 square to algebraic notation.
export function algebraic(square: number): Square {
  return (fileSan(square) + rankSan(square)) as Square;
}
