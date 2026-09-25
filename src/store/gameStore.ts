import { create } from 'zustand';
import type { GamePhase, GameSettings, GameState, Player } from '../types/game';
import { assignRoles, checkImpostorGuess, pickRandomWord, PLAYER_AVATARS, PLAYER_COLORS, shufflePlayers, SUGGESTED_NAMES, tallyVotes } from '../utils/gameLogic';
import { playClickSound, playSecretRevealSound, playVictorySound, playVoteSound } from '../utils/soundEffects';

interface GameStoreActions {
  setPhase: (phase: GamePhase) => void;
  updateSettings: (settings: Partial<GameSettings>) => void;
  addPlayer: (name?: string) => void;
  removePlayer: (id: string) => void;
  updatePlayerName: (id: string, name: string) => void;
  populateDefaultPlayers: (count?: number) => void;
  toggleSound: () => void;
  toggleImpostorHint: () => void;
  toggleRandomStartingPlayer: () => void;
  shuffleCurrentPlayers: () => void;

  // Game lifecycle
  startNewGame: () => void;
  nextRoleReveal: () => void;
  submitClue: (clue: string) => void;
  startVoting: () => void;
  castVote: (targetId: string) => void;
  resolveVotes: () => void;
  proceedFromReveal: () => void;
  submitFinalGuess: (guess: string) => void;
  playAgain: (keepPlayers?: boolean) => void;
  resetToHome: () => void;
}

const initialSettings: GameSettings = {
  playerCount: 4,
  selectedCategories: ['All'],
  difficulty: 'easy',
  gameMode: 'classic',
  discussionTimerSeconds: 60,
  showImpostorHint: true,
  randomStartingPlayer: true,
};

const initialPlayers: Player[] = [
  { id: 'p1', name: 'HARISH', color: PLAYER_COLORS[0], avatar: PLAYER_AVATARS[0] },
  { id: 'p2', name: 'VIKRAM', color: PLAYER_COLORS[1], avatar: PLAYER_AVATARS[1] },
  { id: 'p3', name: 'NANDHA', color: PLAYER_COLORS[2], avatar: PLAYER_AVATARS[2] },
  { id: 'p4', name: 'BALA SURYA', color: PLAYER_COLORS[3], avatar: PLAYER_AVATARS[3] },
];

