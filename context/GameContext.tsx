import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import puzzles, { Puzzle } from '@/constants/puzzles';

interface PlayerStats {
  seviye: number;
  xp: number;
  maxXp: number;
  altin: number;
  elmas: number;
  yildiz: number;
  kozmikPass: number;
  kozmikPassMax: number;
  toplamKelime: number;
}

interface GameContextType {
  playerStats: PlayerStats;
  currentPuzzle: Puzzle;
  currentPuzzleIndex: number;
  bulunanKelimeler: string[];
  bonusBulunan: string[];
  timer: number;
  timerActive: boolean;
  oyunBitti: boolean;
  kazandi: boolean;
  ansiklopedi: string[];
  sonMesaj: string;
  setPuzzleIndex: (i: number) => void;
  kelimeBulundu: (kelime: string) => 'dogru' | 'bonus' | 'yanlis';
  timeriBaslat: () => void;
  timeriDurdur: () => void;
  sonrakiBolum: () => void;
  resetOyun: () => void;
}

const defaultStats: PlayerStats = {
  seviye: 127,
  xp: 8790,
  maxXp: 12850,
  altin: 125490,
  elmas: 8250,
  yildiz: 3650,
  kozmikPass: 650,
  kozmikPassMax: 1000,
  toplamKelime: 2847,
};

const GameContext = createContext<GameContextType | null>(null);

export function GameProvider({ children }: { children: React.ReactNode }) {
  const [playerStats, setPlayerStats] = useState<PlayerStats>(defaultStats);
  const [currentPuzzleIndex, setCurrentPuzzleIndex] = useState(0);
  const [currentPuzzle, setCurrentPuzzle] = useState<Puzzle>(puzzles[0]);
  const [bulunanKelimeler, setBulunanKelimeler] = useState<string[]>([]);
  const [bonusBulunan, setBonusBulunan] = useState<string[]>([]);
  const [timer, setTimer] = useState(puzzles[0].sureDk);
  const [timerActive, setTimerActive] = useState(false);
  const [oyunBitti, setOyunBitti] = useState(false);
  const [kazandi, setKazandi] = useState(false);
  const [ansiklopedi, setAnsiklopedi] = useState<string[]>([]);
  const [sonMesaj, setSonMesaj] = useState('');
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (timerActive) {
      timerRef.current = setInterval(() => {
        setTimer((t) => {
          if (t <= 1) {
            clearInterval(timerRef.current!);
            setTimerActive(false);
            setOyunBitti(true);
            setKazandi(false);
            setSonMesaj('SÜRE DOLDU! Tekrar dene.');
            return 0;
          }
          return t - 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [timerActive]);

  const setPuzzleIndex = useCallback((i: number) => {
    const idx = i % puzzles.length;
    const puzzle = puzzles[idx];
    setCurrentPuzzleIndex(idx);
    setCurrentPuzzle(puzzle);
    setBulunanKelimeler([]);
    setBonusBulunan([]);
    setTimer(puzzle.sureDk);
    setOyunBitti(false);
    setKazandi(false);
    setSonMesaj('');
    setTimerActive(false);
  }, []);

  const kelimeBulundu = useCallback(
    (kelime: string): 'dogru' | 'bonus' | 'yanlis' => {
      const upper = kelime.toUpperCase();
      if (
        currentPuzzle.kelimeler.includes(upper) &&
        !bulunanKelimeler.includes(upper)
      ) {
        const yeni = [...bulunanKelimeler, upper];
        setBulunanKelimeler(yeni);
        setAnsiklopedi((prev) =>
          prev.includes(upper) ? prev : [...prev, upper]
        );
        setPlayerStats((prev) => ({
          ...prev,
          altin: prev.altin + upper.length * 10,
          xp: prev.xp + upper.length * 5,
          toplamKelime: prev.toplamKelime + 1,
        }));
        setSonMesaj('');
        if (yeni.length === currentPuzzle.kelimeler.length) {
          setOyunBitti(true);
          setKazandi(true);
          setTimerActive(false);
          setSonMesaj('Bölümü Tamamladın!');
          setPlayerStats((prev) => ({
            ...prev,
            altin: prev.altin + 300,
            elmas: prev.elmas + 5,
            kozmikPass: Math.min(
              prev.kozmikPass + 25,
              prev.kozmikPassMax
            ),
          }));
        }
        return 'dogru';
      } else if (
        currentPuzzle.bonusKelimeler.includes(upper) &&
        !bonusBulunan.includes(upper)
      ) {
        setBonusBulunan((prev) => [...prev, upper]);
        setAnsiklopedi((prev) =>
          prev.includes(upper) ? prev : [...prev, upper]
        );
        setPlayerStats((prev) => ({
          ...prev,
          altin: prev.altin + upper.length * 25,
          elmas: prev.elmas + 1,
        }));
        setSonMesaj('BONUS KELİME!');
        return 'bonus';
      }
      setSonMesaj('');
      return 'yanlis';
    },
    [currentPuzzle, bulunanKelimeler, bonusBulunan]
  );

  const timeriBaslat = useCallback(() => setTimerActive(true), []);
  const timeriDurdur = useCallback(() => setTimerActive(false), []);

  const sonrakiBolum = useCallback(() => {
    setPuzzleIndex(currentPuzzleIndex + 1);
  }, [currentPuzzleIndex, setPuzzleIndex]);

  const resetOyun = useCallback(() => {
    setPuzzleIndex(currentPuzzleIndex);
  }, [currentPuzzleIndex, setPuzzleIndex]);

  return (
    <GameContext.Provider
      value={{
        playerStats,
        currentPuzzle,
        currentPuzzleIndex,
        bulunanKelimeler,
        bonusBulunan,
        timer,
        timerActive,
        oyunBitti,
        kazandi,
        ansiklopedi,
        sonMesaj,
        setPuzzleIndex,
        kelimeBulundu,
        timeriBaslat,
        timeriDurdur,
        sonrakiBolum,
        resetOyun,
      }}
    >
      {children}
    </GameContext.Provider>
  );
}

export function useGame(): GameContextType {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error('useGame must be used within GameProvider');
  return ctx;
}
