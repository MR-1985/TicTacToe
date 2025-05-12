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

// function handleClick(index) {
//   if (!checkIfFieldIsFree(index)) return;
//   setPlayerSymbol(index);
//   renderBoard();
//   checkIfSomeoneWon();
//   if (gameActive) {
//     checkWhoIsPlayer();
//   }
// };

function checkIfFieldIsFree(index) {
  return board[index] === "" && gameActive;
};

function setPlayerSymbol(index) {
  board[index] = currentPlayer;
};

function setBackgroundToCell(feld) {
  feld.classList.add('cell-color-afterclick');
};

function renderBoard() {
  clearBoardAndSetStatus();
  for (let index = 0; index < board.length; index++) {
    const feld = document.createElement("div");
    feld.className = "cell";

    setSymbol(feld, index);
    setClickFunctionToCell(feld, index);
    appendCellToBoard(feld);
  }
};

function clearBoardAndSetStatus() {
  boardElementRef.innerHTML = "";
  statusElementRef.textContent = currentPlayer + " du bist dran!";
};

function setSymbol(feld, index) {
  if (board[index] === "X") {
    feld.innerHTML = `<img src="${X_PATH}" alt="X" class="symbol">`;
  } else if (board[index] === "O") {
    feld.innerHTML = `<img src="${O_PATH}" alt="O" class="symbol">`;
  }
}

function setClickFunctionToCell(feld, index) {
  feld.addEventListener("click", function () {
    if (!checkIfFieldIsFree(index)) return;
    setPlayerSymbol(index);
    setSymbol(feld, index);        // Nur Symbol setzen
    setBackgroundToCell(feld);     // Zelle einfärben
    checkIfSomeoneWon();
    if (gameActive) {
      checkWhoIsPlayer();
    }
  });
}


function appendCellToBoard(feld) {
  boardElementRef.appendChild(feld);
}

function checkIfSomeoneWon() {
  if (checkPossibleLines()) {
    statusElementRef.textContent = currentPlayer + " hat gewonnen!";
    statusElementRef.classList.add('winner')
    animateWinningCells();
    gameActive = false;
    audioWin.play();
  } else {
    let allFieldsAreFull = true;

    for (let i = 0; i < board.length; i++) {
      if (board[i] === "") {
        allFieldsAreFull = false;
      }
    }

    if (allFieldsAreFull) {
      statusElementRef.textContent = "Unentschieden!";
      audioDraw.play();
      statusElementRef.classList.add('winner')
      gameActive = false;
    }
  }
};

function animateWinningCells() {
  const cells = document.querySelectorAll('.cell');
  cells.forEach(cell => {
    cell.classList.add('pulsate');
  });
}


function checkWhoIsPlayer() {
  currentPlayer = currentPlayer === "X" ? "O" : "X";
  statusElementRef.textContent = currentPlayer + " du bist dran!";
}

function checkPossibleLines() {
  const wins = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
  ];

  return wins.some(([a, b, c]) =>
    board[a] !== "" && board[a] === board[b] && board[b] === board[c]
  );
}

function resetGame() {
  board = ["", "", "", "", "", "", "", "", ""];
  currentPlayer = "X";
  gameActive = true;
  statusElementRef.textContent = currentPlayer + " du bist dran!";
  renderBoard();
  audioWin.currentTime = 0;
  audioWin.pause();
  audioDraw.currentTime = 0;
  audioDraw.pause();
  statusElementRef.classList.remove('winner')
}