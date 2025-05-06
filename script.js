let board = ["", "", "", "", "", "", "", "", ""];
let X_PATH = "img/X.png";
let O_PATH = "img/O.png";
let currentPlayer = "X";
let gameActive = true;

document.addEventListener("DOMContentLoaded", function () {
  renderBoard();
});

const boardElement = document.getElementById("game-board");
const statusElement = document.getElementById("status");

function handleClick(index) {
  if (board[index] !== "" || !gameActive) return;

  board[index] = currentPlayer;
  renderBoard();

  if (checkWinner()) {
    statusElement.textContent = currentPlayer + " hat gewonnen!";
    gameActive = false;
    return;
  }

  if (board.every(cell => cell !== "")) {
    statusElement.textContent = "Unentschieden!";
    gameActive = false;
    return;
  }

  currentPlayer = currentPlayer === "X" ? "O" : "X";
  statusElement.textContent = currentPlayer + " du bist dran!";
}

function renderBoard() {
  boardElement.innerHTML = "";

  for (let index = 0; index < board.length; index++) {
    let feld = document.createElement("div");
    feld.className = "cell";

    if (board[index] === "X") {
      feld.innerHTML = `<img src="${X_PATH}" alt="X" class="symbol">`;
    } else if (board[index] === "O") {
      feld.innerHTML = `<img src="${O_PATH}" alt="O" class="symbol">`;
    }

    feld.addEventListener("click", function () {
      handleClick(index);
    });

    boardElement.appendChild(feld);
  }
}

function checkWinner() {
  const wins = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // Reihen
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // Spalten
    [0, 4, 8], [2, 4, 6]             // Diagonalen
  ];

  return wins.some(([a, b, c]) =>
    board[a] !== "" && board[a] === board[b] && board[b] === board[c]
  );
}

function resetGame() {
  board = ["", "", "", "", "", "", "", "", ""];
  currentPlayer = "X";
  gameActive = true;
  statusElement.textContent = currentPlayer + " du bist dran!";
  renderBoard();
}
