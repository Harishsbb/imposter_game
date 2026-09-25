import { useState } from 'react';
import type { FormEvent } from 'react';
import { useGameStore } from '../store/gameStore';
import { PlayerAvatar } from '../components/PlayerAvatar';
import { SUGGESTED_NAMES } from '../utils/gameLogic';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, UserPlus, Play, Trash2, Edit2, Check, AlertCircle, Shuffle, Lightbulb, EyeOff, Dices } from 'lucide-react';

export const Lobby = () => {
  const {
    players,
    addPlayer,
    removePlayer,
    updatePlayerName,
    populateDefaultPlayers,
    startNewGame,
    setPhase,
    settings,
    toggleImpostorHint,
    toggleRandomStartingPlayer,
    shuffleCurrentPlayers,
  } = useGameStore();
  const [newPlayerName, setNewPlayerName] = useState('');
  const [editingPlayerId, setEditingPlayerId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleAddPlayer = (e?: FormEvent) => {
    if (e) e.preventDefault();
    const trimmed = newPlayerName.trim();
    if (!trimmed) {
      // Pick random unused suggested name
      const unused = SUGGESTED_NAMES.find(n => !players.some(p => p.name.toLowerCase() === n.toLowerCase()));
      addPlayer(unused || `Player ${players.length + 1}`);
      setNewPlayerName('');
      return;
    }

    if (players.some(p => p.name.toLowerCase() === trimmed.toLowerCase())) {
      setErrorMsg(`Player named "${trimmed}" already in room!`);
      setTimeout(() => setErrorMsg(''), 2500);
      return;
    }

    addPlayer(trimmed);
    setNewPlayerName('');
    setErrorMsg('');
  };

  const handleQuickAdd = (name: string) => {
    if (players.some(p => p.name.toLowerCase() === name.toLowerCase())) return;
    addPlayer(name);
  };

  const startEdit = (id: string, currentName: string) => {
    setEditingPlayerId(id);
    setEditingName(currentName);
  };

  const saveEdit = (id: string) => {
    if (editingName.trim()) {
      updatePlayerName(id, editingName.trim());
    }
    setEditingPlayerId(null);
    setEditingName('');
  };

  const canStart = players.length >= 3 && players.length <= 12;

  // Unused suggestions
  const quickSuggestions = SUGGESTED_NAMES.filter(
    name => !players.some(p => p.name.toLowerCase() === name.toLowerCase())
  ).slice(0, 5);

  return (
    <div className="w-full max-w-xl mx-auto px-4 py-6 relative z-10">
      {/* Top Bar */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => setPhase('create-game')}
          className="flex items-center gap-2 py-2 px-3.5 rounded-xl glass-card text-slate-300 hover:text-white hover:border-purple-500/40 text-sm font-semibold transition-all active:scale-95"
        >
          <ArrowLeft size={18} />
          <span>Setup</span>
        </button>
        <span className="text-xs font-bold uppercase tracking-wider text-purple-400 bg-purple-500/10 px-3 py-1 rounded-full border border-purple-500/20">
          Room Lobby
        </span>
      </div>

      <div className="text-center mb-6">
        <h2 className="text-3xl font-black text-white tracking-wide">ROOM</h2>
        <p className="text-xs text-slate-400 mt-1">
          Add players who will share this device to play
        </p>
      </div>

      {/* Players Card */}
      <div className="glass-card p-5 rounded-3xl border border-white/10 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse" />
            <h3 className="text-base font-black text-white">Players</h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={shuffleCurrentPlayers}
              className="flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-xl bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 border border-purple-500/30 transition-all active:scale-95"
              title="Shuffle players order"
            >
              <Shuffle size={13} />
              <span>Shuffle</span>
            </button>
            <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-slate-800 text-purple-300 border border-white/5">
              {players.length} / 12 Joined
            </span>
          </div>
        </div>

        {/* Players List */}
        <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
          <AnimatePresence>
            {players.map((player, idx) => (
              <motion.div
                key={player.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="flex items-center justify-between p-3 rounded-2xl bg-slate-900/60 border border-white/5 hover:border-purple-500/30 transition-all"
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <span className="text-xs font-bold text-slate-500 w-4 text-center">
                    {idx + 1}
                  </span>
                  <PlayerAvatar name={player.name} color={player.color} avatar={player.avatar} size="sm" />
                  
                  {editingPlayerId === player.id ? (
                    <div className="flex items-center gap-2 flex-1 mr-2">
                      <input
                        type="text"
                        value={editingName}
                        onChange={(e) => setEditingName(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && saveEdit(player.id)}
                        autoFocus
                        className="glass-input px-2.5 py-1 text-sm rounded-lg flex-1 font-semibold text-white"
                        maxLength={18}
                      />
                      <button
                        onClick={() => saveEdit(player.id)}
                        className="p-1.5 rounded-lg bg-emerald-600 text-white hover:bg-emerald-500"
                      >
                        <Check size={14} />
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      <span className="text-sm font-bold text-slate-100 truncate">
                        {player.name}
                      </span>
                    </div>
                  )}
                </div>

                {/* Edit / Remove controls */}
                <div className="flex items-center gap-1">
                  {editingPlayerId !== player.id && (
                    <button
                      onClick={() => startEdit(player.id, player.name)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                      title="Edit Name"
                    >
                      <Edit2 size={14} />
                    </button>
                  )}
                  <button
                    onClick={() => removePlayer(player.id)}
                    disabled={players.length <= 3}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 disabled:opacity-20 disabled:hover:text-slate-400 transition-colors"
                    title={players.length <= 3 ? "Minimum 3 players required" : "Remove Player"}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Add Player Input Form */}
        <form onSubmit={handleAddPlayer} className="mt-4 pt-4 border-t border-white/5">
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Enter player name..."
              value={newPlayerName}
              onChange={(e) => setNewPlayerName(e.target.value)}
              maxLength={18}
              className="flex-1 glass-input px-4 py-2.5 rounded-xl text-sm font-medium text-white placeholder-slate-500"
            />
            <button
              type="submit"
              disabled={players.length >= 12}
              className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 disabled:opacity-40 text-white font-bold text-sm flex items-center gap-1.5 shadow-md shadow-purple-600/30 transition-all active:scale-95"
            >
              <UserPlus size={16} />
              <span>Add</span>
            </button>
          </div>

          {errorMsg && (
            <p className="text-xs text-rose-400 mt-2 flex items-center gap-1 font-medium">
              <AlertCircle size={13} /> {errorMsg}
            </p>
          )}

          {/* Quick Suggestions Chips */}
          {quickSuggestions.length > 0 && players.length < 12 && (
            <div className="mt-3 flex items-center gap-1.5 flex-wrap">
              <span className="text-[11px] text-slate-500 mr-1 flex items-center gap-1">
                <Shuffle size={11} /> Quick add:
              </span>
              {quickSuggestions.map((name) => (
                <button
                  key={name}
                  type="button"
                  onClick={() => handleQuickAdd(name)}
                  className="text-[11px] font-semibold px-2 py-0.5 rounded-lg bg-slate-800/80 hover:bg-purple-900/40 text-slate-300 hover:text-purple-300 border border-white/5 transition-all"
                >
                  + {name}
                </button>
              ))}
            </div>
          )}
        </form>
      </div>

      {/* Preset fast reset */}
      <div className="flex items-center justify-between text-xs text-slate-400 px-2 mb-6">
        <span>Min: 3 players, Max: 12 players</span>
        <button
          onClick={() => populateDefaultPlayers(4)}
          className="text-purple-400 hover:text-purple-300 font-semibold underline underline-offset-2"
        >
          Reset to default 4
        </button>
      </div>

      {/* Impostor Hint Enable/Hide Option Card */}
      <div className="glass-card p-4 rounded-3xl border border-white/10 mb-4 flex items-center justify-between shadow-lg">
        <div className="flex items-center gap-3">
          <div
            className={`w-11 h-11 rounded-2xl flex items-center justify-center font-bold text-lg border transition-all ${
              settings.showImpostorHint
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                : 'bg-rose-500/20 text-rose-300 border-rose-500/30'
            }`}
          >
            {settings.showImpostorHint ? <Lightbulb size={22} /> : <EyeOff size={22} />}
          </div>
          <div className="text-left">
            <div className="flex items-center gap-2">
              <h4 className="text-sm font-extrabold text-white">Impostor Hint</h4>
              <span
                className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${
                  settings.showImpostorHint
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                    : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                }`}
              >
                {settings.showImpostorHint ? 'Enabled 💡' : 'Hidden 🔒'}
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5 max-w-[240px] sm:max-w-xs">
              {settings.showImpostorHint
                ? 'Impostor sees category hint (e.g. "Food") to blend in'
                : 'Hardcore blind mode: Impostor receives 0 hints!'}
            </p>
          </div>
        </div>

        {/* Toggle Switch */}
        <button
          type="button"
          role="switch"
          aria-checked={settings.showImpostorHint}
          onClick={toggleImpostorHint}
          aria-label="Toggle Impostor Hint Option"
          className={`relative inline-flex h-8 w-14 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
            settings.showImpostorHint ? 'bg-amber-500 shadow-lg shadow-amber-500/30' : 'bg-slate-700'
          }`}
        >
          <span
            className={`pointer-events-none inline-block h-7 w-7 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out flex items-center justify-center text-xs font-black ${
              settings.showImpostorHint ? 'translate-x-6 text-amber-600' : 'translate-x-0 text-slate-500'
            }`}
          >
            {settings.showImpostorHint ? '✓' : '✕'}
          </span>
        </button>
      </div>

      {/* Random Starting Player Option Card */}
      <div className="glass-card p-4 rounded-3xl border border-white/10 mb-5 flex items-center justify-between shadow-lg">
        <div className="flex items-center gap-3">
          <div
            className={`w-11 h-11 rounded-2xl flex items-center justify-center font-bold text-lg border transition-all ${
              settings.randomStartingPlayer
                ? 'bg-purple-500/20 text-purple-300 border-purple-500/30'
                : 'bg-slate-800 text-slate-400 border-white/10'
            }`}
          >
            <Dices size={22} />
          </div>
          <div className="text-left">
            <div className="flex items-center gap-2">
              <h4 className="text-sm font-extrabold text-white">Random Starting Player</h4>
              <span
                className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${
                  settings.randomStartingPlayer
                    ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                    : 'bg-slate-800 text-slate-400 border border-white/10'
                }`}
              >
                {settings.randomStartingPlayer ? 'Random 🎲' : 'Fixed Order'}
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5 max-w-[240px] sm:max-w-xs">
              {settings.randomStartingPlayer
                ? 'Round begins with a randomly chosen player'
                : 'Round begins strictly in player order (Player 1 first)'}
            </p>
          </div>
        </div>

        {/* Toggle Switch */}
        <button
          type="button"
          role="switch"
          aria-checked={settings.randomStartingPlayer}
          onClick={toggleRandomStartingPlayer}
          aria-label="Toggle Random Starting Player"
          className={`relative inline-flex h-8 w-14 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
            settings.randomStartingPlayer ? 'bg-purple-600 shadow-lg shadow-purple-600/30' : 'bg-slate-700'
          }`}
        >
          <span
            className={`pointer-events-none inline-block h-7 w-7 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out flex items-center justify-center text-xs font-black ${
              settings.randomStartingPlayer ? 'translate-x-6 text-purple-600' : 'translate-x-0 text-slate-500'
            }`}
          >
            {settings.randomStartingPlayer ? '✓' : '✕'}
          </span>
        </button>
      </div>

      {/* Start Game Action Button */}
      <motion.div whileHover={{ scale: canStart ? 1.01 : 1 }} whileTap={{ scale: canStart ? 0.99 : 1 }}>
        <button
          onClick={startNewGame}
          disabled={!canStart}
          className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-indigo-600 hover:from-emerald-400 hover:to-teal-400 disabled:opacity-40 disabled:cursor-not-allowed text-white font-black text-lg tracking-wider shadow-xl shadow-emerald-500/25 transition-all border border-white/20 flex items-center justify-center gap-3"
        >
          <Play size={22} className="fill-white" />
          <span>START GAME</span>
        </button>
      </motion.div>
    </div>
  );
};
