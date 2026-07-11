import React, { useEffect, useRef, useState } from "react";
import { useAudio } from "../context/AudioContext";
import "./styles/TechSnake.css";

interface TechSnakeProps {
  onClose: () => void;
}

interface Point {
  x: number;
  y: number;
}

interface GoldenCommit {
  x: number;
  y: number;
  color: string;
  points: number;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
  alpha: number;
  decay: number;
  trail?: boolean;
}

interface Ripple {
  x: number;
  y: number;
  color: string;
  radius: number;
  maxRadius: number;
  alpha: number;
}

type Direction = "up" | "down" | "left" | "right";
type GameStatus = "menu" | "playing" | "paused" | "gameover";

interface LevelConfig {
  level: number;
  speed: number; // millisecond tick interval
  multiplier: number;
  description: string;
  name: string;
}

const LEVEL_CONFIGS: LevelConfig[] = [
  { level: 1, speed: 160, multiplier: 1.0, name: "Intern", description: "Lightly populated board. Standard speed. No merge conflicts." },
  { level: 2, speed: 130, multiplier: 1.5, name: "Junior Dev", description: "Denser contribution grid. Faster commits required." },
  { level: 3, speed: 105, multiplier: 2.0, name: "Senior Dev", description: "Watch out! Corner Merge Conflicts (red cells) blocking paths." },
  { level: 4, speed: 85, multiplier: 2.5, name: "Tech Lead", description: "Symmetric Merge Conflict lines. High pressure deployment." },
  { level: 5, speed: 65, multiplier: 3.0, name: "CTO", description: "Extreme maze of conflicts and blistering speed. Good luck." },
];

const GITHUB_COLORS = {
  level0: "#161b22", // dark empty square
  level1: "#0e4429", // dark green
  level2: "#006d32", // medium green
  level3: "#26a641", // light green
  level4: "#39d353", // bright neon green
  obstacle: "#f85149", // bright github red
  golden: "#f1fa8c", // neon yellow/gold
};

// Returns Dev Rank title based on score
const getDevRank = (score: number): string => {
  if (score < 1000) return "Junior Committer 👶";
  if (score < 2500) return "Feature Engineer 💻";
  if (score < 5000) return "Merge Master 🔀";
  if (score < 8000) return "System Architect 👑";
  return "10x Code God 🔥";
};

