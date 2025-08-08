let board = ["", "", "", "", "", "", "", "", ""];
let X_PATH = "img/X2.png";
let O_PATH = "img/O2.png";
let currentPlayer = "X";
let gameActive = true;

const boardElementRef = document.getElementById("game-board");
const statusElementRef = document.getElementById("status");

const audioWin = new Audio('sound/win.mp3');
audioWin.volume = 0.2;

const audioDraw = new Audio('sound/draw.mp3');
audioDraw.volume = 0.4;

const audioLost = new Audio('sound/lost.mp3');
audioLost.volume = 0.3;

renderBoard();

function renderBoard() {
  clearBoardAndSetStatus();
  for (let index = 0; index < board.length; index++) {
    const feld = document.createElement("div");
    feld.className = "cell";
    setSymbol(feld, index);
    setClickFunctionToCell(feld, index);
    boardElementRef.appendChild(feld);
  }
}

function clearBoardAndSetStatus() {
  boardElementRef.innerHTML = "";
  statusElementRef.textContent = currentPlayer + " du bist dran!";
  statusElementRef.classList.remove('winner');
}

function setSymbol(feld, index) {
  if (board[index] === "X") {
    feld.innerHTML = `<img src="${X_PATH}" alt="X" class="symbol">`;
  } else if (board[index] === "O") {
    feld.innerHTML = `<img src="${O_PATH}" alt="O" class="symbol">`;
  }
}

function setClickFunctionToCell(feld, index) {
  feld.addEventListener("click", function () {
    if (board[index] !== "" || !gameActive) return;

    currentPlayer = "X";
    board[index] = currentPlayer;
    setSymbol(feld, index);
    feld.classList.add('cell-color-afterclick');
    checkIfSomeoneWon();

    if (gameActive) {
      statusElementRef.textContent = "O denkt...";
      setTimeout(computerPlay, 800);
    }
  });
}

function checkIfSomeoneWon() {
  const wins = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
  ];

  const isWin = wins.some(([a, b, c]) =>
    board[a] !== "" && board[a] === board[b] && board[b] === board[c]
  );

  if (isWin) {
    statusElementRef.textContent = currentPlayer + " hat gewonnen!";
    statusElementRef.classList.add('winner');
    gameActive = false;

    if (currentPlayer === "X") {
      audioWin.play();
      animateWinningCells();
    } else {
      audioLost.play();
    }
    return;
  }

  if (board.every(feld => feld !== "")) {
    statusElementRef.textContent = "Unentschieden!";
    statusElementRef.classList.add('winner');
    audioDraw.play();
    gameActive = false;
  }
}

function animateWinningCells() {
  document.querySelectorAll('.cell').forEach(cell =>
    cell.classList.add('pulsate')
  );
}

function computerPlay() {
  if (!gameActive) return;

  const makeMistake = Math.random() < 0.25;
  let moveIndex;

  if (!makeMistake) {
    moveIndex = findCriticalMove("O") ?? findCriticalMove("X");
  }

  if (moveIndex === undefined) {
    const freeFields = board.map((v, i) => v === "" ? i : null).filter(i => i !== null);
    moveIndex = freeFields[Math.floor(Math.random() * freeFields.length)];
  }

  currentPlayer = "O";
  board[moveIndex] = currentPlayer;

  const feld = document.getElementsByClassName('cell')[moveIndex];
  setSymbol(feld, moveIndex);
  feld.classList.add('cell-color-afterclick');
  checkIfSomeoneWon();

  if (gameActive) {
    currentPlayer = "X";
    statusElementRef.textContent = "X du bist dran!";
  }
}

function findCriticalMove(player) {
  const wins = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
  ];

  for (let [a, b, c] of wins) {
    const values = [board[a], board[b], board[c]];
    const countPlayer = values.filter(v => v === player).length;
    const countEmpty = values.filter(v => v === "").length;
    if (countPlayer === 2 && countEmpty === 1) {
      return [a, b, c].find(i => board[i] === "");
    }
  }

  return null;
}

function resetGame() {
  board = ["", "", "", "", "", "", "", "", ""];
  currentPlayer = "X";
  gameActive = true;
  audioWin.pause(); audioWin.currentTime = 0;
  audioDraw.pause(); audioDraw.currentTime = 0;
  audioLost.pause(); audioLost.currentTime = 0;
  renderBoard();
}
