export interface Puzzle {
  id: number;
  bolum: number;
  harfler: string[];
  kelimeler: string[];
  bonusKelimeler: string[];
  bolgeAdi: string;
  sureDk: number;
}

const puzzles: Puzzle[] = [
  {
    id: 1,
    bolum: 245,
    harfler: ['K', 'A', 'R', 'E', 'P'],
    kelimeler: ['KAR', 'ARE', 'PAR', 'KARE', 'PARE'],
    bonusKelimeler: ['KARP', 'ARPA', 'PERK', 'AKREP'],
    bolgeAdi: 'TÜRKİYE',
    sureDk: 120,
  },
  {
    id: 2,
    bolum: 246,
    harfler: ['A', 'L', 'T', 'I', 'N'],
    kelimeler: ['AL', 'TAN', 'ALT', 'TIN', 'ALTIN'],
    bonusKelimeler: ['ANTI', 'TALI', 'NAL', 'LAN'],
    bolgeAdi: 'TÜRKİYE',
    sureDk: 120,
  },
  {
    id: 3,
    bolum: 247,
    harfler: ['E', 'L', 'M', 'A', 'S'],
    kelimeler: ['EL', 'MAL', 'SAL', 'ELMA', 'SELAM'],
    bonusKelimeler: ['MESELA', 'ELMAS', 'SAME', 'MAS'],
    bolgeAdi: 'JAPONYA',
    sureDk: 120,
  },
  {
    id: 4,
    bolum: 248,
    harfler: ['G', 'Ü', 'N', 'E', 'Ş'],
    kelimeler: ['GÜN', 'ŞEN', 'GEŞ', 'GÜNEŞ'],
    bonusKelimeler: ['NÜGE', 'GENG'],
    bolgeAdi: 'JAPONYA',
    sureDk: 120,
  },
  {
    id: 5,
    bolum: 249,
    harfler: ['D', 'E', 'N', 'İ', 'Z'],
    kelimeler: ['DEN', 'ZEN', 'DİZ', 'NİZ', 'DENİZ'],
    bonusKelimeler: ['ZENİ', 'NİDE'],
    bolgeAdi: 'GÜNEY KORE',
    sureDk: 120,
  },
  {
    id: 6,
    bolum: 250,
    harfler: ['Y', 'I', 'L', 'D', 'I', 'Z'],
    kelimeler: ['YIL', 'DIL', 'DİZ', 'LİD', 'YILDIZ'],
    bonusKelimeler: ['ZİLD', 'LDIZ'],
    bolgeAdi: 'ÇİN',
    sureDk: 150,
  },
];

export default puzzles;
