// HEX 210 - Anthill Inside

// +++ Out Of Cheese Error ??????? +++
// prettier-ignore
export type Square =          "fF" |"gF" |"hF" |"iF" |"jF" |
                        "eE" |"fE" |"gE" |"hE" |"iE" |"jE" |"kE" | 
                  "dD" |"eD" |"fD" |"gD" |"hD" |"iD" |"jD" |"kD" |"lD" |
            "cC" |"dC" |"eC" |"fC" |"gC" |"hC" |"iC" |"jC" |"kC" |"lC" |"mC" |
      "bB" |"cB" |"dB" |"eB" |"fB" |"gB" |"hB" |"iB" |"jB" |"kB" |"lB" |"mB" |"nB" |
"aA" |"bA" |"cA" |"dA" |"eA" |"fA" |"gA" |"hA" |"iA" |"jA" |"kA" |"lA" |"mA" |"nA" |"oA" |
"a9" |"b9" |"c9" |"d9" |"e9" |"f9" |"g9" |"h9" |"i9" |"j9" |"k9" |"l9" |"m9" |"n9" |"o9" |
"a8" |"b8" |"c8" |"d8" |"e8" |"f8" |"g8" |"h8" |"i8" |"j8" |"k8" |"l8" |"m8" |"n8" |"o8" |
"a7" |"b7" |"c7" |"d7" |"e7" |"f7" |"g7" |"h7" |"i7" |"j7" |"k7" |"l7" |"m7" |"n7" |"o7" |
"a6" |"b6" |"c6" |"d6" |"e6" |"f6" |"g6" |"h6" |"i6" |"j6" |"k6" |"l6" |"m6" |"n6" |"o6" |
      "b5" |"c5" |"d5" |"e5" |"f5" |"g5" |"h5" |"i5" |"j5" |"k5" |"l5" |"m5" |"n5" |
            "c4" |"d4" |"e4" |"f4" |"g4" |"h4" |"i4" |"j4" |"k4" |"l4" |"m4" |
                  "d3" |"e3" |"f3" |"g3" |"h3" |"i3" |"j3" |"k3" |"l3" |
                        "e2" |"f2" |"g2" |"h2" |"i2" |"j2" |"k2" |
                              "f1" |"g1" |"h1" |"i1" |"j1" ;

// +++ Divide by cucumber error +++
// prettier-ignore
export const boardHex210:  Record<Square,  number> = {
                                   fF:5,  gF:6,  hF:7,  iF:8,  jF:9,
                            eE:36, fE:37, gE:38, hE:39, iE:40, jE:41, kE:42,
                     dD:67, eD:68, fD:69, gD:70, hD:71, iD:72, jD:73, kD:74, lD:75,
              cC:98, dC:99, eC:100,fC:101,gC:102,hC:103,iC:104,jC:105,kC:106,lC:107,mC:108,
       bB:129,cB:130,dB:131,eB:132,fB:133,gB:134,hB:135,iB:136,jB:137,kB:138,lB:139,mB:140,nB:141,
aA:160,bA:161,cA:162,dA:163,eA:164,fA:165,gA:166,hA:167,iA:168,jA:169,kA:170,lA:171,mA:172,nA:173,oA:174,
a9:192,b9:193,c9:194,d9:195,e9:196,f9:197,g9:198,h9:199,i9:200,j9:201,k9:202,l9:203,m9:204,n9:205,o9:206,
a8:224,b8:225,c8:226,d8:227,e8:228,f8:229,g8:230,h8:231,i8:232,j8:233,k8:234,l8:235,m8:236,n8:237,o8:238,
a7:256,b7:257,c7:258,d7:259,e7:260,f7:261,g7:262,h7:263,i7:264,j7:265,k7:266,l7:267,m7:268,n7:269,o7:270,
a6:288,b6:289,c6:290,d6:291,e6:292,f6:293,g6:294,h6:295,i6:296,j6:297,k6:298,l6:299,m6:300,n6:301,o6:302,
       b5:321,c5:322,d5:323,e5:324,f5:325,g5:326,h5:327,i5:328,j5:329,k5:330,l5:331,m5:332,n5:333,
              c4:354,d4:355,e4:356,f4:357,g4:358,h4:359,i4:360,j4:361,k4:362,l4:363,m4:364,
                     d3:387,e3:388,f3:389,g3:390,h3:391,i3:392,j3:393,k3:394,l3:395,
                            e2:420,f2:421,g2:422,h2:423,i2:424,j2:425,k2:426,
                                   f1:453,g1:454,h1:455,i1:456,j1:457
}

export const boardHex210Values = Object.values(boardHex210);

export const boardHex210Inverse = Object.fromEntries(
  Object.entries(boardHex210).map(([key, value]) => [value, key])
) as Record<number, Square>;

// NW corner: 0,1,2,3,4.. 32,33,34,35.. 64,65,66, 96,97.. 128
// NE corner: 10,11,12,13,14.. 43,44,45,46.. 76,77,78.. 109,110, 142
// SW corner: 320.. 352,353.. 384,385,386.. 416,417,418,419.. 448,449,450,451,452
// SE corner: 334.. 365,366.. 396,397,398.. 427,428,429,430.. 458,459,460,461,462
const nwCorner = [0, 1, 2, 3, 4, 32, 33, 34, 35, 64, 65, 66, 96, 97, 128];
const neCorner = [
  10, 11, 12, 13, 14, 43, 44, 45, 46, 76, 77, 78, 109, 110, 142,
];
const swCorner = [
  320, 352, 353, 384, 385, 386, 416, 417, 418, 419, 448, 449, 450, 451, 452,
];
const seCorner = [
  334, 365, 366, 396, 397, 398, 427, 428, 429, 430, 458, 459, 460, 461, 462,
];
export const boardHex210Corners = { nwCorner, neCorner, swCorner, seCorner };

export const PIECE_OFFSETS = [-31, -32, -33, 1, 31, 32, 33, -1];
export const INVERSE_PIECE_OFFSETS: Record<number, number> = {
  "-33": 33,
  "-32": 32,
  "-31": 31,
  "-1": 1,
  1: -1,
  31: -31,
  32: -32,
  33: -33,
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
  return "FEDCBA987654321".substring(r, r + 1);
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
