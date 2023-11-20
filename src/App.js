import { useState } from 'react';

function Square({ value, onSquareClick, isWinningSquare }) {
  let winningSquareClass = isWinningSquare ? "winning-square" : "";
  return (
    <button className={"square " + winningSquareClass} onClick={onSquareClick}>
      {value}
    </button>
  );
}

function Board({ xIsNext, squares, onPlay }) {
  function handleClick(i) {
    if (getWinningSquares(squares).length || squares[i]) {
      return;
    }
    const nextSquares = squares.slice();
    if (xIsNext) {
      nextSquares[i] = 'X';
    } else {
      nextSquares[i] = 'O';
    }
    onPlay(nextSquares);
  }
  const winningSquares = getWinningSquares(squares)
  const winner = winningSquares.length ? squares[winningSquares[0]] : null;
  const gameOver = winner || squares.every((square) => !!square);
  let status;
  const board = [];
  if (winner) {
    status = 'Winner: ' + winner;
  } else if (gameOver) {
    status = 'Result: Draw';
  } else {
    status = 'Next player: ' + (xIsNext ? 'X' : 'O');
  }

  for(let row = 0; row < 3; row++) {
    const board_row = [];
    for(let col = 0; col < 3; col++) {
      let i = row * 3 + col;
      board_row.push(
        <Square value={squares[i]} onSquareClick={() => handleClick(i)} 
          isWinningSquare={winningSquares.includes(i)}/>
      );
    }
    board.push(<div className="board-row">{board_row}</div>);
  }

  return (
    <>
      <div className="status">{status}</div>
      {board}
    </>
  );
}

export default function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const [historySortAsc, setHistorySortAsc] = useState(true);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];

  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  function onHistorySortToggle() {
    setHistorySortAsc(!historySortAsc);
  }

  const moves = history.map((squares, move) => {
    let description = move === currentMove ? "You are at " : "Go to ";
    let entry;
    if (move === 0) {
      description += 'game start';
    } else {
      let squaresPrev = history[move-1];
      let coords = getCoordinatesOfFirstDifferingSquare(squares, squaresPrev);
      description += `move #${move} at (${coords[0] + 1}, ${coords[1] + 1})`; 
    }
    if (move === currentMove) {
      entry = description;
    } else {
      entry = <button onClick={() => jumpTo(move)}>{description}</button>;
    }
    return (
      <li key={move}>
        {entry}
      </li>
    );
  });

  if (!historySortAsc) {
    moves.reverse();
  }

  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div className="game-info">
        <button onClick={onHistorySortToggle}>
          Show move history in {historySortAsc ? "des" : "as"}cending order
        </button>
        <ul>{moves}</ul>
      </div>
    </div>
  );
}

function getWinningSquares(squares) {
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
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return lines[i];
    }
  }
  return [];
}

function getCoordinatesOfFirstDifferingSquare(squares1, squares2) {
    for(let row = 0; row < 3; row++) {
      for(let col = 0; col < 3; col++) {
        let i = row * 3 + col;
        if (squares1[i] !== squares2[i]) {
          return [row, col];
        }
      }
    }
  return null;
}
