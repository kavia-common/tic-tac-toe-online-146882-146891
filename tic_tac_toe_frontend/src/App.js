import React, { useMemo, useState } from 'react';
import './App.css';

// Color and theme constants for Ocean Professional
const THEME = {
  primary: '#2563EB', // Blue
  secondary: '#F59E0B', // Amber
  error: '#EF4444',
  background: '#f9fafb',
  surface: '#ffffff',
  text: '#111827',
  subtle: 'rgba(17, 24, 39, 0.6)',
  border: 'rgba(17, 24, 39, 0.08)',
  focus: 'rgba(37, 99, 235, 0.35)'
};

// Helpers
function calculateWinner(squares) {
  const lines = [
    [0,1,2], [3,4,5], [6,7,8], // rows
    [0,3,6], [1,4,7], [2,5,8], // cols
    [0,4,8], [2,4,6]           // diags
  ];
  for (let [a,b,c] of lines) {
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return { player: squares[a], line: [a,b,c] };
    }
  }
  return null;
}

function getAvailableMoves(squares) {
  const moves = [];
  for (let i = 0; i < squares.length; i++) {
    if (!squares[i]) moves.push(i);
  }
  return moves;
}

// Simple AI: try winning move, then blocking move, else center, corner, random
function aiMove(squares, aiPlayer, humanPlayer) {
  const available = getAvailableMoves(squares);
  if (available.length === 0) return null;

  // try to win
  for (const move of available) {
    const clone = squares.slice();
    clone[move] = aiPlayer;
    if (calculateWinner(clone)?.player === aiPlayer) return move;
  }
  // block opponent
  for (const move of available) {
    const clone = squares.slice();
    clone[move] = humanPlayer;
    if (calculateWinner(clone)?.player === humanPlayer) return move;
  }
  // prefer center
  if (available.includes(4)) return 4;
  // prefer corners
  const corners = available.filter(i => [0,2,6,8].includes(i));
  if (corners.length) return corners[Math.floor(Math.random() * corners.length)];
  // otherwise any random
  return available[Math.floor(Math.random() * available.length)];
}

// PUBLIC_INTERFACE
export function Square({ value, onClick, highlight, isWinning, disabled, ariaLabel }) {
  /** A single square of the tic-tac-toe board. */
  return (
    <button
      className="ttt-square"
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      style={{
        color: value === 'X' ? THEME.primary : value === 'O' ? THEME.secondary : THEME.text,
        boxShadow: isWinning
          ? `inset 0 0 0 2px ${THEME.secondary}, 0 6px 16px rgba(0,0,0,0.08)`
          : 'inset 0 0 0 1px rgba(17,24,39,0.06)',
        transform: highlight ? 'scale(1.02)' : 'scale(1)',
        background:
          isWinning
            ? `linear-gradient(135deg, ${THEME.secondary}22, ${THEME.primary}11)`
            : THEME.surface,
      }}
    >
      <span className="ttt-square-mark">{value}</span>
    </button>
  );
}

// PUBLIC_INTERFACE
export function Board({ squares, onPlay, next, winnerInfo, isLocked }) {
  /** 3x3 tic-tac-toe board, stateless; renders Square components. */
  const winningLine = winnerInfo?.line ?? [];
  return (
    <div className="ttt-board" role="grid" aria-label="Tic Tac Toe Board">
      {squares.map((val, idx) => (
        <Square
          key={idx}
          value={val}
          onClick={() => onPlay(idx)}
          highlight={!val && !winnerInfo && !isLocked && next ? true : false}
          isWinning={winningLine.includes(idx)}
          disabled={!!val || !!winnerInfo || isLocked}
          ariaLabel={`Square ${idx + 1}, ${val ? `occupied by ${val}` : 'empty'}`}
        />
      ))}
    </div>
  );
}

// PUBLIC_INTERFACE
export function GameModeSelector({ mode, onChange }) {
  /** Controls to switch between Player vs Player and Player vs AI modes. */
  return (
    <div className="ttt-mode">
      <label className="ttt-label" htmlFor="mode-select">Mode</label>
      <div className="ttt-segment" role="radiogroup" aria-label="Game Mode">
        <button
          className={`ttt-segment-btn ${mode === 'pvp' ? 'active' : ''}`}
          onClick={() => onChange('pvp')}
          role="radio"
          aria-checked={mode === 'pvp'}
        >
          Player vs Player
        </button>
        <button
          className={`ttt-segment-btn ${mode === 'ai' ? 'active' : ''}`}
          onClick={() => onChange('ai')}
          role="radio"
          aria-checked={mode === 'ai'}
        >
          Player vs AI
        </button>
      </div>
    </div>
  );
}

