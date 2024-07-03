const cells = document.querySelectorAll('.cell');
const messageEl = document.getElementById('message');
const turnIndicatorEl = document.getElementById('turn-indicator');
const restartButton = document.getElementById('restartButton');
const opponentSelect = document.getElementById('opponentSelect');

let currentPlayer = 'X';
let gameOver = false;
let gameBoard = [null, null, null, null, null, null, null, null, null];

function handleCellClick(event) {
  const clickedCell = event.target;
  const cellIndex = clickedCell.dataset.index;

  if (!gameOver && gameBoard[cellIndex] === null) {
    gameBoard[cellIndex] = currentPlayer;
    clickedCell.textContent = currentPlayer;

    if (checkWinner()) {
      gameOver = true;
      messageEl.textContent = `${currentPlayer} Wins!`;
      highlightWinningCells();
    } else if (checkTie()) {
      gameOver = true;
      messageEl.textContent = "It's a Tie!";
    } else {
      currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
      turnIndicatorEl.textContent = `${currentPlayer}'s Turn!`;

      if (opponentSelect.value === 'ai' && currentPlayer === 'O' && !gameOver) {
        setTimeout(makeAIMove, 500);
      }
    }
  }
}

function checkWinner() {
  const winningConditions = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  for (let condition of winningConditions) {
    const [a, b, c] = condition;
    if (gameBoard[a] && gameBoard[a] === gameBoard[b] && gameBoard[a] === gameBoard[c]) {
      return condition;
    }
  }
  return false;
}

function checkTie() {
  return gameBoard.every(cell => cell !== null);
}

function makeAIMove() {
  for (let i = 0; i < gameBoard.length; i++) {
    if (gameBoard[i] === null) {
      const tempBoard = [...gameBoard];
      tempBoard[i] = 'O';

      if (checkWinnerWithBoard(tempBoard)) {
        gameBoard[i] = 'O';
        cells[i].textContent = 'O';
        finalizeMove();
        return;
      }
    }
  }

  for (let i = 0; i < gameBoard.length; i++) {
    if (gameBoard[i] === null) {
      const tempBoard = [...gameBoard];
      tempBoard[i] = 'X';

      if (checkWinnerWithBoard(tempBoard)) {
        gameBoard[i] = 'O';
        cells[i].textContent = 'O';
        finalizeMove();
        return;
      }
    }
  }

  const emptyCells = gameBoard.map((cell, index) => cell === null ? index : null).filter(index => index !== null);
  const randomIndex = Math.floor(Math.random() * emptyCells.length);
  const randomEmptyCell = emptyCells[randomIndex];
  gameBoard[randomEmptyCell] = 'O';
  cells[randomEmptyCell].textContent = 'O';
  finalizeMove();
}

function checkWinnerWithBoard(board) {
  const winningConditions = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  for (let condition of winningConditions) {
    const [a, b, c] = condition;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return true;
    }
  }
  return false;
}

function finalizeMove() {
  if (checkWinner()) {
    gameOver = true;
    messageEl.textContent = `${currentPlayer} Wins!`;
    highlightWinningCells();
  } else if (checkTie()) {
    gameOver = true;
    messageEl.textContent = "It's a Tie!";
  } else {
    currentPlayer = 'X';
    turnIndicatorEl.textContent = `${currentPlayer}'s Turn!`;
  }
}

function highlightWinningCells() {
  const winningCondition = checkWinner();
  if (winningCondition) {
    for (let index of winningCondition) {
      cells[index].classList.add('highlight');
    }
  }
}

function restartGame() {
  currentPlayer = 'X';
  gameOver = false;
  gameBoard = [null, null, null, null, null, null, null, null, null];
  cells.forEach(cell => {
    cell.textContent = '';
    cell.classList.remove('highlight');
  });
  messageEl.textContent = 'Welcome to Tic-Tac-Toe!';
  turnIndicatorEl.textContent = `${currentPlayer}'s Turn!`;
}

cells.forEach(cell => cell.addEventListener('click', handleCellClick));
restartButton.addEventListener('click', restartGame);
