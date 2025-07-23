import React, { useState } from "react";
import "./App.css";

/**
 * Minimal and modern Tic Tac Toe game.
 * Features:
 *   - 3x3 game board
 *   - Current player indicator
 *   - Win/draw notification
 *   - Reset/New Game controls
 *   - Responsive and accessible
 *   - Light theme, minimal UI, uses primary/secondary/accent color scheme
 */

// --- Helper Logic ---
const EMPTY_BOARD = Array(9).fill(null);
const PLAYERS = ["X", "O"];

// Calculate winner info
function calculateWinner(squares) {
  // Returns {winner: 'X'|'O'|null, winningLine: [idx, ...]|null, isDraw: bool}
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let l of lines) {
    const [a, b, c] = l;
    if (
      squares[a] &&
      squares[a] === squares[b] &&
      squares[a] === squares[c]
    ) {
      return { winner: squares[a], winningLine: l, isDraw: false };
    }
  }
  const isDraw = squares.every(Boolean);
  return { winner: null, winningLine: null, isDraw };
}

/**
 * PUBLIC_INTERFACE
 * Main App component for the Tic Tac Toe game.
 */
function App() {
  // Game State
  const [squares, setSquares] = useState([...EMPTY_BOARD]);
  const [isXNext, setIsXNext] = useState(true);
  const [history, setHistory] = useState([]);
  const { winner, winningLine, isDraw } = calculateWinner(squares);

  // UI State
  // (If future: support notifications, etc.)

  /**
   * PUBLIC_INTERFACE
   * Handles a move on the board.
   * @param {number} idx
   */
  function handleMove(idx) {
    if (squares[idx] || winner) return; // Ignore filled or after game ends
    const nextSquares = squares.slice();
    nextSquares[idx] = isXNext ? "X" : "O";
    setHistory((h) => [...h, squares]);
    setSquares(nextSquares);
    setIsXNext((prev) => !prev);
  }

  /**
   * PUBLIC_INTERFACE
   * Resets the game to start a new round.
   */
  function resetGame() {
    setHistory([]);
    setSquares([...EMPTY_BOARD]);
    setIsXNext(true);
  }

  /**
   * PUBLIC_INTERFACE
   * Moves back one step (if needed for undo; not exposed in UI here)
   */
  function undo() {
    if (history.length > 0) {
      const prev = history[history.length - 1];
      setSquares(prev);
      setHistory(history.slice(0, -1));
      setIsXNext((prev) => !prev);
    }
  }

  // Status line
  let status;
  if (winner) {
    status = (
      <span className="status-win">
        {`Player `}
        <span className={"player-icon player-" + winner}>{winner}</span>
        {" wins!"}
      </span>
    );
  } else if (isDraw) {
    status = <span className="status-draw">It's a draw!</span>;
  } else {
    status = (
      <span>
        Next:{" "}
        <span
          className={
            "player-icon player-" + (isXNext ? "X" : "O")
          }
        >
          {isXNext ? "X" : "O"}
        </span>
        {"'s turn"}
      </span>
    );
  }

  // Notification banner
  let notification = null;
  if (winner) {
    notification = (
      <div
        className="notification notification-win"
        role="status"
        aria-live="assertive"
      >
        🎉 Player{" "}
        <span className={"player-icon player-" + winner}>
          {winner}
        </span>{" "}
        wins!
      </div>
    );
  } else if (isDraw) {
    notification = (
      <div
        className="notification notification-draw"
        role="status"
        aria-live="assertive"
      >
        🤝 It's a draw!
      </div>
    );
  }

  // Board rendering
  function renderSquare(idx) {
    const highlight = winningLine && winningLine.includes(idx);
    return (
      <button
        key={idx}
        className={
          "square" +
          (squares[idx]
            ? " filled player-" + squares[idx]
            : "") +
          (highlight ? " highlight" : "")
        }
        onClick={() => handleMove(idx)}
        disabled={Boolean(squares[idx] || winner)}
        aria-label={`Cell ${idx % 3 + 1}, row ${Math.floor(
          idx / 3
        ) + 1}${squares[idx] ? ", filled " + squares[idx] : ""}${
          highlight ? ", part of win" : ""
        }`}
      >
        {squares[idx]}
      </button>
    );
  }

  // Controls below board
  const controls = (
    <div className="controls">
      <button className="btn btn-primary" onClick={resetGame}>
        Reset Game
      </button>
      {/* Future: add undo, etc */}
    </div>
  );

  // Main render layout
  return (
    <div className="ttt-app-root">
      <main className="ttt-game-container">
        <h1 className="ttt-title" aria-label="Tic Tac Toe">
          Tic Tac Toe
        </h1>
        <div className="ttt-status">{status}</div>
        {notification}
        <div className="ttt-board" role="grid" aria-label="Tic Tac Toe Board">
          {[0, 1, 2].map((row) => (
            <div className="ttt-row" role="row" key={row}>
              {[0, 1, 2].map((col) =>
                renderSquare(row * 3 + col)
              )}
            </div>
          ))}
        </div>
        {controls}
        <footer className="ttt-footer">
          <span>
            <a
              href="https://github.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="footer-link"
            >
              React Tic Tac Toe
            </a>
            &nbsp;|&nbsp;Modern, minimal, light theme
          </span>
        </footer>
      </main>
    </div>
  );
}

export default App;