// PUBLIC_INTERFACE
export function Controls({ onReset, canUndo, onUndo }) {
  /** Reset and optional undo controls under the board. */
  return (
    <div className="ttt-controls">
      <button className="btn btn-reset" onClick={onReset} aria-label="Reset game">
        ↻ Restart
      </button>
      <button
        className="btn btn-ghost"
        onClick={onUndo}
        disabled={!canUndo}
        aria-label="Undo last move"
      >
        ⟲ Undo
      </button>
    </div>
  );
}

// PUBLIC_INTERFACE
export function Status({ status, xIsNext }) {
  /** Status line with subtle emphasis on current player. */
  return (
    <div className="ttt-status" aria-live="polite" role="status">
      <span
        className="pill"
        style={{
          background: xIsNext ? `${THEME.primary}15` : `${THEME.secondary}15`,
          color: xIsNext ? THEME.primary : THEME.secondary,
          borderColor: xIsNext ? `${THEME.primary}50` : `${THEME.secondary}50`
        }}
      >
        {xIsNext ? 'X' : 'O'} turn
      </span>
      <span className="status-text">{status}</span>
    </div>
  );
}

// PUBLIC_INTERFACE
export default function App() {
  /** Main App for Tic Tac Toe with modes: PvP and PvAI, modern Ocean styling. */
  const [mode, setMode] = useState('ai'); // 'pvp' | 'ai'
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [xIsNext, setXIsNext] = useState(true);

  const current = history[history.length - 1];
  const winnerInfo = useMemo(() => calculateWinner(current), [current]);
  const isDraw = useMemo(() => !winnerInfo && current.every(Boolean), [winnerInfo, current]);

  const statusText = winnerInfo
    ? `Winner: ${winnerInfo.player}`
    : isDraw
      ? 'Draw!'
      : `Next player: ${xIsNext ? 'X' : 'O'}`;

  const handlePlay = (index) => {
    if (winnerInfo || current[index]) return;
    const next = current.slice();
    next[index] = xIsNext ? 'X' : 'O';
    setHistory(prev => [...prev, next]);
    setXIsNext(!xIsNext);
  };

  const resetGame = () => {
    setHistory([Array(9).fill(null)]);
    setXIsNext(true);
  };

  const undo = () => {
    if (history.length <= 1) return;
    setHistory(prev => prev.slice(0, prev.length - 1));
    setXIsNext(prev => !prev);
  };

  // AI move effect simulated inline via conditional computation: if mode is AI, O is AI by default.
  const shouldAIMove = mode === 'ai' && !winnerInfo && !isDraw && !xIsNext;
  if (shouldAIMove) {
    const move = aiMove(current, 'O', 'X');
    if (move != null) {
      // perform AI move immediately
      const next = current.slice();
      next[move] = 'O';
      // push once, flip turn
      setTimeout(() => {
        setHistory(prev => [...prev, next]);
        setXIsNext(true);
      }, 200); // small delay for UX
    }
  }

  return (
    <div className="page" style={{ background: THEME.background, color: THEME.text }}>
      <div className="container">
        <header className="header">
          <div className="title-wrap">
            <h1 className="title">
              <span className="title-accent">Tic</span> Tac Toe
            </h1>
            <p className="subtitle">Modern, minimal, Ocean Professional UI</p>
          </div>
          <GameModeSelector
            mode={mode}
            onChange={(m) => {
              setMode(m);
              // reset on mode change for clarity
              resetGame();
            }}
          />
        </header>

        <main className="main">
          <div className="card">
            <Status status={statusText} xIsNext={xIsNext} />
            <Board
              squares={current}
              onPlay={handlePlay}
              next={xIsNext ? 'X' : 'O'}
              winnerInfo={winnerInfo}
              isLocked={mode === 'ai' && !xIsNext}
            />
            <Controls onReset={resetGame} canUndo={history.length > 1} onUndo={undo} />
          </div>
        </main>

        <footer className="footer">
          <span className="note">Ocean Professional • Blue & Amber Accents</span>
        </footer>
      </div>
    </div>
  );
}
