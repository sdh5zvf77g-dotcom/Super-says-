# ◆ SUPER SIMON

**The classic memory game, reinvented — 100× better.**

A modern, buttery-smooth browser version of Simon with multiple game modes, progressive difficulty, particle effects, Web Audio synthesis, local high scores, and a neon aesthetic that feels like it belongs in 2026.

![Super Simon](https://img.shields.io/badge/status-ready-brightgreen) ![License](https://img.shields.io/badge/license-MIT-blue) ![No build](https://img.shields.io/badge/build-none%20required-orange)

---

## ✨ Features that make it 100× better

| Feature | Classic Simon | Super Simon |
|---------|---------------|-------------|
| Game modes | 1 | **4** (Classic · Reverse · Speed · Chaos) |
| Difficulty levels | 4 fixed | **4 dynamic** with adaptive speed |
| Visual feedback | Basic lights | Neon glow + particle bursts + progress bar |
| Audio | Fixed beeps | Web Audio API synthesized tones + success/error chords |
| High scores | None | Per-mode & per-difficulty local storage |
| Input | Buttons only | Touch · Click · Keyboard (1-4 / arrows) · Haptics |
| Strict / Lenient | One mode | Toggleable Strict Mode |
| Polish | — | Confetti on records, glassmorphic UI, responsive, offline-ready |

### Game Modes

- **🎯 Classic** — Repeat the growing sequence. Pure nostalgia, perfected.
- **🔄 Reverse** — Watch the sequence, then play it *backwards*. Brain-melting.
- **⚡ Speed** — Sequence accelerates harder and faster every round.
- **🌀 Chaos** — Occasional visual shuffles keep you honest.

### Difficulty

- **Easy** — Generous timing, good for warm-ups.
- **Normal** — Balanced challenge.
- **Hard** — Quick flashes, serious memory required.
- **Insane** — For the masochists and memory athletes.

---

## 🚀 Quick Start

No build step. No dependencies. Just open it.

```bash
git clone https://github.com/YOUR_USERNAME/super-simon.git
cd super-simon
# Open index.html in any modern browser
# Or serve it:
npx serve .
```

### Deploy to GitHub Pages in 30 seconds

1. Push this repo to GitHub.
2. Go to **Settings → Pages**.
3. Source: **Deploy from a branch** → `main` / `/ (root)`.
4. Done. Your game is live at `https://YOUR_USERNAME.github.io/super-simon/`.

---

## 🎮 How to Play

1. Pick a **mode** and **difficulty**.
2. Hit **START GAME** (or press `Space`).
3. Watch the sequence of glowing pads.
4. Repeat it (or reverse it, depending on mode).
5. Survive as long as you can. Beat your high score.

**Keyboard shortcuts**

| Key | Action |
|-----|--------|
| `Space` | Start game |
| `1` / `↑` | Green |
| `2` / `→` | Red |
| `3` / `←` | Yellow |
| `4` / `↓` | Blue |

---

## 🛠 Tech Stack

- **HTML5** — Semantic, accessible structure
- **CSS3** — Custom properties, grid, glassmorphism, smooth transitions
- **Vanilla JS (ES6+)** — Zero dependencies, finite-state game loop
- **Web Audio API** — Real-time tone synthesis (no audio files)
- **Canvas** — Lightweight particle & confetti system
- **localStorage** — Persistent high scores per mode/difficulty

Works offline. Installable as a PWA-friendly static site.

---

## 📁 Project Structure

```
super-simon/
├── index.html    # Markup & structure
├── style.css     # All styles (neon theme, responsive)
├── script.js     # Game engine, audio, particles, state
└── README.md     # You are here
```

---

## ⚙️ Settings

- Master volume slider
- Strict Mode (mistake = game over) vs lenient replay
- Particle effects toggle
- Haptic feedback toggle
- Reset all high scores

---

## 🧠 Why this exists

The original Simon is a masterpiece of simple design. Super Simon keeps that pure loop and layers modern game-feel on top: satisfying lights, spatial audio cues, particle celebration, adaptive pacing, and modes that actually change how your brain works.

Built as a single-folder, zero-dependency web app so anyone can fork it, host it, or learn from the code in under 10 minutes.

---

## 📜 License

MIT — do whatever you want. Credit is nice but not required.

---

**Made for memory athletes, casual players, and anyone who still hears those four tones in their dreams.**

◆ Play. Improve. Dominate.
