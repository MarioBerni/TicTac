let board = ['','','','','','','','',''];
let currentPlayer = 'X'; // 'X' o 'O'
let opponent = 'computer'; // 'computer' or 'human'
let turnDisplay = document.getElementById('turn');
let cells = Array.from(document.querySelectorAll('.cell'));
let namesInput = document.getElementById('names-input');
let player1NameInput = document.getElementById('player1-name');
let player2NameInput = document.getElementById('player2-name');
let winnerMessage = document.getElementById('winner-message');
let opponentSelect = document.getElementById('opponent-select');
let winArrays = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6]
];

opponentSelect.addEventListener('change', function() {
  opponent = this.value;
  resetBoard();
  namesInput.style.display = 'flex';
  player2NameInput.placeholder = opponent === 'human' ? 'Nombre jugador 2 (O)' : 'Computadora';
  player2NameInput.value = opponent === 'human' ? '' : 'Computadora';
  player2NameInput.disabled = opponent === 'computer';
});

document.getElementById('reset-button').addEventListener('click', function() {
  resetBoard();
});

cells.forEach(function(cell) {
  cell.addEventListener('click', function() {
    let cellIndex = this.getAttribute('data-cell-index');

    if (board[cellIndex] !== '' || checkWin('X') || checkWin('O')) {
      return;
    }

    let player1 = player1NameInput.value.trim();
    let player2 = player2NameInput.value.trim();

    if (player1 === '' || player2 === '') {
      winnerMessage.innerText = 'Por favor ingrese el nombre del jugador';
      return;
    } else {
      winnerMessage.innerText = '';
    }

    board[cellIndex] = currentPlayer;
    this.innerText = currentPlayer;
    this.classList.add(currentPlayer.toLowerCase());

    if (checkWin(currentPlayer)) {
      winnerMessage.innerText = `¡${currentPlayer === 'X' ? player1 : player2} ha ganado!`;
      highlightWinningLine();
      setTimeout(resetBoard, 3000);
    } else if (checkDraw()) {
      winnerMessage.innerText = '¡Empate!';
      setTimeout(resetBoard, 3000);
    } else {
      currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
      turnDisplay.innerText = `Turno de: ${currentPlayer === 'X' ? player1 : player2}`;

      if (opponent === 'computer' && currentPlayer === 'O') {
        computerPlay();
      }
    }
  });
});

function resetBoard() {
  board = ['','','','','','','','',''];
  currentPlayer = 'X';
  turnDisplay.innerText = '';
  cells.forEach(function(cell) {
    cell.innerText = '';
    cell.classList.remove('x');
    cell.classList.remove('o');
    cell.classList.remove('highlight');
  });
  player1NameInput.value = '';
  player2NameInput.value = '';
  player2NameInput.placeholder = 'Nombre jugador 2 (O o \'Computadora\')';
  winnerMessage.innerText = '';
}

function checkWin(player) {
  return winArrays.some(combination =>
    combination.every(index => board[index] === player)
  );
}

function checkDraw() {
  return board.every(cell => cell !== '');
}

function highlightWinningLine() {
  let winningCombination = winArrays.find(combination =>
    combination.every(index => board[index] === currentPlayer)
  );
  for (let index of winningCombination) {
    cells[index].classList.add('highlight');
  }
}

function computerPlay() {
  setTimeout(function() {
    let bestScore = -Infinity;
    let move;
    for (let i = 0; i < 9; i++) {
      if (board[i] == '') {
        board[i] = 'O';
        let score = minimax(board, 0, false);
        board[i] = '';
        if (score > bestScore) {
          bestScore = score;
          move = i;
        }
      }
    }
    cells[move].click();
  }, 500);
}

function minimax(board, depth, isMaximizing) {
  if (checkWin('O')) {
    return 1;
  }
  if (checkWin('X')) {
    return -1;
  }
  if (checkDraw()) {
    return 0;
  }

  if (isMaximizing) {
    let bestScore = -Infinity;
    for (let i = 0; i < 9; i++) {
      if (board[i] == '') {
        board[i] = 'O';
        let score = minimax(board, depth + 1, false);
        board[i] = '';
        bestScore = Math.max(score, bestScore);
      }
    }
    return bestScore;
  } else {
    let bestScore = Infinity;
    for (let i = 0; i < 9; i++) {
      if (board[i] == '') {
        board[i] = 'X';
        let score = minimax(board, depth + 1, true);
        board[i] = '';
        bestScore = Math.min(score, bestScore);
      }
    }
    return bestScore;
  }
}
