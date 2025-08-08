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
const audioLost = new Audio('sound/lost.mp3');  // Neu: Sound für Spielerverlust
audioLost.volume = 0.3;

// Function for handling clicks
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

    currentPlayer = "X"; // Spieler ist immer X
    setPlayerSymbol(index);        // setzt board[index] = X
    setSymbol(feld, index);        // X auf Spielfeld
    setBackgroundToCell(feld);     // Farbe setzen
    checkIfSomeoneWon();

    if (gameActive) {
      statusElementRef.textContent = "O denkt...";
      setTimeout(() => {
        computerPlay();
      }, 1000); // kleine Pause vor PC-Zug
    }
  });
}


function appendCellToBoard(feld) {
  boardElementRef.appendChild(feld);
}

function checkIfSomeoneWon() {
  if (checkPossibleLines()) {
    statusElementRef.textContent = currentPlayer + " hat gewonnen!";
    statusElementRef.classList.add('winner');
    gameActive = false;

    if (currentPlayer === "X") {
      audioWin.play();           // Spieler gewinnt
      animateWinningCells();     // Nur dann Animation
    } else {
      audioLost.play();          // PC gewinnt – keine Animation
    }

  } else {
    let allFieldsAreFull = board.every(feld => feld !== "");

    if (allFieldsAreFull) {
      statusElementRef.textContent = "Unentschieden!";
      audioDraw.play();
      statusElementRef.classList.add('winner');
      gameActive = false;
    }
  }
}


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

function computerPlay() {
  if (!gameActive) return;

  const makeMistake = Math.random() < 0.25; // 25% Fehlerchance
  let moveIndex;

  if (!makeMistake) {
    const winningMove = findCriticalMove("O");
    if (winningMove !== null) {
      moveIndex = winningMove;
    } else {
      const blockMove = findCriticalMove("X");
      if (blockMove !== null) {
        moveIndex = blockMove;
      }
    }
  }

  if (moveIndex === undefined) {
    const available = board.map((val, i) => val === "" ? i : null).filter(i => i !== null);
    moveIndex = available[Math.floor(Math.random() * available.length)];
  }

  // 💥 FEHLTE BISHER:
  currentPlayer = "O"; // Damit checkIfSomeoneWon() richtig funktioniert

  board[moveIndex] = "O";
  const feld = document.getElementsByClassName('cell')[moveIndex];
  setSymbol(feld, moveIndex);
  setBackgroundToCell(feld);
  checkIfSomeoneWon();

  if (gameActive) {
    currentPlayer = "X";
    statusElementRef.textContent = "X du bist dran!";
  }
}

function findCriticalMove(player) {
  const winCombos = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6],
  ];

  for (let combo of winCombos) {
    const [a, b, c] = combo;
    const values = [board[a], board[b], board[c]];
    const countPlayer = values.filter(v => v === player).length;
    const countEmpty = values.filter(v => v === "").length;

    if (countPlayer === 2 && countEmpty === 1) {
      return [a, b, c].find(i => board[i] === "");
    }
  }

  return null;
}


// Hilfsfunktion: finde, ob Spieler (X) fast gewonnen hätte
function findBlockingMove(player) {
  const winCombos = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6],
  ];

  for (let combo of winCombos) {
    const [a, b, c] = combo;
    const values = [board[a], board[b], board[c]];
    const countPlayer = values.filter(v => v === player).length;
    const countEmpty = values.filter(v => v === "").length;

    if (countPlayer === 2 && countEmpty === 1) {
      const emptyIndex = [a, b, c].find(i => board[i] === "");
      return emptyIndex;
    }
  }
  return null;
}

function findStrategicMove(player) {
  const wins = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
  ];

  for (let [a, b, c] of wins) {
    const line = [board[a], board[b], board[c]];
    if (line.filter(v => v === player).length === 2 && line.includes("")) {
      return [a, b, c][line.indexOf("")];
    }
  }
  return -1;
}

function makeComputerMove(index) {
  board[index] = "O"; // explizit setzen
  const cell = document.getElementsByClassName('cell')[index];
  setSymbol(cell, index);
  setBackgroundToCell(cell);
  checkIfSomeoneWon();

  if (gameActive) {
    currentPlayer = "X";
    statusElementRef.textContent = currentPlayer + " du bist dran!";
  }
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
  statusElementRef.classList.remove('winner');
}
