# imposter_game

> **IMPOSTOR** — The ultimate local multiplayer party game. Can you find the liar among your friends? 🕵️

A sleek, modern, mobile-first pass-and-play social deduction word game built with **React, TypeScript, Vite, Tailwind CSS, Zustand, Framer Motion, and Lucide React**.

---

## 🎮 Features

- **100% Frontend-Only**: No backend, database, or socket server required. Powered entirely by local **Zustand** state.
- **Pass-and-Play Multiplayer**: Supports **3 to 12 players** on a single device with a privacy curtain.
- **200 Simple & Easy Words**: Curated across 12 fun categories with matching emojis and related hints.
- **Party Game UI**: Cyber neon dark mode with glassmorphism, floating ambient glow orbs, and smooth micro-interactions.
- **Web Audio Sound Effects**: Zero-dependency procedural sound synthesizers for clicks, mystery reveals, and victory fanfares.
- **Vercel Ready**: Preconfigured with `vercel.json` for seamless SPA routing.

---

## 🚀 Game Flow

```text
Home ──► Create Game ──► Lobby ──► Secret Role Reveal ──► Clue Phase
                                                               │
                                                               ▼
Winner ◄── Final Guess ◄── Reveal Impostor ◄── Voting ◄── Discussion
```

1. **Secret Role Reveal**: Each player gets the device and privately views their role. Citizens get the secret word; the Impostor only sees `"YOU ARE THE IMPOSTOR"`.
2. **Clue Phase**: Players take turns entering a 1-word or short clue without giving the word completely away.
3. **Discussion Phase**: All clues are displayed together on a party review board with an animated countdown timer.
4. **Secret Voting**: Each player secretly casts their ballot for who they suspect.
5. **Reveal Impostor**: The player with the most votes is eliminated!
6. **Final Guess**: If caught, the Impostor gets ONE LAST CHANCE to guess the secret word.
   - Guess correctly → **Impostor Wins!**
   - Guess incorrectly → **Citizens Win!**
7. **Winner & Play Again**: Celebration fanfare, confetti, full role recap table, and instant rematch.

---

## 🛠️ Tech Stack

- **Framework**: [React 19](https://react.dev/) + [Vite](https://vite.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **State Management**: [Zustand](https://zustand.docs.pmnd.rs/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Effects**: [canvas-confetti](https://www.npmjs.com/package/canvas-confetti)
- **Audio**: Web Audio API Synthesizer

---

## 📦 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn or pnpm

### Installation

```bash
# Clone the repository
git clone https://github.com/Harishsbb/imposter_game.git

# Navigate to the folder
cd imposter_game

# Install dependencies
npm install

# Start development server
npm run dev
```

Open `http://localhost:5173` in your browser.

### Production Build

```bash
npm run build
npm run preview
```

---

## ☁️ Deploy to Vercel

1. Push this repository to GitHub:
   ```bash
   git branch -M main
   git remote add origin https://github.com/Harishsbb/imposter_game.git
   git push -u origin main
   ```
2. Go to [Vercel](https://vercel.com) and click **"Add New Project"**.
3. Import your `imposter_game` repository.
4. Framework Preset will automatically detect **Vite**.
5. Click **Deploy**! 🚀
