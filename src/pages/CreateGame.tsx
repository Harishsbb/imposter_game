import { useGameStore } from '../store/gameStore';
import { CATEGORIES, CATEGORY_EMOJIS } from '../data/words';
import { motion } from 'framer-motion';
import { ArrowLeft, Users, Check, Sparkles, Timer, Lightbulb, EyeOff, ShieldCheck, Dices } from 'lucide-react';

export const CreateGame = () => {
  const { settings, updateSettings, setPhase } = useGameStore();

  const handlePlayerCountChange = (count: number) => {
    const clamped = Math.max(3, Math.min(12, count));
    updateSettings({ playerCount: clamped });
  };

  const toggleCategory = (category: string) => {
    let current = [...settings.selectedCategories];

    if (category === 'All') {
      updateSettings({ selectedCategories: ['All'] });
      return;
    }

    if (current.includes('All')) {
      updateSettings({ selectedCategories: [category] });
      return;
    }

    if (current.includes(category)) {
      current = current.filter(c => c !== category);
      if (current.length === 0) {
        current = ['All'];
      }
    } else {
      current.push(category);
      if (current.length === CATEGORIES.length) {
        current = ['All'];
      }
    }

    updateSettings({ selectedCategories: current });
  };

  const isCategorySelected = (cat: string) => {
    if (cat === 'All') return settings.selectedCategories.includes('All');
    return settings.selectedCategories.includes('All') || settings.selectedCategories.includes(cat);
  };

  return (
    <div className="w-full max-w-xl mx-auto px-4 py-4 md:py-6 relative z-10 flex-1 flex flex-col justify-between">
      {/* Top Header */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <button
            onClick={() => setPhase('home')}
            className="flex items-center gap-1.5 py-1.5 px-3 rounded-xl glass-card text-slate-300 hover:text-white hover:border-purple-500/40 text-xs font-semibold transition-all active:scale-95"
          >
            <ArrowLeft size={16} />
            <span>Home</span>
          </button>
          <span className="text-[11px] font-bold uppercase tracking-wider text-purple-400 bg-purple-500/10 px-3 py-1 rounded-full border border-purple-500/20">
            Step 1 of 2
          </span>
        </div>

        <div className="text-center mb-4">
          <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight">Game Setup</h2>
          <p className="text-xs text-slate-400 mt-0.5">Customize players, themes & rules</p>
        </div>
      </div>

      {/* Main Settings Cards */}
      <div className="space-y-3.5 my-auto">
        {/* Player Count Card */}
        <div className="glass-card p-4 rounded-2xl border border-white/10">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-purple-500/20 text-purple-300 flex items-center justify-center">
                <Users size={16} />
              </div>
              <div>
                <h3 className="text-xs font-bold text-white">Player Count</h3>
                <p className="text-[10px] text-slate-400">3 to 12 players</p>
              </div>
            </div>
            <div className="text-xl font-black text-purple-300 px-3 py-0.5 rounded-xl bg-purple-500/20 border border-purple-500/30">
              {settings.playerCount}
            </div>
          </div>

          {/* Stepper & Slider */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => handlePlayerCountChange(settings.playerCount - 1)}
              disabled={settings.playerCount <= 3}
              className="w-10 h-10 rounded-xl bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-700 text-white font-bold text-lg flex items-center justify-center border border-white/10 active:scale-95 transition-all"
            >
              -
            </button>

            <input
              type="range"
              min="3"
              max="12"
              value={settings.playerCount}
              onChange={(e) => handlePlayerCountChange(parseInt(e.target.value, 10))}
              className="flex-1 accent-purple-500 h-2 bg-slate-800 rounded-lg cursor-pointer"
            />

            <button
              onClick={() => handlePlayerCountChange(settings.playerCount + 1)}
              disabled={settings.playerCount >= 12}
              className="w-10 h-10 rounded-xl bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-700 text-white font-bold text-lg flex items-center justify-center border border-white/10 active:scale-95 transition-all"
            >
              +
            </button>
          </div>
        </div>

        {/* Categories Selection */}
        <div className="glass-card p-4 rounded-2xl border border-white/10">
          <div className="flex items-center justify-between mb-2.5">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-cyan-500/20 text-cyan-300 flex items-center justify-center">
                <Sparkles size={15} />
              </div>
              <div>
                <h3 className="text-xs font-bold text-white">Word Topics</h3>
                <p className="text-[10px] text-slate-400">Select categories</p>
              </div>
            </div>

            <button
              onClick={() => toggleCategory('All')}
              className={`text-xs px-2.5 py-1 rounded-lg font-bold transition-all ${
                settings.selectedCategories.includes('All')
                  ? 'bg-purple-600 text-white shadow-sm shadow-purple-500/40'
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              All Topics
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 max-h-48 overflow-y-auto pr-1">
            {CATEGORIES.map((cat) => {
              const selected = isCategorySelected(cat);
              const isOnlyAll = settings.selectedCategories.includes('All');

              return (
                <button
                  key={cat}
                  onClick={() => toggleCategory(cat)}
                  className={`flex items-center justify-between px-2.5 py-2 rounded-xl border text-left text-xs font-semibold transition-all ${
                    selected
                      ? 'bg-purple-950/40 border-purple-500/50 text-white shadow-sm'
                      : 'bg-slate-900/50 border-white/5 text-slate-400 hover:border-white/20'
                  }`}
                >
                  <span className="flex items-center gap-1.5 truncate">
                    <span>{CATEGORY_EMOJIS[cat] || '✨'}</span>
                    <span className="truncate">{cat}</span>
                  </span>
                  {selected && (
                    <Check
                      size={13}
                      className={isOnlyAll ? 'text-purple-400 opacity-60' : 'text-purple-400'}
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Impostor Hint Setting Card (Clean, Pixel-Perfect Toggle) */}
        <div className="glass-card p-3.5 rounded-2xl border border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div
              className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-base border transition-all ${
                settings.showImpostorHint
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                  : 'bg-rose-500/20 text-rose-300 border-rose-500/30'
              }`}
            >
              {settings.showImpostorHint ? <Lightbulb size={18} /> : <EyeOff size={18} />}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-xs font-bold text-white">Impostor Category Hint</h4>
                <span
                  className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full ${
                    settings.showImpostorHint
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                  }`}
                >
                  {settings.showImpostorHint ? 'Enabled 💡' : 'Hidden 🔒'}
                </span>
              </div>
              <p className="text-[10px] text-slate-400 mt-0.5">
                {settings.showImpostorHint
                  ? 'Impostor sees category (e.g. "Food")'
                  : 'Blind mode: Impostor receives 0 hints'}
              </p>
            </div>
          </div>

          {/* Pixel-Perfect Switch */}
          <button
            type="button"
            role="switch"
            aria-checked={settings.showImpostorHint}
            onClick={() => updateSettings({ showImpostorHint: !settings.showImpostorHint })}
            className={`relative inline-flex h-7 w-12 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
              settings.showImpostorHint ? 'bg-amber-500 shadow-md shadow-amber-500/30' : 'bg-slate-700'
            }`}
          >
            <span
              className={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out flex items-center justify-center text-[10px] font-black ${
                settings.showImpostorHint ? 'translate-x-5 text-amber-600' : 'translate-x-0 text-slate-500'
              }`}
            >
              {settings.showImpostorHint ? '✓' : '✕'}
            </span>
          </button>
        </div>

        {/* Random Starting Player Setting Card */}
        <div className="glass-card p-3.5 rounded-2xl border border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div
              className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-base border transition-all ${
                settings.randomStartingPlayer
                  ? 'bg-purple-500/20 text-purple-300 border-purple-500/30'
                  : 'bg-slate-800 text-slate-400 border-white/10'
              }`}
            >
              <Dices size={18} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-xs font-bold text-white">Random Starting Player</h4>
                <span
                  className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full ${
                    settings.randomStartingPlayer
                      ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                      : 'bg-slate-800 text-slate-400 border border-white/10'
                  }`}
                >
                  {settings.randomStartingPlayer ? 'Random 🎲' : 'Fixed Order'}
                </span>
              </div>
              <p className="text-[10px] text-slate-400 mt-0.5">
                {settings.randomStartingPlayer
                  ? 'Game and clues start with a randomly chosen player'
                  : 'Game starts in lobby player order (Player 1 first)'}
              </p>
            </div>
          </div>

          {/* Pixel-Perfect Switch */}
          <button
            type="button"
            role="switch"
            aria-checked={settings.randomStartingPlayer}
            onClick={() => updateSettings({ randomStartingPlayer: !settings.randomStartingPlayer })}
            className={`relative inline-flex h-7 w-12 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
              settings.randomStartingPlayer ? 'bg-purple-600 shadow-md shadow-purple-600/30' : 'bg-slate-700'
            }`}
          >
            <span
              className={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out flex items-center justify-center text-[10px] font-black ${
                settings.randomStartingPlayer ? 'translate-x-5 text-purple-600' : 'translate-x-0 text-slate-500'
              }`}
            >
              {settings.randomStartingPlayer ? '✓' : '✕'}
            </span>
          </button>
        </div>

        {/* Discussion Timer Setting */}
        <div className="glass-card p-3.5 rounded-2xl border border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-purple-500/20 text-purple-300 flex items-center justify-center">
              <Timer size={16} />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white">Discussion Timer</h4>
              <p className="text-[10px] text-slate-400">Debate duration</p>
            </div>
          </div>

          <div className="flex gap-1.5">
            {[45, 60, 90, 120].map((seconds) => (
              <button
                key={seconds}
                onClick={() => updateSettings({ discussionTimerSeconds: seconds })}
                className={`text-xs px-2.5 py-1 rounded-lg font-bold transition-all ${
                  settings.discussionTimerSeconds === seconds
                    ? 'bg-purple-600 text-white font-black shadow-md shadow-purple-600/30'
                    : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                {seconds}s
              </button>
            ))}
          </div>
        </div>

        {/* Compact Mode & Difficulty Strip */}
        <div className="flex items-center justify-between px-3 py-2 rounded-xl bg-slate-900/60 border border-white/5 text-[11px] text-slate-400">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span>Difficulty: <strong className="text-white">Easy</strong></span>
          </div>
          <div className="flex items-center gap-1.5">
            <ShieldCheck size={13} className="text-purple-400" />
            <span>Mode: <strong className="text-white">Classic (1 Impostor)</strong></span>
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }} className="mt-4">
        <button
          onClick={() => setPhase('lobby')}
          className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-purple-600 via-indigo-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-extrabold text-base tracking-wide shadow-xl shadow-purple-600/30 transition-all border border-white/20 flex items-center justify-center gap-2 active:scale-95"
        >
          <span>NEXT: ADD PLAYERS ({settings.playerCount})</span>
        </button>
      </motion.div>
    </div>
  );
};
