/**
 * SUPER SIMON — Ultimate Memory Game
 * Classic Simon reinvented with modes, polish, and modern web tech.
 */

(() => {
  'use strict';

  // ========== CONFIG ==========
  const COLORS = ['green', 'red', 'yellow', 'blue'];
  const FREQS = { green: 329.63, red: 261.63, yellow: 220.00, blue: 164.81 }; // E4 C4 A3 E3
  const DIFFICULTY = {
    1: { startSpeed: 700, minSpeed: 400, speedStep: 15, name: 'Easy' },
    2: { startSpeed: 550, minSpeed: 280, speedStep: 20, name: 'Normal' },
    3: { startSpeed: 420, minSpeed: 180, speedStep: 25, name: 'Hard' },
    4: { startSpeed: 320, minSpeed: 120, speedStep: 30, name: 'Insane' },
  };

  // ========== STATE ==========
  const state = {
    mode: 'classic',
    difficulty: 2,
    sequence: [],
    playerIndex: 0,
    level: 0,
    score: 0,
    streak: 0,
    best: 0,
    isPlaying: false,
    isComputerTurn: false,
    isStrict: true,
    soundEnabled: true,
    volume: 0.7,
    particlesEnabled: true,
    vibrationEnabled: true,
    audioCtx: null,
  };

  // ========== DOM ==========
  const $ = (sel) => document.querySelector(sel);
  const $$ = (sel) => document.querySelectorAll(sel);

  const el = {
    level: $('#level'),
    score: $('#score'),
    best: $('#best'),
    streak: $('#streak'),
    modePanel: $('#mode-panel'),
    boardContainer: $('#board-container'),
    board: $('#board'),
    status: $('#status'),
    progress: $('#progress'),
    hubLevel: $('#hub-level'),
    gameover: $('#gameover'),
    settings: $('#settings'),
    pads: $$('.pad'),
    btnStart: $('#btn-start'),
    btnRestart: $('#btn-restart'),
    btnQuit: $('#btn-quit'),
    btnPlayAgain: $('#btn-play-again'),
    btnMenu: $('#btn-menu'),
    btnSound: $('#btn-sound'),
    btnSettings: $('#btn-settings'),
    btnCloseSettings: $('#btn-close-settings'),
    btnResetStats: $('#btn-reset-stats'),
    volSlider: $('#vol-slider'),
    chkStrict: $('#chk-strict'),
    chkParticles: $('#chk-particles'),
    chkVibration: $('#chk-vibration'),
    goEmoji: $('#go-emoji'),
    goTitle: $('#go-title'),
    goLevel: $('#go-level'),
    goScore: $('#go-score'),
    goBest: $('#go-best'),
    goMessage: $('#go-message'),
    iconSoundOn: $('#icon-sound-on'),
    iconSoundOff: $('#icon-sound-off'),
    canvas: $('#particles'),
  };

  // ========== AUDIO ==========
  function initAudio() {
    if (!state.audioCtx) {
      state.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (state.audioCtx.state === 'suspended') {
      state.audioCtx.resume();
    }
  }

  function playTone(color, duration = 0.3) {
    if (!state.soundEnabled || !state.audioCtx) return;
    const ctx = state.audioCtx;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.value = FREQS[color] || 300;
    gain.gain.setValueAtTime(state.volume * 0.35, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + duration);
  }

  function playError() {
    if (!state.soundEnabled || !state.audioCtx) return;
    const ctx = state.audioCtx;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.value = 110;
    gain.gain.setValueAtTime(state.volume * 0.25, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.5);
  }

  function playSuccess() {
    if (!state.soundEnabled || !state.audioCtx) return;
    const ctx = state.audioCtx;
    const notes = [523.25, 659.25, 783.99]; // C5 E5 G5
    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.value = freq;
      const t = ctx.currentTime + i * 0.1;
      gain.gain.setValueAtTime(0, t);
      gain.gain.linearRampToValueAtTime(state.volume * 0.2, t + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.3);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(t);
      osc.stop(t + 0.3);
    });
  }

  // ========== PARTICLES ==========
  const particles = [];
  const ctx2d = el.canvas.getContext('2d');

  function resizeCanvas() {
    el.canvas.width = window.innerWidth;
    el.canvas.height = window.innerHeight;
  }

  function spawnParticles(x, y, color, count = 18) {
    if (!state.particlesEnabled) return;
    const hex = { green: '#00e676', red: '#ff1744', yellow: '#ffea00', blue: '#2979ff' }[color] || '#a78bfa';
    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count + Math.random() * 0.5;
      const speed = 2 + Math.random() * 5;
      particles.push({
        x, y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 1,
        decay: 0.015 + Math.random() * 0.02,
        size: 3 + Math.random() * 4,
        color: hex,
      });
    }
  }

  function spawnConfetti() {
    if (!state.particlesEnabled) return;
    const colors = ['#00e676', '#ff1744', '#ffea00', '#2979ff', '#a78bfa', '#fff'];
    for (let i = 0; i < 80; i++) {
      particles.push({
        x: Math.random() * el.canvas.width,
        y: -20,
        vx: (Math.random() - 0.5) * 4,
        vy: 2 + Math.random() * 4,
        life: 1,
        decay: 0.005 + Math.random() * 0.008,
        size: 4 + Math.random() * 6,
        color: colors[Math.floor(Math.random() * colors.length)],
        rot: Math.random() * Math.PI,
        rotSpeed: (Math.random() - 0.5) * 0.2,
      });
    }
  }

  function animateParticles() {
    ctx2d.clearRect(0, 0, el.canvas.width, el.canvas.height);
    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.08;
      p.life -= p.decay;
      if (p.rot !== undefined) p.rot += p.rotSpeed;
      if (p.life <= 0) {
        particles.splice(i, 1);
        continue;
      }
      ctx2d.save();
      ctx2d.globalAlpha = p.life;
      ctx2d.fillStyle = p.color;
      ctx2d.translate(p.x, p.y);
      if (p.rot !== undefined) ctx2d.rotate(p.rot);
      ctx2d.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
      ctx2d.restore();
    }
    requestAnimationFrame(animateParticles);
  }

  // ========== STORAGE ==========
  function loadBest() {
    const key = `superSimon_best_${state.mode}_${state.difficulty}`;
    state.best = parseInt(localStorage.getItem(key) || '0', 10);
    el.best.textContent = state.best;
  }

  function saveBest() {
    if (state.score > state.best) {
      state.best = state.score;
      const key = `superSimon_best_${state.mode}_${state.difficulty}`;
      localStorage.setItem(key, state.best);
      el.best.textContent = state.best;
      return true;
    }
    return false;
  }

  // ========== UI HELPERS ==========
  function updateStats() {
    el.level.textContent = state.level;
    el.score.textContent = state.score;
    el.streak.textContent = state.streak;
    el.hubLevel.textContent = state.level || '—';
  }

  function setStatus(text, type = '') {
    el.status.textContent = text;
    el.status.className = 'status-text' + (type ? ` ${type}` : '');
  }

  function setProgress(current, total) {
    const pct = total === 0 ? 0 : (current / total) * 100;
    el.progress.style.width = `${pct}%`;
  }

  function lightPad(color, on) {
    const pad = $(`.pad[data-color="${color}"]`);
    if (pad) pad.classList.toggle('active', on);
  }

  function enablePads(enabled) {
    el.pads.forEach((p) => {
      p.disabled = !enabled;
    });
  }

  function vibrate(ms = 30) {
    if (state.vibrationEnabled && navigator.vibrate) {
      navigator.vibrate(ms);
    }
  }

  // ========== GAME LOGIC ==========
  function getSpeed() {
    const d = DIFFICULTY[state.difficulty];
    let speed = d.startSpeed - state.level * d.speedStep;
    if (state.mode === 'speed') {
      speed = Math.max(d.minSpeed - 40, speed - state.level * 10);
    }
    return Math.max(d.minSpeed, speed);
  }

  function nextColor() {
    return COLORS[Math.floor(Math.random() * COLORS.length)];
  }

  async function sleep(ms) {
    return new Promise((r) => setTimeout(r, ms));
  }

  async function playSequence() {
    state.isComputerTurn = true;
    enablePads(false);
    setStatus('Watch carefully...', 'computer');
    setProgress(0, state.sequence.length);

    const speed = getSpeed();
    const flash = Math.max(120, speed * 0.55);
    const gap = Math.max(80, speed * 0.35);

    await sleep(400);

    for (let i = 0; i < state.sequence.length; i++) {
      if (!state.isPlaying) return;
      const color = state.sequence[i];
      lightPad(color, true);
      playTone(color, flash / 1000);
      setProgress(i + 1, state.sequence.length);
      await sleep(flash);
      lightPad(color, false);
      await sleep(gap);
    }

    state.isComputerTurn = false;
    state.playerIndex = 0;
    setProgress(0, state.sequence.length);

    // For reverse mode, player must input backwards
    if (state.mode === 'reverse') {
      setStatus('Repeat it BACKWARDS!', 'player');
    } else {
      setStatus('Your turn!', 'player');
    }
    enablePads(true);
  }

  function getExpectedColor() {
    if (state.mode === 'reverse') {
      return state.sequence[state.sequence.length - 1 - state.playerIndex];
    }
    return state.sequence[state.playerIndex];
  }

  async function handlePadPress(color) {
    if (!state.isPlaying || state.isComputerTurn) return;

    const pad = $(`.pad[data-color="${color}"]`);
    const rect = pad.getBoundingClientRect();
    spawnParticles(rect.left + rect.width / 2, rect.top + rect.height / 2, color);

    lightPad(color, true);
    playTone(color, 0.2);
    vibrate(25);
    await sleep(120);
    lightPad(color, false);

    const expected = getExpectedColor();
    if (color === expected) {
      state.playerIndex++;
      setProgress(state.playerIndex, state.sequence.length);

      if (state.playerIndex >= state.sequence.length) {
        // Round complete
        enablePads(false);
        state.level++;
        state.score += state.level * 10 + state.streak * 2;
        state.streak++;
        updateStats();
        playSuccess();
        setStatus('Nice!', 'player');

        // Chaos mode: shuffle visual positions occasionally
        if (state.mode === 'chaos' && state.level % 3 === 0) {
          await sleep(300);
          await shufflePads();
        }

        await sleep(700);
        if (!state.isPlaying) return;
        state.sequence.push(nextColor());
        playSequence();
      }
    } else {
      // Mistake
      playError();
      vibrate([40, 40, 80]);
      setStatus('Wrong!', 'error');
      enablePads(false);
      state.streak = 0;
      updateStats();

      if (state.isStrict) {
        await sleep(800);
        endGame(false);
      } else {
        // Lenient: replay sequence
        await sleep(800);
        if (!state.isPlaying) return;
        playSequence();
      }
    }
  }

  async function shufflePads() {
    setStatus('Chaos shuffle!', 'computer');
    const board = el.board;
    board.style.transition = 'transform 0.5s cubic-bezier(0.4,0,0.2,1)';
    board.style.transform = 'rotate(90deg) scale(0.9)';
    await sleep(500);
    // Actually just visual flair — colors stay mapped for fairness
    board.style.transform = 'rotate(0deg) scale(1)';
    await sleep(400);
    board.style.transition = '';
  }

  function startGame() {
    initAudio();
    state.isPlaying = true;
    state.sequence = [nextColor()];
    state.playerIndex = 0;
    state.level = 0;
    state.score = 0;
    state.streak = 0;
    updateStats();
    loadBest();

    el.modePanel.classList.add('hidden');
    el.boardContainer.classList.remove('hidden');
    el.gameover.classList.add('hidden');

    playSequence();
  }

  function endGame(won = false) {
    state.isPlaying = false;
    enablePads(false);
    const newRecord = saveBest();

    if (won || state.level >= 20) {
      el.goEmoji.textContent = '🏆';
      el.goTitle.textContent = 'Legendary!';
      el.goMessage.innerHTML = `You crushed level <strong>${state.level}</strong>!`;
      spawnConfetti();
    } else if (newRecord) {
      el.goEmoji.textContent = '🌟';
      el.goTitle.textContent = 'New Record!';
      el.goMessage.innerHTML = `Level <strong>${state.level}</strong> — personal best!`;
      spawnConfetti();
    } else {
      el.goEmoji.textContent = '💥';
      el.goTitle.textContent = 'Game Over';
      el.goMessage.innerHTML = `You reached level <strong>${state.level}</strong>`;
    }

    el.goLevel.textContent = state.level;
    el.goScore.textContent = state.score;
    el.goBest.textContent = state.best;
    el.gameover.classList.remove('hidden');
  }

  function quitToMenu() {
    state.isPlaying = false;
    enablePads(false);
    el.boardContainer.classList.add('hidden');
    el.gameover.classList.add('hidden');
    el.modePanel.classList.remove('hidden');
    setProgress(0, 1);
    state.level = 0;
    state.score = 0;
    state.streak = 0;
    updateStats();
    loadBest();
  }

  // ========== EVENT LISTENERS ==========
  // Mode selection
  $$('.mode-card').forEach((card) => {
    card.addEventListener('click', () => {
      $$('.mode-card').forEach((c) => c.classList.remove('active'));
      card.classList.add('active');
      state.mode = card.dataset.mode;
      loadBest();
    });
  });

  // Difficulty
  $$('.diff-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      $$('.diff-btn').forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      state.difficulty = parseInt(btn.dataset.diff, 10);
      loadBest();
    });
  });

  // Pads
  el.pads.forEach((pad) => {
    const color = pad.dataset.color;
    const handler = (e) => {
      e.preventDefault();
      handlePadPress(color);
    };
    pad.addEventListener('click', handler);
    pad.addEventListener('touchstart', (e) => {
      e.preventDefault();
      handlePadPress(color);
    }, { passive: false });
  });

  // Buttons
  el.btnStart.addEventListener('click', startGame);
  el.btnRestart.addEventListener('click', () => {
    el.gameover.classList.add('hidden');
    startGame();
  });
  el.btnQuit.addEventListener('click', quitToMenu);
  el.btnPlayAgain.addEventListener('click', () => {
    el.gameover.classList.add('hidden');
    startGame();
  });
  el.btnMenu.addEventListener('click', quitToMenu);

  // Sound toggle
  el.btnSound.addEventListener('click', () => {
    state.soundEnabled = !state.soundEnabled;
    el.iconSoundOn.classList.toggle('hidden', !state.soundEnabled);
    el.iconSoundOff.classList.toggle('hidden', state.soundEnabled);
    if (state.soundEnabled) initAudio();
  });

  // Settings
  el.btnSettings.addEventListener('click', () => {
    el.settings.classList.remove('hidden');
  });
  el.btnCloseSettings.addEventListener('click', () => {
    el.settings.classList.add('hidden');
  });
  el.volSlider.addEventListener('input', (e) => {
    state.volume = e.target.value / 100;
  });
  el.chkStrict.addEventListener('change', (e) => {
    state.isStrict = e.target.checked;
  });
  el.chkParticles.addEventListener('change', (e) => {
    state.particlesEnabled = e.target.checked;
  });
  el.chkVibration.addEventListener('change', (e) => {
    state.vibrationEnabled = e.target.checked;
  });
  el.btnResetStats.addEventListener('click', () => {
    if (confirm('Reset all high scores?')) {
      Object.keys(localStorage)
        .filter((k) => k.startsWith('superSimon_best_'))
        .forEach((k) => localStorage.removeItem(k));
      state.best = 0;
      el.best.textContent = '0';
    }
  });

  // Keyboard
  document.addEventListener('keydown', (e) => {
    if (e.code === 'Space' && !state.isPlaying && !el.settings.classList.contains('hidden') === false) {
      // only start if mode panel visible
      if (!el.modePanel.classList.contains('hidden')) {
        e.preventDefault();
        startGame();
      }
    }
    if (!state.isPlaying || state.isComputerTurn) return;
    const map = {
      '1': 'green', 'Digit1': 'green', 'ArrowUp': 'green',
      '2': 'red', 'Digit2': 'red', 'ArrowRight': 'red',
      '3': 'yellow', 'Digit3': 'yellow', 'ArrowLeft': 'yellow',
      '4': 'blue', 'Digit4': 'blue', 'ArrowDown': 'blue',
    };
    const color = map[e.code] || map[e.key];
    if (color) {
      e.preventDefault();
      handlePadPress(color);
    }
  });

  // Close settings on backdrop click
  el.settings.addEventListener('click', (e) => {
    if (e.target === el.settings) el.settings.classList.add('hidden');
  });

  // ========== INIT ==========
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);
  animateParticles();
  loadBest();
  updateStats();
  enablePads(false);

  // Prevent double-tap zoom on iOS
  let lastTouch = 0;
  document.addEventListener('touchend', (e) => {
    const now = Date.now();
    if (now - lastTouch <= 300) e.preventDefault();
    lastTouch = now;
  }, { passive: false });

  console.log('%c◆ SUPER SIMON ready', 'color:#a78bfa;font-weight:bold;font-size:14px');
})();
