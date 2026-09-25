import type { WordEntry, Player, Role } from '../types/game';
import { WORD_DATABASE } from '../data/words';

export const PLAYER_COLORS = [
  '#ec4899', // Pink
  '#3b82f6', // Blue
  '#10b981', // Emerald
  '#f59e0b', // Amber
  '#8b5cf6', // Purple
  '#06b6d4', // Cyan
  '#f43f5e', // Rose
  '#14b8a6', // Teal
  '#a855f7', // Violet
  '#eab308', // Yellow
  '#6366f1', // Indigo
  '#84cc16', // Lime
];

export const PLAYER_AVATARS = [
  '🦊', '🐼', '🦁', '🐯', '🐨', '🐸', '🦉', '🐙', '🦄', '🐲', '🐵', '🐺'
];

export const SUGGESTED_NAMES = [
  'pt balaji', 'Karthikeyan', 'Bala Surya', 'Gnanesh', 'Sbb', 'Rohan',
  'Ananya', 'Vikram', 'Meera', 'Dev', 'Pooja', 'Sanjay'
];

/**
 * Pick a random word based on selected categories.
 * If categories is empty or includes "All", picks from full 200 words.
 */
export function pickRandomWord(selectedCategories: string[]): WordEntry {
  let candidates = WORD_DATABASE;
  if (selectedCategories.length > 0 && !selectedCategories.includes('All')) {
    const filtered = WORD_DATABASE.filter(w => selectedCategories.includes(w.category));
    if (filtered.length > 0) {
      candidates = filtered;
    }
  }
  const randomIndex = Math.floor(Math.random() * candidates.length);
  return candidates[randomIndex];
}

/**
 * Shuffles an array of players randomly using Fisher-Yates algorithm.
 */
export function shufflePlayers(players: Player[]): Player[] {
  const shuffled = [...players];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

/**
 * Assigns one random player as the Impostor and all others as Citizens.
 */
export function assignRoles(players: Player[]): { players: Player[]; impostorId: string } {
  if (players.length < 3) {
    throw new Error('At least 3 players required to assign roles');
  }

  const impostorIndex = Math.floor(Math.random() * players.length);
  const impostorId = players[impostorIndex].id;

  const updatedPlayers = players.map((p, idx) => ({
    ...p,
    role: (idx === impostorIndex ? 'impostor' : 'citizen') as Role,
    isEliminated: false
  }));

  return { players: updatedPlayers, impostorId };
}

/**
 * Tallies votes from all players and returns the eliminated player ID.
 * Handles ties by returning list of tied IDs.
 */
export function tallyVotes(votes: Record<string, string>, activePlayers: Player[]): {
  voteCounts: Record<string, number>;
  eliminatedId: string | null;
  isTie: boolean;
  tiedIds: string[];
} {
  const voteCounts: Record<string, number> = {};
  activePlayers.forEach(p => {
    voteCounts[p.id] = 0;
  });

  Object.values(votes).forEach(targetId => {
    if (targetId in voteCounts) {
      voteCounts[targetId] = (voteCounts[targetId] || 0) + 1;
    } else {
      voteCounts[targetId] = 1;
    }
  });

  let maxVotes = -1;
  let candidatesWithMaxVotes: string[] = [];

  Object.entries(voteCounts).forEach(([id, count]) => {
    if (count > maxVotes) {
      maxVotes = count;
      candidatesWithMaxVotes = [id];
    } else if (count === maxVotes) {
      candidatesWithMaxVotes.push(id);
    }
  });

  const isTie = candidatesWithMaxVotes.length > 1;
  const eliminatedId = isTie ? null : (candidatesWithMaxVotes[0] || null);

  return {
    voteCounts,
    eliminatedId,
    isTie,
    tiedIds: candidatesWithMaxVotes
  };
}

/**
 * Compares impostor's guess to target word.
 * Flexible check: handles case, whitespace, and minor variations.
 */
export function checkImpostorGuess(guess: string, targetWord: string): boolean {
  if (!guess || !targetWord) return false;

  const cleanGuess = guess.trim().toLowerCase().replace(/[^a-z0-9]/g, '');
  const cleanTarget = targetWord.trim().toLowerCase().replace(/[^a-z0-9]/g, '');

  if (cleanGuess === cleanTarget) return true;

  // Check simple plural/singular variations (e.g. pizza vs pizzas)
  if (cleanGuess + 's' === cleanTarget || cleanTarget + 's' === cleanGuess) return true;
  if (cleanGuess + 'es' === cleanTarget || cleanTarget + 'es' === cleanGuess) return true;

  return false;
}
