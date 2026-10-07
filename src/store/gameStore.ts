import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { GamePhase, GameSettings, GameState, Player } from '../types/game';
import { assignRoles, checkImpostorGuess, getMaxImpostors, pickRandomWord, PLAYER_AVATARS, PLAYER_COLORS, shufflePlayers, SUGGESTED_NAMES, tallyVotes } from '../utils/gameLogic';
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
  setImpostorCount: (count: number) => void;
  shuffleCurrentPlayers: () => void;
  setStartingPlayer: (playerId: string | 'random') => void;

  // Game lifecycle
  startNewGame: (startingPlayerId?: string | 'random') => void;
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
  showImpostorHint: false, // Default is OFF
  randomStartingPlayer: true,
  impostorCount: 1,
  startingPlayerId: null,
};

const initialPlayers: Player[] = [
  { id: 'p1', name: 'HARISH', color: PLAYER_COLORS[0], avatar: PLAYER_AVATARS[0] },
  { id: 'p2', name: 'VIKRAM', color: PLAYER_COLORS[1], avatar: PLAYER_AVATARS[1] },
  { id: 'p3', name: 'NANDHA', color: PLAYER_COLORS[2], avatar: PLAYER_AVATARS[2] },
  { id: 'p4', name: 'BALA SURYA', color: PLAYER_COLORS[3], avatar: PLAYER_AVATARS[3] },
];

const getMigratedPlayers = (): Player[] => {
  try {
    for (const key of ['impostor_party_save_data', 'impostor_party_save_data_v2', 'impostor-game-storage']) {
      const saved = localStorage.getItem(key);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed?.state?.players) && parsed.state.players.length >= 3) {
          return parsed.state.players;
        }
      }
    }
  } catch {
    // Ignore error
  }
  return initialPlayers;
};

