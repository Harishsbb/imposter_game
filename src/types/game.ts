export interface WordEntry {
  word: string;
  category: string;
  difficulty: "easy";
  relatedWords: string[];
}

export type Role = 'citizen' | 'impostor';

export interface Player {
  id: string;
  name: string;
  color: string;
  avatar: string;
  role?: Role;
  isEliminated?: boolean;
}

export interface ClueEntry {
  playerId: string;
  playerName: string;
  playerColor: string;
  clue: string;
  order: number;
}

export interface VoteRecord {
  voterId: string;
  targetId: string;
}

export type GamePhase =
  | 'home'
  | 'how-to-play'
  | 'create-game'
  | 'lobby'
  | 'role-reveal'
  | 'clue-phase'
  | 'discussion'
  | 'voting'
  | 'reveal-impostor'
  | 'final-guess'
  | 'winner';

export type WinnerType = 'citizens' | 'impostor' | null;

export interface GameSettings {
  playerCount: number;
  selectedCategories: string[];
  difficulty: 'easy';
  gameMode: 'classic';
  discussionTimerSeconds: number;
  showImpostorHint: boolean;
  randomStartingPlayer: boolean;
}

export interface GameState {
  phase: GamePhase;
  settings: GameSettings;
  players: Player[];
  activeWord: WordEntry | null;
  impostorId: string | null;
  currentRoleRevealIndex: number;
  clues: ClueEntry[];
  currentCluePlayerIndex: number;
  votes: Record<string, string>; // voterId -> targetId
  currentVoterIndex: number;
  eliminatedPlayerId: string | null;
  impostorGuess: string;
  impostorGuessCorrect: boolean | null;
  winner: WinnerType;
  winnerReason: string;
  soundEnabled: boolean;
}
