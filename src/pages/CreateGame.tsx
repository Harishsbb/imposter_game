import { useGameStore } from '../store/gameStore';
import { CATEGORIES, CATEGORY_EMOJIS } from '../data/words';
import { motion } from 'framer-motion';
import { ArrowLeft, Users, Check, Sparkles, Timer, Lightbulb, EyeOff } from 'lucide-react';

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

    // If 'All' was selected, unselect it and keep the clicked one
    if (current.includes('All')) {
      updateSettings({ selectedCategories: [category] });
      return;
    }

    if (current.includes(category)) {
      current = current.filter(c => c !== category);
      // If nothing selected, revert to 'All'
      if (current.length === 0) {
        current = ['All'];
      }
    } else {
      current.push(category);
      // If all individual categories selected, normalize to 'All'
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
    <div className="w-full max-w-xl mx-auto px-4 py-6 relative z-10">
      {/* Top Header */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => setPhase('home')}
          className="flex items-center gap-2 py-2 px-3.5 rounded-xl glass-card text-slate-300 hover:text-white hover:border-purple-500/40 text-sm font-semibold transition-all active:scale-95"
        >
          <ArrowLeft size={18} />
          <span>Home</span>
        </button>
        <span className="text-xs font-bold uppercase tracking-wider text-purple-400 bg-purple-500/10 px-3 py-1 rounded-full border border-purple-500/20">
          Step 1 of 2
        </span>
      </div>

      <div className="text-center mb-6">
        <h2 className="text-3xl font-black text-white mb-1">Game Setup</h2>
        <p className="text-xs text-slate-400">Configure players, themes, and game rules</p>
      </div>

      <div className="space-y-6">
        {/* Player Count Card */}
        <div className="glass-card p-5 rounded-2xl border border-white/10">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-purple-500/20 text-purple-300 flex items-center justify-center">
                <Users size={18} />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Player Count</h3>
                <p className="text-[11px] text-slate-400">Recommended: 4–8 players</p>
              </div>
            </div>
            <div className="text-2xl font-black text-purple-300 px-3 py-1 rounded-xl bg-purple-500/20 border border-purple-500/30">
              {settings.playerCount}
            </div>
          </div>

          {/* Stepper & Slider */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => handlePlayerCountChange(settings.playerCount - 1)}
              disabled={settings.playerCount <= 3}
              className="w-12 h-12 rounded-xl bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-700 text-white font-bold text-xl flex items-center justify-center border border-white/10 active:scale-95 transition-all"
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
              className="w-12 h-12 rounded-xl bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-700 text-white font-bold text-xl flex items-center justify-center border border-white/10 active:scale-95 transition-all"
            >
              +
            </button>
          </div>

          <div className="flex justify-between text-[11px] text-slate-500 mt-2 px-1">
            <span>Min: 3</span>
            <span>Max: 12</span>
          </div>
        </div>

        {/* Categories Selection */}
        <div className="glass-card p-5 rounded-2xl border border-white/10">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-cyan-500/20 text-cyan-300 flex items-center justify-center">
                <Sparkles size={18} />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Word Categories</h3>
                <p className="text-[11px] text-slate-400">Choose your favorite topics</p>
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

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-1 max-h-56 overflow-y-auto pr-1">
            {CATEGORIES.map((cat) => {
              const selected = isCategorySelected(cat);
              const isOnlyAll = settings.selectedCategories.includes('All');

              return (
                <button
                  key={cat}
                  onClick={() => toggleCategory(cat)}
                  className={`flex items-center justify-between p-2.5 rounded-xl border text-left text-xs font-semibold transition-all ${
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
                      size={14}
                      className={isOnlyAll ? 'text-purple-400 opacity-60' : 'text-purple-400'}
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Game Mode & Difficulty (as required) */}
        <div className="grid grid-cols-2 gap-3">
          <div className="glass-card p-3.5 rounded-2xl border border-white/10">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
              Difficulty
            </span>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="font-extrabold text-white text-sm">Easy</span>
            </div>
            <p className="text-[10px] text-slate-400 mt-1">Simple words for fun parties</p>
          </div>

          <div className="glass-card p-3.5 rounded-2xl border border-white/10">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
              Game Mode
            </span>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-purple-400 animate-pulse" />
              <span className="font-extrabold text-white text-sm">Classic</span>
            </div>
            <p className="text-[10px] text-slate-400 mt-1">1 Secret Impostor</p>
          </div>
        </div>

        {/* Discussion Timer Setting */}
        <div className="glass-card p-4 rounded-2xl border border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-300 flex items-center justify-center">
              <Timer size={18} />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white">Discussion Timer</h4>
              <p className="text-[10px] text-slate-400">Time to debate clues</p>
            </div>
          </div>

          <div className="flex gap-1.5">
            {[45, 60, 90, 120].map((seconds) => (
              <button
                key={seconds}
                onClick={() => updateSettings({ discussionTimerSeconds: seconds })}
                className={`text-xs px-2.5 py-1.5 rounded-lg font-bold transition-all ${
                  settings.discussionTimerSeconds === seconds
                    ? 'bg-amber-500 text-slate-950 font-black shadow-md shadow-amber-500/30'
                    : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                {seconds}s
              </button>
            ))}
          </div>
        </div>

        {/* Impostor Hint Toggle Setting */}
        <div className="glass-card p-4 rounded-2xl border border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
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
                  className={`text-[9px] font-black uppercase px-1.5 py-0.5 rounded-full ${
                    settings.showImpostorHint
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                  }`}
                >
                  {settings.showImpostorHint ? 'Enabled 💡' : 'Hidden 🔒'}
                </span>
              </div>
              <p className="text-[10px] text-slate-400">
                {settings.showImpostorHint
                  ? 'Impostor sees category (e.g. "Food")'
                  : 'Blind mode: Impostor receives 0 hints'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => updateSettings({ showImpostorHint: !settings.showImpostorHint })}
            aria-label="Toggle Impostor Hint"
            className={`relative w-13 h-7 rounded-full transition-colors p-0.5 border flex items-center cursor-pointer ${
              settings.showImpostorHint
                ? 'bg-amber-500/30 border-amber-400/80 shadow-md shadow-amber-500/20'
                : 'bg-slate-800 border-white/10'
            }`}
          >
            <motion.div
              animate={{ x: settings.showImpostorHint ? 22 : 0 }}
              transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] shadow-md ${
                settings.showImpostorHint
                  ? 'bg-amber-400 text-slate-950 font-black'
                  : 'bg-slate-600 text-slate-300'
              }`}
            >
              {settings.showImpostorHint ? '✓' : '✕'}
            </motion.div>
          </button>
        </div>

        {/* Submit to Lobby */}
        <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
          <button
            onClick={() => setPhase('lobby')}
            className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-purple-600 via-indigo-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-extrabold text-base tracking-wide shadow-xl shadow-purple-600/30 transition-all border border-white/20 flex items-center justify-center gap-2"
          >
            <span>NEXT: ADD PLAYERS ({settings.playerCount})</span>
          </button>
        </motion.div>
      </div>
    </div>
  );
};