export const useGameStore = create<GameState & GameStoreActions>()(
  persist(
    (set, get) => ({
  phase: 'home',
  settings: initialSettings,
  players: getMigratedPlayers(),
  startingPlayerId: null,
  activeWord: null,
  impostorId: null,
  impostorIds: [],
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
      const maxAllowed = getMaxImpostors(players.length);
      if (updated.impostorCount > maxAllowed) {
        updated.impostorCount = maxAllowed;
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
    const { players, soundEnabled, settings } = get();
    if (players.length <= 3) return; // Minimum 3 players required
    playClickSound(soundEnabled);
    const updated = players.filter((p) => p.id !== id);
    const maxAllowed = getMaxImpostors(updated.length);
    const currentImpostorCount = settings.impostorCount || 1;
    set({
      players: updated,
      settings: {
        ...settings,
        playerCount: updated.length,
        impostorCount: Math.min(currentImpostorCount, maxAllowed),
      },
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
    const maxAllowed = getMaxImpostors(clamped);
    const currentImpostorCount = get().settings.impostorCount || 1;
    set({
      players: newPlayers,
      settings: {
        ...get().settings,
        playerCount: clamped,
        impostorCount: Math.min(currentImpostorCount, maxAllowed),
      }
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
    const nextRandom = !settings.randomStartingPlayer;
    set({
      settings: {
        ...settings,
        randomStartingPlayer: nextRandom,
        startingPlayerId: nextRandom ? null : (settings.startingPlayerId || null),
      }
    });
  },

  setStartingPlayer: (playerId: string | 'random') => {
    const { settings, soundEnabled } = get();
    playClickSound(soundEnabled);
    if (playerId === 'random') {
      set({
        settings: {
          ...settings,
          randomStartingPlayer: true,
          startingPlayerId: null,
        }
      });
    } else {
      set({
        settings: {
          ...settings,
          randomStartingPlayer: false,
          startingPlayerId: playerId,
        }
      });
    }
  },

  setImpostorCount: (count) => {
    const { players, soundEnabled } = get();
    playClickSound(soundEnabled);
    const maxAllowed = getMaxImpostors(players.length);
    const clamped = Math.min(Math.max(1, count), maxAllowed);
    set((state) => ({
      settings: { ...state.settings, impostorCount: clamped },
    }));
  },

  shuffleCurrentPlayers: () => {
    const { players, soundEnabled } = get();
    playClickSound(soundEnabled);
    set({ players: shufflePlayers(players) });
  },

  startNewGame: (chosenStarterId?: string | 'random') => {
    const { settings, players, soundEnabled } = get();
    if (players.length < 3) return;

    // Ensure all players have trimmed non-empty names
    const cleaned = players.map((p, idx) => ({
      ...p,
      name: p.name.trim() || `Player ${idx + 1}`,
    }));

    // Determine target starting player ID: parameter overrides saved setting
    const targetStarter = chosenStarterId !== undefined 
      ? chosenStarterId 
      : (settings.startingPlayerId || (settings.randomStartingPlayer ? 'random' : cleaned[0].id));

    let playersToUse: Player[];

    if (targetStarter === 'random') {
      // Pick random starter and randomize player order
      playersToUse = shufflePlayers(cleaned);
    } else {
      // Specific player chosen: rotate so chosen player is at index 0 (preserving natural circle order)
      const startIndex = cleaned.findIndex((p) => p.id === targetStarter);
      if (startIndex !== -1) {
        playersToUse = [
          ...cleaned.slice(startIndex),
          ...cleaned.slice(0, startIndex),
        ];
      } else {
        playersToUse = shufflePlayers(cleaned);
      }
    }

    const startingPlayer = playersToUse[0];

    // Pick random word and assign roles
    const activeWord = pickRandomWord(settings.selectedCategories);
    const maxAllowed = getMaxImpostors(playersToUse.length);
    const chosenCount = Math.min(Math.max(1, settings.impostorCount || 1), maxAllowed);
    // Index 0 (startingPlayer) is guaranteed to be a Citizen by assignRoles!
    const { players: assignedPlayers, impostorIds, impostorId } = assignRoles(playersToUse, chosenCount);

    playClickSound(soundEnabled);

    set({
      players: assignedPlayers,
      startingPlayerId: startingPlayer.id,
      activeWord,
      impostorId,
      impostorIds,
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
      // Everyone has seen their secret role -> Move directly to voting!
      set({
        phase: 'voting',
        votes: {},
        currentVoterIndex: 0,
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
    const { eliminatedPlayerId, impostorId, impostorIds, soundEnabled, players } = get();
    const eliminatedPlayer = players.find(p => p.id === eliminatedPlayerId);
    const isImpostorEliminated = eliminatedPlayer?.role === 'impostor' || (impostorIds && impostorIds.includes(eliminatedPlayerId || '')) || eliminatedPlayerId === impostorId;
    playSecretRevealSound(isImpostorEliminated, soundEnabled);

    if (isImpostorEliminated) {
      // Impostor caught! They get ONE LAST CHANCE to guess the secret word!
      set({
        phase: 'final-guess',
        impostorId: eliminatedPlayerId,
      });
    } else {
      // An innocent citizen was eliminated! Impostor(s) win!
      const allImpostors = players.filter(p => p.role === 'impostor' || (impostorIds && impostorIds.includes(p.id)) || p.id === impostorId);
      const impostorNames = allImpostors.map(p => p.name).join(' & ') || 'The Impostor';
      playVictorySound(soundEnabled);
      set({
        phase: 'winner',
        winner: 'impostor',
        winnerReason: `Citizens eliminated innocent player ${eliminatedPlayer?.name || 'a citizen'}! The Impostor (${impostorNames}) escaped unnoticed!`,
      });
    }
  },

  submitFinalGuess: (guess) => {
    const { activeWord, impostorId, impostorIds, players, soundEnabled } = get();
    if (!activeWord) return;

    const isCorrect = checkImpostorGuess(guess, activeWord.word);
    const caughtImpostor = players.find(p => p.id === impostorId) || players.find(p => p.role === 'impostor');
    const allImpostors = players.filter(p => p.role === 'impostor' || (impostorIds && impostorIds.includes(p.id)));
    const impostorNames = allImpostors.map(p => p.name).join(' & ') || caughtImpostor?.name || 'The Impostor';

    playVictorySound(soundEnabled);

    if (isCorrect) {
      set({
        phase: 'winner',
        impostorGuess: guess,
        impostorGuessCorrect: true,
        winner: 'impostor',
        winnerReason: `Brilliant! Impostor ${caughtImpostor?.name || 'The Impostor'} was caught, but correctly guessed "${activeWord.word}" and steals victory for ${allImpostors.length > 1 ? 'the Impostors' : 'the Impostor'}!`,
      });
    } else {
      set({
        phase: 'winner',
        impostorGuess: guess,
        impostorGuessCorrect: false,
        winner: 'citizens',
        winnerReason: `Citizens Win! ${caughtImpostor?.name || 'The Impostor'} failed to guess the secret word "${activeWord.word}" (guessed "${guess}"). Impostor was ${impostorNames}.`,
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
        impostorIds: [],
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
      impostorIds: [],
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
}),
    {
      name: 'impostor_party_save_data_v3',
      partialize: (state) => ({
        players: state.players,
        settings: state.settings,
        soundEnabled: state.soundEnabled,
      }),
      merge: (persistedState, currentState) => {
        const persisted = persistedState as Partial<GameState> | undefined;
        if (!persisted) return currentState;
        return {
          ...currentState,
          players:
            Array.isArray(persisted.players) && persisted.players.length >= 3
              ? persisted.players
              : currentState.players,
          settings: persisted.settings
            ? { ...currentState.settings, ...persisted.settings }
            : currentState.settings,
          soundEnabled:
            typeof persisted.soundEnabled === 'boolean'
              ? persisted.soundEnabled
              : currentState.soundEnabled,
        };
      },
    }
  )
);