const TechSnake: React.FC<TechSnakeProps> = ({ onClose }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const { isPlaying: musicPlaying } = useAudio();
  const [status, setStatus] = useState<GameStatus>("menu");
  const [selectedLevel, setSelectedLevel] = useState<number>(1);
  const [score, setScore] = useState(0);
  const [commits, setCommits] = useState(0);
  const [highScore, setHighScore] = useState(0);

  // Combo systems React states
  const [combo, setCombo] = useState(1);
  const [comboProgress, setComboProgress] = useState(0); // 0 to 100 representation of combo timer
  const [isTurboActive, setIsTurboActive] = useState(false);

  // GitHub contribution graph grid dimensions
  const gridWidth = 33;
  const gridHeight = 22;
  const cellSize = 16;
  const cellGap = 2;
  const stepSize = cellSize + cellGap; // 18px total cell space

  // Canvas offsets to center the grid
  const offsetX = 3;
  const offsetY = 2;

  // Game state references
  const snake = useRef<Point[]>([]);
  const prevSnake = useRef<Point[]>([]); // For smooth motion interpolation
  const direction = useRef<Direction>("right");
  const nextDirection = useRef<Direction>("right");
  const grid = useRef<number[][]>([]); // 2D array of grid cells storing contribution level (0 to 4)
  const goldenCommit = useRef<GoldenCommit | null>(null);
  const obstacles = useRef<Point[]>([]);
  const particles = useRef<Particle[]>([]);
  const ripples = useRef<Ripple[]>([]);
  const lastTickTime = useRef<number>(0);
  const lastFrameTime = useRef<number>(0);
  const shakeIntensity = useRef<number>(0);

  // Boost and combo state references
  const isBoosting = useRef(false);
  const comboMultiplier = useRef<number>(1);
  const comboTimeLeft = useRef<number>(0); // milliseconds remaining in combo
  const lastEatTime = useRef<number>(0);

  const comboWindow = 2500; // 2.5 seconds to chain hits

  // Load High Score
  useEffect(() => {
    try {
      const savedHighScore = localStorage.getItem(`snake_highscore_l${selectedLevel}`);
      setHighScore(savedHighScore ? Number(savedHighScore) : 0);
    } catch {
      setHighScore(0);
    }
  }, [selectedLevel]);

  // Sound Synth Generator
  const playSound = (freq: number, type: OscillatorType = "sine", duration: number = 0.1, slideToFreq?: number) => {
    if (!musicPlaying) return;
    try {
      const AudioCtxNode = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtxNode) return;
      const ctx = new AudioCtxNode();
      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();

      osc.connect(gainNode);
      gainNode.connect(ctx.destination);

      osc.type = type;
      osc.frequency.setValueAtTime(freq, ctx.currentTime);

      if (slideToFreq) {
        osc.frequency.exponentialRampToValueAtTime(slideToFreq, ctx.currentTime + duration);
      }

      // Slightly louder sound effects for higher combo tiers
      const volume = 0.04 * (1 + (comboMultiplier.current - 1) * 0.15);
      gainNode.gain.setValueAtTime(volume, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch (e) {
      console.warn("Audio Context sound failed", e);
    }
  };

  const playMenuSelectionSound = () => {
    playSound(330, "triangle", 0.08);
    setTimeout(() => playSound(440, "triangle", 0.08), 80);
  };

  const playStartSound = () => {
    playSound(261.63, "square", 0.1); // C4
    setTimeout(() => playSound(329.63, "square", 0.1), 100); // E4
    setTimeout(() => playSound(392.00, "square", 0.1), 200); // G4
    setTimeout(() => playSound(523.25, "square", 0.25), 300); // C5
  };

  const playEatSound = (level: number) => {
    // Pitch scales with level and active combo multiplier!
    const baseFreqs = [0, 440, 523.25, 659.25, 783.99]; // A4, C5, E5, G5
    const multiplier = 1 + (comboMultiplier.current - 1) * 0.12; // Pitch increases on combo!
    const targetFreq = (baseFreqs[level] || 523.25) * multiplier;
    playSound(targetFreq, "triangle", 0.08, targetFreq * 1.4);
  };

  const playGoldenEatSound = () => {
    const melody = [523.25, 659.25, 783.99, 1046.50];
    melody.forEach((note, index) => {
      setTimeout(() => playSound(note * 1.2, "square", 0.1), index * 80);
    });
  };

  const playCrashSound = () => {
    playSound(180, "sawtooth", 0.5, 45); // crash buzz
  };

  // Generate obstacles based on levels
  const generateObstacles = (level: number): Point[] => {
    const list: Point[] = [];
    if (level <= 2) return list;

    if (level === 3) {
      // Corner blocks (Merge Conflicts)
      list.push({ x: 3, y: 3 }, { x: 4, y: 3 }, { x: 5, y: 3 }, { x: 3, y: 4 }, { x: 3, y: 5 });
      list.push({ x: 29, y: 3 }, { x: 28, y: 3 }, { x: 27, y: 3 }, { x: 29, y: 4 }, { x: 29, y: 5 });
      list.push({ x: 3, y: 18 }, { x: 4, y: 18 }, { x: 5, y: 18 }, { x: 3, y: 17 }, { x: 3, y: 16 });
      list.push({ x: 29, y: 18 }, { x: 28, y: 18 }, { x: 27, y: 18 }, { x: 29, y: 17 }, { x: 29, y: 16 });
    } else if (level === 4) {
      // Divided vertical/horizontal bars
      for (let y = 6; y <= 15; y++) list.push({ x: 6, y });
      for (let y = 6; y <= 15; y++) list.push({ x: 26, y });
      for (let x = 11; x <= 21; x++) list.push({ x, y: 4 });
      for (let x = 11; x <= 21; x++) list.push({ x, y: 17 });
    } else if (level === 5) {
      // Full Maze
      for (let x = 4; x <= 28; x++) {
        if (x !== 16 && x !== 17) list.push({ x, y: 4 });
      }
      for (let x = 4; x <= 28; x++) {
        if (x !== 16 && x !== 17) list.push({ x, y: 17 });
      }
      for (let y = 5; y <= 16; y++) {
        if (y !== 10 && y !== 11) list.push({ x: 4, y });
      }
      for (let y = 5; y <= 16; y++) {
        if (y !== 10 && y !== 11) list.push({ x: 28, y });
      }
      // Central core conflicts
      list.push({ x: 16, y: 10 }, { x: 17, y: 10 }, { x: 16, y: 11 }, { x: 17, y: 11 });
    }
    return list;
  };

  // Generate particle explosion (rendered in canvas pixels)
  const createExplosion = (gridX: number, gridY: number, color: string, count = 12) => {
    const x = offsetX + gridX * stepSize + cellSize / 2;
    const y = offsetY + gridY * stepSize + cellSize / 2;
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speedValue = Math.random() * 3.5 + 1;
      particles.current.push({
        x,
        y,
        vx: Math.cos(angle) * speedValue,
        vy: Math.sin(angle) * speedValue,
        radius: Math.random() * 2 + 1.2,
        color,
        alpha: 1,
        decay: Math.random() * 0.035 + 0.015,
      });
    }
  };

  // Adds a grid expand shockwave ripple
  const createRipple = (gridX: number, gridY: number, color: string) => {
    const x = offsetX + gridX * stepSize + cellSize / 2;
    const y = offsetY + gridY * stepSize + cellSize / 2;
    ripples.current.push({
      x,
      y,
      color,
      radius: 10,
      maxRadius: 140,
      alpha: 0.8,
    });
  };

  // Randomizes the grid contributions
  const initializeGrid = (isFirstSetup = false) => {
    const tempGrid: number[][] = Array(gridWidth)
      .fill(null)
      .map(() => Array(gridHeight).fill(0));

    const densityLevel = selectedLevel === 1 ? 0.12 : 0.20;

    for (let x = 0; x < gridWidth; x++) {
      for (let y = 0; y < gridHeight; y++) {
        const isObstacle = obstacles.current.some((obs) => obs.x === x && obs.y === y);
        if (isObstacle) continue;

        if (isFirstSetup && x >= 8 && x <= 14 && y === 11) {
          continue; // Clear starting zone
        }

        if (Math.random() < densityLevel) {
          const rand = Math.random();
          if (rand > 0.90) tempGrid[x][y] = 4;
          else if (rand > 0.70) tempGrid[x][y] = 3;
          else if (rand > 0.40) tempGrid[x][y] = 2;
          else tempGrid[x][y] = 1;
        } else {
          tempGrid[x][y] = 0;
        }
      }
    }
    grid.current = tempGrid;
  };

  // Spawns golden commits
  const spawnGoldenCommit = () => {
    let attempts = 0;
    while (attempts < 200) {
      const x = Math.floor(Math.random() * gridWidth);
      const y = Math.floor(Math.random() * gridHeight);

      const hitSnake = snake.current.some((segment) => segment.x === x && segment.y === y);
      const hitObstacle = obstacles.current.some((obs) => obs.x === x && obs.y === y);

      if (!hitSnake && !hitObstacle && grid.current[x][y] === 0) {
        goldenCommit.current = {
          x,
          y,
          color: GITHUB_COLORS.golden,
          points: 500,
        };
        return;
      }
      attempts++;
    }
  };

  // Golden Splash Event
  const triggerPRMergeSplash = () => {
    const splashCells: Point[] = [];
    for (let i = 0; i < 20; i++) {
      const rx = Math.floor(Math.random() * gridWidth);
      const ry = Math.floor(Math.random() * gridHeight);

      const isSnake = snake.current.some((segment) => segment.x === rx && segment.y === ry);
      const isObstacle = obstacles.current.some((obs) => obs.x === rx && obs.y === ry);

      if (!isSnake && !isObstacle && grid.current[rx][ry] === 0) {
        const randLevel = Math.floor(Math.random() * 3) + 2;
        grid.current[rx][ry] = randLevel;
        splashCells.push({ x: rx, y: ry });
      }
    }

    splashCells.forEach((cell, idx) => {
      setTimeout(() => {
        const colors = [GITHUB_COLORS.level2, GITHUB_COLORS.level3, GITHUB_COLORS.level4];
        const randomColor = colors[Math.floor(Math.random() * colors.length)];
        createExplosion(cell.x, cell.y, randomColor, 8);
        playSound(350 + idx * 35, "triangle", 0.04);
      }, idx * 30);
    });
  };

  const countGreenCells = (): number => {
    let count = 0;
    for (let x = 0; x < gridWidth; x++) {
      for (let y = 0; y < gridHeight; y++) {
        if (grid.current[x][y] > 0) count++;
      }
    }
    return count;
  };

  // Start game setup
  const startGame = () => {
    setScore(0);
    setCommits(0);
    setCombo(1);
    setComboProgress(0);
    comboMultiplier.current = 1;
    comboTimeLeft.current = 0;
    isBoosting.current = false;
    setIsTurboActive(false);

    direction.current = "right";
    nextDirection.current = "right";
    shakeIntensity.current = 0;
    particles.current = [];
    ripples.current = [];
    goldenCommit.current = null;

    snake.current = [
      { x: 12, y: 11 },
      { x: 11, y: 11 },
      { x: 10, y: 11 },
    ];
    prevSnake.current = JSON.parse(JSON.stringify(snake.current));

    obstacles.current = generateObstacles(selectedLevel);
    initializeGrid(true);

    const now = performance.now();
    lastTickTime.current = now;
    lastFrameTime.current = now;

    setStatus("playing");
    playStartSound();
  };

  // Keyboard steering and turbo triggers
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      const currDir = direction.current;

      if ((key === "arrowup" || key === "w") && currDir !== "down") {
        e.preventDefault();
        nextDirection.current = "up";
      } else if ((key === "arrowdown" || key === "s") && currDir !== "up") {
        e.preventDefault();
        nextDirection.current = "down";
      } else if ((key === "arrowleft" || key === "a") && currDir !== "right") {
        e.preventDefault();
        nextDirection.current = "left";
      } else if ((key === "arrowright" || key === "d") && currDir !== "left") {
        e.preventDefault();
        nextDirection.current = "right";
      } else if (e.key === "Shift") {
        isBoosting.current = true;
        setIsTurboActive(true);
      } else if (e.key === "Escape") {
        onClose();
      } else if (e.key === "Space" || e.key === " ") {
        e.preventDefault();
        if (status === "playing") {
          setStatus("paused");
          playSound(440, "sine", 0.05);
          setTimeout(() => playSound(330, "sine", 0.05), 60);
        } else if (status === "paused") {
          setStatus("playing");
          playSound(330, "sine", 0.05);
          setTimeout(() => playSound(440, "sine", 0.05), 60);
        }
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === "Shift") {
        isBoosting.current = false;
        setIsTurboActive(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [status, onClose]);

  // Main game tick update
  const updateGame = () => {
    // Preserve current position list for sub-pixel drawing interpolation
    prevSnake.current = JSON.parse(JSON.stringify(snake.current));

    direction.current = nextDirection.current;
    const currDir = direction.current;
    const body = snake.current;
    if (body.length === 0) return;

    const head = body[0];
    let newHead: Point = { ...head };

    if (currDir === "up") newHead.y -= 1;
    else if (currDir === "down") newHead.y += 1;
    else if (currDir === "left") newHead.x -= 1;
    else if (currDir === "right") newHead.x += 1;

    // Border Collision
    if (newHead.x < 0 || newHead.x >= gridWidth || newHead.y < 0 || newHead.y >= gridHeight) {
      handleGameOver();
      return;
    }

    // Obstacle Collision
    const hitObstacle = obstacles.current.some((obs) => obs.x === newHead.x && obs.y === newHead.y);
    if (hitObstacle) {
      handleGameOver();
      return;
    }

    // Self Collision (excluding tail segment unless eating)
    const activeGolden = goldenCommit.current;
    const isEatingGolden = activeGolden && newHead.x === activeGolden.x && newHead.y === activeGolden.y;
    const gridLevel = grid.current[newHead.x]?.[newHead.y] || 0;
    const isEatingCommit = gridLevel > 0;

    const hitSelf = body.slice(0, -1).some((segment) => segment.x === newHead.x && segment.y === newHead.y);
    if (hitSelf) {
      handleGameOver();
      return;
    }

    // Scoring variables
    const config = LEVEL_CONFIGS.find((c) => c.level === selectedLevel) || LEVEL_CONFIGS[0];
    const speedBoostMultiplier = isBoosting.current ? 2.0 : 1.0;

    if (isEatingGolden && activeGolden) {
      // Golden Commit PR merge event
      playGoldenEatSound();
      createExplosion(activeGolden.x, activeGolden.y, GITHUB_COLORS.golden, 24);
      createRipple(activeGolden.x, activeGolden.y, GITHUB_COLORS.golden);

      // Combo management
      updateComboScore();

      const points = Math.round(activeGolden.points * config.multiplier * comboMultiplier.current * speedBoostMultiplier);
      setScore((prev) => prev + points);
      setCommits((prev) => prev + 5);

      snake.current = [newHead, ...body]; // Grow
      goldenCommit.current = null;
      triggerPRMergeSplash();
    } else if (isEatingCommit) {
      // Eat standard green contribution block
      playEatSound(gridLevel);

      const colors = [
        GITHUB_COLORS.level0,
        GITHUB_COLORS.level1,
        GITHUB_COLORS.level2,
        GITHUB_COLORS.level3,
        GITHUB_COLORS.level4,
      ];
      const matchColor = colors[gridLevel];
      createExplosion(newHead.x, newHead.y, matchColor, 12);
      createRipple(newHead.x, newHead.y, matchColor);

      // Combo update
      updateComboScore();

      const points = Math.round(gridLevel * 50 * config.multiplier * comboMultiplier.current * speedBoostMultiplier);

      setScore((prev) => {
        const nextScore = prev + points;
        setHighScore((currHigh) => {
          if (nextScore > currHigh) {
            try {
              localStorage.setItem(`snake_highscore_l${selectedLevel}`, nextScore.toString());
            } catch {}
            return nextScore;
          }
          return currHigh;
        });
        return nextScore;
      });

      setCommits((prev) => prev + 1);

      // Convert grid cell back to gray empty contribution (Level 0)
      grid.current[newHead.x][newHead.y] = 0;
      snake.current = [newHead, ...body]; // Grow

      // Check remaining contributions. If sparse, spawn new contribution wave!
      if (countGreenCells() < 6) {
        initializeGrid(false);
        playSound(440, "sine", 0.15);
      }
    } else {
      // Normal movement (slide)
      snake.current = [newHead, ...body.slice(0, -1)];
    }

    // Spawn golden commits randomly in background
    if (goldenCommit.current === null && Math.random() < 0.008) {
      spawnGoldenCommit();
    }
  };

  const updateComboScore = () => {
    const now = performance.now();
    if (now - lastEatTime.current < comboWindow) {
      comboMultiplier.current = Math.min(5, comboMultiplier.current + 1);
    } else {
      comboMultiplier.current = 1;
    }
    lastEatTime.current = now;
    comboTimeLeft.current = comboWindow;
    setCombo(comboMultiplier.current);
  };

  const handleGameOver = () => {
    playCrashSound();
    shakeIntensity.current = 15;
    snake.current.forEach((seg) => {
      createExplosion(seg.x, seg.y, "#a87cff", 5);
    });
    setStatus("gameover");
  };

  // Canvas Renders Loop (interpolating coordinate positions at full 60fps+)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animFrameId: number;

    const render = (time: number) => {
      // Delta time between frames (for animations / timers)
      const frameDelta = time - lastFrameTime.current;
      lastFrameTime.current = time;

      // --- DECAY COMBO TIMER ---
      if (status === "playing") {
        if (comboTimeLeft.current > 0) {
          comboTimeLeft.current = Math.max(0, comboTimeLeft.current - frameDelta);
          setComboProgress((comboTimeLeft.current / comboWindow) * 100);
          if (comboTimeLeft.current === 0) {
            comboMultiplier.current = 1;
            setCombo(1);
          }
        }
      }

      // --- TICK STATE AT DYNAMIC SPEED ---
      if (status === "playing") {
        const config = LEVEL_CONFIGS.find((c) => c.level === selectedLevel) || LEVEL_CONFIGS[0];
        // Turbo boost speeds up ticks 1.8x
        const activeSpeed = isBoosting.current ? config.speed / 1.8 : config.speed;
        const delta = time - lastTickTime.current;

        if (delta >= activeSpeed) {
          updateGame();
          // Avoid drift Accumulators
          lastTickTime.current = time - (delta % activeSpeed);
        }
      }

      // --- RENDERING GRAPHICS ---
      ctx.save();

      // Screen Shake
      if (shakeIntensity.current > 0) {
        const dx = (Math.random() - 0.5) * shakeIntensity.current;
        const dy = (Math.random() - 0.5) * shakeIntensity.current;
        ctx.translate(dx, dy);
        shakeIntensity.current *= 0.85;
        if (shakeIntensity.current < 0.1) shakeIntensity.current = 0;
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Deep dark GitHub style page background
      ctx.fillStyle = "#0d1117";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Render contribution calendar blocks
      const contributionMatrix = grid.current;
      if (contributionMatrix.length > 0) {
        for (let x = 0; x < gridWidth; x++) {
          for (let y = 0; y < gridHeight; y++) {
            const isObstacle = obstacles.current.some((obs) => obs.x === x && obs.y === y);
            if (isObstacle) continue;

            const val = contributionMatrix[x]?.[y] || 0;
            const px = offsetX + x * stepSize;
            const py = offsetY + y * stepSize;

            ctx.fillStyle =
              val === 4
                ? GITHUB_COLORS.level4
                : val === 3
                ? GITHUB_COLORS.level3
                : val === 2
                ? GITHUB_COLORS.level2
                : val === 1
                ? GITHUB_COLORS.level1
                : GITHUB_COLORS.level0;

            ctx.beginPath();
            if (ctx.roundRect) {
              ctx.roundRect(px, py, cellSize, cellSize, 2);
            } else {
              ctx.rect(px, py, cellSize, cellSize);
            }
            ctx.fill();
          }
        }
      }

      // Draw Obstacles (Failed Builds / Merge Conflicts in Red)
      obstacles.current.forEach((obs) => {
        const px = offsetX + obs.x * stepSize;
        const py = offsetY + obs.y * stepSize;

        ctx.fillStyle = GITHUB_COLORS.obstacle;
        ctx.shadowColor = GITHUB_COLORS.obstacle;
        ctx.shadowBlur = 6;

        ctx.beginPath();
        if (ctx.roundRect) {
          ctx.roundRect(px, py, cellSize, cellSize, 2);
        } else {
          ctx.rect(px, py, cellSize, cellSize);
        }
        ctx.fill();
        ctx.shadowBlur = 0;

        ctx.strokeStyle = "#ffffff";
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(px + 4, py + 4);
        ctx.lineTo(px + cellSize - 4, py + cellSize - 4);
        ctx.moveTo(px + cellSize - 4, py + 4);
        ctx.lineTo(px + 4, py + cellSize - 4);
        ctx.stroke();
      });

      // Draw Golden Commit (PR Merge Food)
      const gold = goldenCommit.current;
      if (gold) {
        const px = offsetX + gold.x * stepSize;
        const py = offsetY + gold.y * stepSize;

        const pulse = 1 + 0.18 * Math.sin(time / 120);
        const pSize = cellSize * pulse;
        const offset = (cellSize - pSize) / 2;

        ctx.fillStyle = GITHUB_COLORS.golden;
        ctx.shadowColor = GITHUB_COLORS.golden;
        ctx.shadowBlur = 10;

        ctx.beginPath();
        if (ctx.roundRect) {
          ctx.roundRect(px + offset, py + offset, pSize, pSize, 3);
        } else {
          ctx.rect(px + offset, py + offset, pSize, pSize);
        }
        ctx.fill();
        ctx.shadowBlur = 0;

        ctx.fillStyle = "#ffffff";
        ctx.beginPath();
        ctx.arc(px + cellSize / 2, py + cellSize / 2, pSize * 0.25, 0, Math.PI * 2);
        ctx.fill();
      }

      // Draw ripples shockwaves
      ripples.current.forEach((r, idx) => {
        r.radius += frameDelta * 0.18;
        r.alpha = 1 - r.radius / r.maxRadius;

        if (r.alpha <= 0 || r.radius >= r.maxRadius) {
          ripples.current.splice(idx, 1);
          return;
        }

        ctx.save();
        ctx.strokeStyle = r.color;
        ctx.globalAlpha = r.alpha;
        ctx.shadowColor = r.color;
        ctx.shadowBlur = 8;
        ctx.lineWidth = 2 * r.alpha;
        ctx.beginPath();
        ctx.arc(r.x, r.y, r.radius, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
      });

      // --- SUB-PIXEL SMOOTH MOTION INTERPOLATION ---
      const body = snake.current;
      const prevBody = prevSnake.current;
      const config = LEVEL_CONFIGS.find((c) => c.level === selectedLevel) || LEVEL_CONFIGS[0];
      const activeSpeed = isBoosting.current ? config.speed / 1.8 : config.speed;

      // Interpolation fraction t going smoothly from 0 to 1
      let t = (time - lastTickTime.current) / activeSpeed;
      if (t > 1.0) t = 1.0;
      if (t < 0.0) t = 0.0;

      // In case game is menu/over, no interpolation is needed
      if (status !== "playing") t = 1.0;

      // Draw turbo boost flame trail behind head
      if (status === "playing" && isBoosting.current && body.length > 0) {
        const head = body[0];
        const prevHead = prevBody[0] || head;
        const interpolHeadX = offsetX + (prevHead.x + (head.x - prevHead.x) * t) * stepSize + cellSize / 2;
        const interpolHeadY = offsetY + (prevHead.y + (head.y - prevHead.y) * t) * stepSize + cellSize / 2;

        if (Math.random() < 0.35) {
          // Spawn boost trails
          let trailX = interpolHeadX;
          let trailY = interpolHeadY;
          const dir = direction.current;
          if (dir === "up") trailY += 8;
          else if (dir === "down") trailY -= 8;
          else if (dir === "left") trailX += 8;
          else trailX -= 8;

          particles.current.push({
            x: trailX,
            y: trailY,
            vx: (Math.random() - 0.5) * 1.5,
            vy: (Math.random() - 0.5) * 1.5,
            radius: Math.random() * 2 + 1,
            color: "#bd93f9",
            alpha: 0.8,
            decay: 0.04,
            trail: true,
          });
        }
      }

      // Draw smooth sliding snake
      if (body.length > 0) {
        body.forEach((segment, idx) => {
          // Determine previous position segment. Falls back to current segment if newly spawned
          const prevSegment = prevBody[idx] || segment;

          // Interpolated cell coordinates
          const ix = prevSegment.x + (segment.x - prevSegment.x) * t;
          const iy = prevSegment.y + (segment.y - prevSegment.y) * t;

          const px = offsetX + ix * stepSize;
          const py = offsetY + iy * stepSize;

          const ratio = idx / Math.max(1, body.length - 1);
          ctx.fillStyle = idx === 0 ? "#58a6ff" : `rgb(${168 - ratio * 80}, ${124 - ratio * 60}, 255)`;
          ctx.shadowColor = idx === 0 ? "#58a6ff" : "#a87cff";
          ctx.shadowBlur = idx === 0 ? 8 : 2;

          // Scaling down tail end
          let scale = Math.max(0.7, 1.0 - ratio * 0.25);

          // If this is a brand new segment grown this tick (idx exceeds prevBody size), make it pop in from 0 size
          if (idx >= prevBody.length) {
            scale *= t;
          }

          const segmentSize = cellSize * scale;
          const offset = (cellSize - segmentSize) / 2;

          ctx.beginPath();
          if (ctx.roundRect) {
            ctx.roundRect(px + offset, py + offset, segmentSize, segmentSize, 3);
          } else {
            ctx.rect(px + offset, py + offset, segmentSize, segmentSize);
          }
          ctx.fill();
          ctx.shadowBlur = 0;

          // Head eyes facing movement direction
          if (idx === 0) {
            ctx.fillStyle = "#000000";
            const eyeRadius = 1.8;
            const hx = px + cellSize / 2;
            const hy = py + cellSize / 2;
            const dir = direction.current;

            ctx.beginPath();
            if (dir === "up") {
              ctx.arc(hx - 3, hy - 3, eyeRadius, 0, Math.PI * 2);
              ctx.arc(hx + 3, hy - 3, eyeRadius, 0, Math.PI * 2);
            } else if (dir === "down") {
              ctx.arc(hx - 3, hy + 3, eyeRadius, 0, Math.PI * 2);
              ctx.arc(hx + 3, hy + 3, eyeRadius, 0, Math.PI * 2);
            } else if (dir === "left") {
              ctx.arc(hx - 3, hy - 3, eyeRadius, 0, Math.PI * 2);
              ctx.arc(hx - 3, hy + 3, eyeRadius, 0, Math.PI * 2);
            } else {
              ctx.arc(hx + 3, hy - 3, eyeRadius, 0, Math.PI * 2);
              ctx.arc(hx + 3, hy + 3, eyeRadius, 0, Math.PI * 2);
            }
            ctx.fill();
          }
        });

        // Draw old tail segment shrinking and fading out (creates an ultra smooth sliding tail!)
        if (status === "playing" && prevBody.length > 0 && prevBody.length === body.length) {
          const oldTail = prevBody[prevBody.length - 1];
          const newTail = body[body.length - 1];

          // If tail actually moved this tick (i.e. did not eat and grow)
          if (oldTail.x !== newTail.x || oldTail.y !== newTail.y) {
            const px = offsetX + oldTail.x * stepSize;
            const py = offsetY + oldTail.y * stepSize;

            ctx.save();
            ctx.globalAlpha = Math.max(0, 1 - t);
            ctx.fillStyle = "rgb(88, 64, 255)"; // fade color

            const tailScale = Math.max(0.7, 0.75) * (1 - t);
            const segmentSize = cellSize * tailScale;
            const offset = (cellSize - segmentSize) / 2;

            ctx.beginPath();
            if (ctx.roundRect) {
              ctx.roundRect(px + offset, py + offset, segmentSize, segmentSize, 3);
            } else {
              ctx.rect(px + offset, py + offset, segmentSize, segmentSize);
            }
            ctx.fill();
            ctx.restore();
          }
        }
      }

      // Update & Draw Particles
      particles.current.forEach((p, idx) => {
        p.x += p.vx;
        p.y += p.vy;
        p.alpha -= p.decay;

        if (p.alpha <= 0) {
          particles.current.splice(idx, 1);
          return;
        }

        ctx.save();
        ctx.globalAlpha = p.alpha;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = p.trail ? 2 : 4;
        ctx.fillStyle = p.color;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });

      ctx.restore(); // restore translate matrices
      animFrameId = requestAnimationFrame(render);
    };

    animFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animFrameId);
    };
  }, [status, selectedLevel]);

  const activeLevelConfig = LEVEL_CONFIGS.find((c) => c.level === selectedLevel) || LEVEL_CONFIGS[0];

  return (
    <div className="game-modal-overlay" ref={containerRef} onClick={onClose}>
      <div className="game-modal" onClick={(e) => e.stopPropagation()}>
        <div className="game-modal-glow" />

        {/* Header bar */}
        <div className="game-header-bar">
          <div className="game-indicators">
            <span className="dot red"></span>
            <span className="dot yellow"></span>
            <span className="dot green"></span>
          </div>
          <div className="game-title">GITHUB CONTRIBS SNAKE</div>
          <button className="game-close-btn" onClick={onClose} aria-label="Close game">
            &times;
          </button>
        </div>

        {/* HUD Display */}
        <div className="game-hud">
          <div className="hud-item">
            <span className="hud-label">RANK</span>
            <span className="hud-value" style={{ color: "#a87cff" }}>
              {getDevRank(score)}
            </span>
          </div>
          <div className="hud-item">
            <span className="hud-label">COMMITS</span>
            <span className="hud-value" style={{ color: "#39d353" }}>
              {commits}
            </span>
          </div>
          <div className="hud-item">
            <span className="hud-label">SCORE</span>
            <span className="hud-value">{score}</span>
          </div>
          <div className="hud-item">
            <span className="hud-label">LEVEL</span>
            <span className="hud-value" style={{ color: "#58a6ff" }}>
              L{selectedLevel}
            </span>
          </div>
        </div>

        {/* Combo Multiplier Alert and Turbo Glow Indicators */}
        {status === "playing" && (
          <div className="game-hud-extras">
            <div className={`combo-badge ${combo > 1 ? "active" : ""}`}>
              <span>COMBO x{combo}</span>
              <div className="combo-bar-container">
                <div className="combo-bar-fill" style={{ width: `${comboProgress}%` }} />
              </div>
            </div>
            <div className={`turbo-badge ${isTurboActive ? "active" : ""}`}>
              ⚡ TURBO BOOST (x2 SCORE)
            </div>
          </div>
        )}

        {/* Game Canvas Wrapper */}
        <div className="canvas-wrapper">
          <canvas ref={canvasRef} width={600} height={400} className="game-canvas" />

          {/* Menus / Overlays inside Canvas view */}
          {status === "menu" && (
            <div className="canvas-overlay">
              <h2>GITHUB SNAKE</h2>
              <p className="subtitle">Crawling the calendar grid. Eat green contributions & merge PRs!</p>
              <div className="menu-highscore">LEVEL HIGH SCORE: {highScore}</div>

              {/* Level Selector */}
              <div className="level-selector-title">Select Board Difficulty</div>
              <div className="level-grid">
                {LEVEL_CONFIGS.map((config) => (
                  <button
                    key={config.level}
                    className={`level-card ${selectedLevel === config.level ? "selected" : ""}`}
                    onClick={() => {
                      setSelectedLevel(config.level);
                      playMenuSelectionSound();
                    }}
                  >
                    <span className="level-num">L{config.level}</span>
                    <span className="level-desc">{config.name.split(" ")[0]}</span>
                  </button>
                ))}
              </div>

              {/* Selected Level Details */}
              <div className="level-info-box">
                <span className="level-info-text">{activeLevelConfig.description}</span>
              </div>

              <div className="controls-guide">
                <div>
                  <span>W</span> / <span>A</span> / <span>S</span> / <span>D</span> or <span>↑</span> / <span>↓</span> / <span>←</span> / <span>→</span> to steer
                </div>
                <div>
                  <span>Shift</span> to Boost (2x Pts!)
                </div>
                <div>
                  <span>Space</span> to Pause
                </div>
              </div>

              <button className="arcade-btn primary" onClick={startGame}>
                START YEAR
              </button>
            </div>
          )}

          {status === "paused" && (
            <div className="canvas-overlay blurred">
              <h2>CONTRIBS PAUSED</h2>
              <p>Press Space to continue making commits</p>
              <button className="arcade-btn secondary" onClick={() => setStatus("playing")}>
                RESUME
              </button>
            </div>
          )}

          {status === "gameover" && (
            <div className="canvas-overlay lost-screen">
              <h2 className="glow-red">BUILD FAILED</h2>
              <p>
                Rank reached: <strong>{getDevRank(score).split(" ")[0]}</strong>! Score: {score}
              </p>
              <button className="arcade-btn primary red-btn" onClick={startGame}>
                RETRIGGER PIPELINE
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TechSnake;