export const useGameStore = create<GameState & GameStoreActions>((set, get) => ({
  phase: 'home',
  settings: initialSettings,
  players: initialPlayers,
  activeWord: null,
  impostorId: null,
  currentRoleRevealIndex: 0,
  clues: [],
  currentCluePlayerIndex: 0,
  votes: {},
  currentVoterIndex: 0,
  eliminatedPlayerId: null,
  impostorGuess: '',
  impostorGuessCorrect: null,
  winner: null,
  winnerReason: '',
  soundEnabled: true,

  setPhase: (phase) => {
    const { soundEnabled } = get();
    playClickSound(soundEnabled);
    set({ phase });
  },

  updateSettings: (newSettings) => {
    set((state) => {
      const updated = { ...state.settings, ...newSettings };
      // If player count changed and exceeds current players, add players
      let players = [...state.players];
      if (newSettings.playerCount && newSettings.playerCount !== state.players.length) {
        if (newSettings.playerCount > players.length) {
          const needed = newSettings.playerCount - players.length;
          for (let i = 0; i < needed; i++) {
            const nextIdx = players.length;
            const defaultName = SUGGESTED_NAMES[nextIdx % SUGGESTED_NAMES.length] + (nextIdx >= SUGGESTED_NAMES.length ? ` ${Math.floor(nextIdx / SUGGESTED_NAMES.length) + 1}` : '');
            players.push({
              id: `p-${Date.now()}-${nextIdx}`,
              name: defaultName,
              color: PLAYER_COLORS[nextIdx % PLAYER_COLORS.length],
              avatar: PLAYER_AVATARS[nextIdx % PLAYER_AVATARS.length],
            });
          }
        } else if (newSettings.playerCount < players.length && newSettings.playerCount >= 3) {
          players = players.slice(0, newSettings.playerCount);
        }
      }
      return { settings: updated, players };
    });
  },

  addPlayer: (name) => {
    const { players, soundEnabled } = get();
    if (players.length >= 12) return;
    playClickSound(soundEnabled);
    const nextIdx = players.length;
    const finalName = name?.trim() || SUGGESTED_NAMES[nextIdx % SUGGESTED_NAMES.length];
    const newPlayer: Player = {
      id: `p-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      name: finalName,
      color: PLAYER_COLORS[nextIdx % PLAYER_COLORS.length],
      avatar: PLAYER_AVATARS[nextIdx % PLAYER_AVATARS.length],
    };
    const updated = [...players, newPlayer];
    set({
      players: updated,
      settings: { ...get().settings, playerCount: updated.length }
    });
  },

  removePlayer: (id) => {
    const { players, soundEnabled } = get();
    if (players.length <= 3) return; // Minimum 3 players required
    playClickSound(soundEnabled);
    const updated = players.filter((p) => p.id !== id);
    set({
      players: updated,
      settings: { ...get().settings, playerCount: updated.length }
    });
  },

  updatePlayerName: (id, name) => {
    set((state) => ({
      players: state.players.map((p) => (p.id === id ? { ...p, name: name } : p))
    }));
  },

  populateDefaultPlayers: (count = 4) => {
    const clamped = Math.min(Math.max(count, 3), 12);
    const newPlayers: Player[] = [];
    for (let i = 0; i < clamped; i++) {
      newPlayers.push({
        id: `p${i + 1}`,
        name: SUGGESTED_NAMES[i % SUGGESTED_NAMES.length],
        color: PLAYER_COLORS[i % PLAYER_COLORS.length],
        avatar: PLAYER_AVATARS[i % PLAYER_AVATARS.length],
      });
    }
    set({
      players: newPlayers,
      settings: { ...get().settings, playerCount: clamped }
    });
  },

  toggleSound: () => {
    set((state) => ({ soundEnabled: !state.soundEnabled }));
  },

  toggleImpostorHint: () => {
    const { settings, soundEnabled } = get();
    playClickSound(soundEnabled);
    set({
      settings: {
        ...settings,
        showImpostorHint: !settings.showImpostorHint,
      }
    });
  },

  toggleRandomStartingPlayer: () => {
    const { settings, soundEnabled } = get();
    playClickSound(soundEnabled);
    set({
      settings: {
        ...settings,
        randomStartingPlayer: !settings.randomStartingPlayer,
      }
    });
  },

  shuffleCurrentPlayers: () => {
    const { players, soundEnabled } = get();
    playClickSound(soundEnabled);
    set({ players: shufflePlayers(players) });
  },

  startNewGame: () => {
    const { settings, players, soundEnabled } = get();
    if (players.length < 3) return;

    // If randomStartingPlayer is enabled, randomize player order so the game starts with a random person
    const playersToUse = settings.randomStartingPlayer ? shufflePlayers(players) : [...players];

    // Pick random word and assign roles
    const activeWord = pickRandomWord(settings.selectedCategories);
    const { players: assignedPlayers, impostorId } = assignRoles(playersToUse);

    playClickSound(soundEnabled);

    set({
      players: assignedPlayers,
      activeWord,
      impostorId,
      currentRoleRevealIndex: 0,
      clues: [],
      currentCluePlayerIndex: 0,
      votes: {},
      currentVoterIndex: 0,
      eliminatedPlayerId: null,
      impostorGuess: '',
      impostorGuessCorrect: null,
      winner: null,
      winnerReason: '',
      phase: 'role-reveal',
    });
  },

  nextRoleReveal: () => {
    const { currentRoleRevealIndex, players, soundEnabled } = get();
    playClickSound(soundEnabled);
    if (currentRoleRevealIndex + 1 < players.length) {
      set({ currentRoleRevealIndex: currentRoleRevealIndex + 1 });
    } else {
      // Everyone has seen their secret role, proceed to clue phase
      set({
        phase: 'clue-phase',
        currentCluePlayerIndex: 0,
      });
    }
  },

  submitClue: (clueText) => {
    const { currentCluePlayerIndex, players, clues, soundEnabled } = get();
    const cleanClue = clueText.trim();
    if (!cleanClue) return;

    const currentPlayer = players[currentCluePlayerIndex];
    const newEntry = {
      playerId: currentPlayer.id,
      playerName: currentPlayer.name,
      playerColor: currentPlayer.color,
      clue: cleanClue,
      order: clues.length + 1,
    };

    const updatedClues = [...clues, newEntry];
    playVoteSound(soundEnabled);

    if (currentCluePlayerIndex + 1 < players.length) {
      set({
        clues: updatedClues,
        currentCluePlayerIndex: currentCluePlayerIndex + 1,
      });
    } else {
      // All players gave clues -> proceed to Discussion
      set({
        clues: updatedClues,
        phase: 'discussion',
      });
    }
  },

  startVoting: () => {
    const { soundEnabled } = get();
    playClickSound(soundEnabled);
    set({
      phase: 'voting',
      votes: {},
      currentVoterIndex: 0,
    });
  },

  castVote: (targetId) => {
    const { currentVoterIndex, players, votes, soundEnabled } = get();
    const currentVoter = players[currentVoterIndex];
    if (!currentVoter) return;

    playVoteSound(soundEnabled);
    const newVotes = { ...votes, [currentVoter.id]: targetId };

    if (currentVoterIndex + 1 < players.length) {
      set({
        votes: newVotes,
        currentVoterIndex: currentVoterIndex + 1,
      });
    } else {
      // All players have voted!
      set({
        votes: newVotes,
      });
      // Automatically resolve votes
      get().resolveVotes();
    }
  },

  resolveVotes: () => {
    const { votes, players, soundEnabled } = get();
    const result = tallyVotes(votes, players);

    // In case of a tie, if tiedIds exist, randomly eliminate one of the top voted or pick first
    let eliminatedId = result.eliminatedId;
    if (result.isTie && result.tiedIds.length > 0) {
      eliminatedId = result.tiedIds[Math.floor(Math.random() * result.tiedIds.length)];
    }

    playVoteSound(soundEnabled);
    set({
      eliminatedPlayerId: eliminatedId,
      phase: 'reveal-impostor',
    });
  },

  proceedFromReveal: () => {
    const { eliminatedPlayerId, impostorId, soundEnabled, players } = get();
    const isImpostorEliminated = eliminatedPlayerId === impostorId;
    playSecretRevealSound(isImpostorEliminated, soundEnabled);

    if (isImpostorEliminated) {
      // Impostor caught! They get ONE LAST CHANCE to guess the secret word!
      set({
        phase: 'final-guess',
      });
    } else {
      // An innocent citizen was eliminated! Impostor wins!
      const eliminatedPlayer = players.find(p => p.id === eliminatedPlayerId);
      const impostor = players.find(p => p.id === impostorId);
      playVictorySound(soundEnabled);
      set({
        phase: 'winner',
        winner: 'impostor',
        winnerReason: `Citizens eliminated innocent player ${eliminatedPlayer?.name || 'a citizen'}! The Impostor (${impostor?.name}) escaped unnoticed!`,
      });
    }
  },

  submitFinalGuess: (guess) => {
    const { activeWord, impostorId, players, soundEnabled } = get();
    if (!activeWord) return;

    const isCorrect = checkImpostorGuess(guess, activeWord.word);
    const impostor = players.find(p => p.id === impostorId);

    playVictorySound(soundEnabled);

    if (isCorrect) {
      set({
        phase: 'winner',
        impostorGuess: guess,
        impostorGuessCorrect: true,
        winner: 'impostor',
        winnerReason: `Brilliant! Impostor ${impostor?.name || 'The Impostor'} was caught, but correctly guessed "${activeWord.word}" and steals the victory!`,
      });
    } else {
      set({
        phase: 'winner',
        impostorGuess: guess,
        impostorGuessCorrect: false,
        winner: 'citizens',
        winnerReason: `Citizens Win! ${impostor?.name || 'The Impostor'} failed to guess the secret word "${activeWord.word}" (guessed "${guess}").`,
      });
    }
  },

  playAgain: (keepPlayers = true) => {
    const { soundEnabled } = get();
    playClickSound(soundEnabled);
    if (keepPlayers) {
      get().startNewGame();
    } else {
      set({
        phase: 'lobby',
        activeWord: null,
        impostorId: null,
        currentRoleRevealIndex: 0,
        clues: [],
        currentCluePlayerIndex: 0,
        votes: {},
        currentVoterIndex: 0,
        eliminatedPlayerId: null,
        impostorGuess: '',
        impostorGuessCorrect: null,
        winner: null,
        winnerReason: '',
      });
    }
  },

  resetToHome: () => {
    const { soundEnabled } = get();
    playClickSound(soundEnabled);
    set({
      phase: 'home',
      activeWord: null,
      impostorId: null,
      currentRoleRevealIndex: 0,
      clues: [],
      currentCluePlayerIndex: 0,
      votes: {},
      currentVoterIndex: 0,
      eliminatedPlayerId: null,
      impostorGuess: '',
      impostorGuessCorrect: null,
      winner: null,
      winnerReason: '',
    });
  }
}));
