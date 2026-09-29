import React, { useState, useEffect, useRef } from 'react';
import './pianolesson.css';

const PITCH_POSITIONS = {
  C: 105,
  D: 90,
  E: 75,
  F: 60,
  G: 45,
  A: 30,
  B: 15
};

const PITCH_KEYS = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];

export default function PianoLesson() {
  const [currentScreen, setCurrentScreen] = useState('selection');
  const [score, setScore] = useState(0);
  const [health, setHealth] = useState(100);
  const [speedMultiplier, setSpeedMultiplier] = useState(1.0);
  const [pressedKey, setPressedKey] = useState(null);
  const [gameOver, setGameOver] = useState(false);
  const [notes, setNotes] = useState([]);

  const animFrameRef = useRef(null);
  const lastTimeRef = useRef(null);
  const notesRef = useRef([]);
  const scoreRef = useRef(0);
  const healthRef = useRef(100);
  const speedRef = useRef(1.0);

  scoreRef.current = score;
  healthRef.current = health;
  speedRef.current = speedMultiplier;
  notesRef.current = notes;

  const startNewGame = () => {
    const initialNotes = [
      { id: 1, pitch: 'E', x: 280 },
      { id: 2, pitch: 'C', x: 400 },
      { id: 3, pitch: 'G', x: 520 },
      { id: 4, pitch: 'D', x: 640 }
    ];
    setNotes(initialNotes);
    setScore(0);
    setHealth(100);
    setSpeedMultiplier(1.0);
    setGameOver(false);
    setCurrentScreen('game');
  };

  useEffect(() => {
    if (currentScreen !== 'game' || gameOver) return;

    const spawnDistance = 120;
    const goldLineX = 45;

    const gameLoop = (timestamp) => {
      if (!lastTimeRef.current) lastTimeRef.current = timestamp;
      const deltaTime = (timestamp - lastTimeRef.current) / 1000;
      lastTimeRef.current = timestamp;

      const moveSpeed = 70 * speedRef.current;
      let updatedNotes = notesRef.current.map((note) => ({
        ...note,
        x: note.x - moveSpeed * deltaTime
      }));

      // Missed note check
      let currentHealth = healthRef.current;
      updatedNotes = updatedNotes.filter((note) => {
        if (note.x < goldLineX - 25) {
          currentHealth = Math.max(0, currentHealth - 10);
          setHealth(currentHealth);
          if (currentHealth <= 0) {
            setGameOver(true);
          }
          return false;
        }
        return true;
      });

      // Queue management
      if (updatedNotes.length < 5) {
        const lastNote = updatedNotes[updatedNotes.length - 1];
        const nextX = lastNote ? Math.max(300, lastNote.x + spawnDistance) : 300;
        const randomPitch = PITCH_KEYS[Math.floor(Math.random() * PITCH_KEYS.length)];
        updatedNotes.push({
          id: Date.now() + Math.random(),
          pitch: randomPitch,
          x: nextX
        });
      }

      notesRef.current = updatedNotes;
      setNotes(updatedNotes);

      if (currentHealth > 0) {
        animFrameRef.current = requestAnimationFrame(gameLoop);
      }
    };

    lastTimeRef.current = performance.now();
    animFrameRef.current = requestAnimationFrame(gameLoop);

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [currentScreen, gameOver]);

  const handleKeyPress = (key) => {
    if (gameOver) return;
    setPressedKey(key);
    setTimeout(() => setPressedKey(null), 150);

    const goldLineX = 45;
    const hitTolerance = 30;

    const targetNote = notesRef.current.find(
      (n) => Math.abs(n.x - goldLineX) <= hitTolerance
    );

    if (targetNote) {
      if (targetNote.pitch === key) {
        const newScore = scoreRef.current + 10;
        setScore(newScore);
        setSpeedMultiplier(Number((1.0 + Math.floor(newScore / 50) * 0.15).toFixed(2)));
        setNotes((prev) => prev.filter((n) => n.id !== targetNote.id));
      } else {
        setHealth((prev) => {
          const updated = Math.max(0, prev - 8);
          if (updated <= 0) setGameOver(true);
          return updated;
        });
      }
    } else {
      setHealth((prev) => {
        const updated = Math.max(0, prev - 4);
        if (updated <= 0) setGameOver(true);
        return updated;
      });
    }
  };

  const activeTargetNote = notes.find((n) => Math.abs(n.x - 45) <= 50);

  if (currentScreen === 'selection') {
    return (
      <div className="selection-screen">
        <button className="back-arrow-btn">➜</button>
        <h2 className="selection-title">Welcome to the Minigame!</h2>
        <p className="selection-subtitle">Get ready to test your skills and have fun!</p>

        <div className="card-container">
          <div className="minigame-card">
            <div className="card-image-placeholder"></div>
            <h3 className="card-title">Tower Defense</h3>
            <span className="card-desc">Play a game</span>
            <button className="play-btn disabled">Play</button>
          </div>

          <div className="minigame-card">
            <div className="card-image-placeholder"></div>
            <h3 className="card-title">Piano Man</h3>
            <span className="card-desc">Play a game</span>
            <button className="play-btn" onClick={startNewGame}>
              Play
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="game-screen">
      <div className="main-gold-frame">
        {/* Top HUD */}
        <div className="hud-bar">
          <div className="health-container">
            <span className="heart-icon">♥</span>
            <div className="health-bar">
              <div
                className="health-fill"
                style={{ width: `${health}%` }}
              ></div>
            </div>
          </div>
          <div>SPEED: {speedMultiplier.toFixed(1)}X</div>
          <div>SCORE: {score}</div>
        </div>

        {/* Staff Area */}
        <div className="game-staff-container">
          <div className="staff-line-item" style={{ top: '15px' }}></div>
          <div className="staff-line-item" style={{ top: '30px' }}></div>
          <div className="staff-line-item" style={{ top: '45px' }}></div>
          <div className="staff-line-item" style={{ top: '60px' }}></div>
          <div className="staff-line-item" style={{ top: '75px' }}></div>
          <div className="staff-line-item" style={{ top: '90px' }}></div>
          <div className="staff-line-item" style={{ top: '105px' }}></div>

          <div className="gold-target-line"></div>

          {notes.map((note) => {
            const isAtTarget = Math.abs(note.x - 45) <= 25;
            return (
              <div
                key={note.id}
                className={`note-ball ${isAtTarget ? 'target' : 'upcoming'}`}
                style={{
                  left: `${note.x}px`,
                  top: `${PITCH_POSITIONS[note.pitch]}px`
                }}
              >
                <span className="note-text">{note.pitch}</span>
              </div>
            );
          })}
        </div>

        {/* Center Stage Container */}
        <div className="center-stage-container">
          {gameOver && (
            <div className="game-over-overlay">
              <h3>GAME OVER</h3>
              <p>Final Score: {score}</p>
              <button className="restart-btn" onClick={startNewGame}>
                Try Again
              </button>
            </div>
          )}
        </div>

        {/* Bottom Piano Keys */}
        <div className="game-controls-area">
          <div className="piano-keys-row">
            {PITCH_KEYS.map((key) => {
              const isTargetKey = activeTargetNote?.pitch === key;
              const isPressed = pressedKey === key;

              return (
                <div
                  key={key}
                  className={`game-key ${isPressed ? 'pressed' : ''} ${
                    isTargetKey ? 'key-hint' : ''
                  }`}
                  onClick={() => handleKeyPress(key)}
                >
                  {key}
                </div>
              );
            })}
          </div>
          <div className="game-instruction-text">
            TAP THE KEY AS THE NOTE CROSSES THE GOLD LINE
          </div>
        </div>
      </div>
    </div>
  );
}