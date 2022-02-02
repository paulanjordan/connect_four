const WIDTH = 7;
const HEIGHT = 6;


let currPlayer = 1; // active player: 1 or 2
let board = []; // array of rows, each row is array of cells  (board[y][x])


//create in-JS board structure:
//set "board" to empty HEIGHT x WIDTH matrix array
function makeBoard() {
  for (let y = 0; y < HEIGHT; y++) {
    board.push(Array.from({ length: WIDTH }));
  }
}


//makeHtmlBoard: make HTML table and row of column tops
//set the board variable to the HTML board DOM node
function makeHtmlBoard() {
  const board = document.getElementById("board");

  //creates top row and cells of game that demarcate where you drop game piece 
  const top = document.createElement("tr");
  top.setAttribute("id", "column-top");
  top.addEventListener("click", handleClick);

  for (let x = 0; x < WIDTH; x++) {
    const headCell = document.createElement("td");
    headCell.setAttribute("id", x);
    top.append(headCell);
  }
  board.append(top);

  //creates remaining rows and cells of game board where peices land
  for (let y = 0; y < HEIGHT; y++) {
    const row = document.createElement("tr");
    for (let x = 0; x < WIDTH; x++) {
      const cell = document.createElement("td");
      cell.setAttribute("id", `${y}-${x}`);
      row.append(cell);
    }
    board.append(row);
  }
}


//findSpotForCol: given column x, return top empty y (null if filled)
function findSpotForCol(x) {
  for (let y = HEIGHT - 1; y >= 0; y--) {
    if (!board[y][x]) {
      return y;
    }
  }
  return null;
}


//placeInTable: update DOM to place piece into HTML table of board
function placeInTable(y, x) {
  //makes a div and inserts into correct table cell
  const playerPiece = document.createElement("div")
  playerPiece.classList.add('piece')
  playerPiece.classList.add(`player${currPlayer}`)

  const play = document.getElementById(`${y}-${x}`);
  play.append(playerPiece);
}

//endGame: announce game end
function endGame(msg) {
  //pop up alert message
  alert(msg);
}

//handleClick: handle click of column top to play piece 
function handleClick(evt) {
  // get x from ID of clicked cell
  const x = evt.target.id;

  //get next spot in column (if none, ignore click)
  const y = findSpotForCol(x);
  if (y === null) {
    return;
  }

  //place piece in board and add to HTML table
  //updates in-memory board
  placeInTable(y, x);
  board[y][x] = currPlayer;

  //check for win
  if (checkForWin()) {
    return endGame(`Player ${currPlayer} won!`);
  }

  //check for tie
  //checks if all cells in board are filled; if so call, call endGame
  if (board.every(row => row.every(cell => cell))) {
    return endGame('Tie!');
  }

  //switch players
  currPlayer = currPlayer === 1 ? 2 : 1;
}



//checkForWin: check board cell-by-cell for "does a win start here?"
function checkForWin() {
  function _win(cells) {
    // Check four cells to see if they're all color of current player
    //  - cells: list of four (y, x) cells
    //  - returns true if all are legal coordinates & all match currPlayer

    return cells.every(
      ([y, x]) =>
        y >= 0 &&
        y < HEIGHT &&
        x >= 0 &&
        x < WIDTH &&
        board[y][x] === currPlayer
    );
  }

  //TODO: read and understand this code. Add comments to help you.
  //searches for cells that are adjacent to each other, either horizontal/vertical/diagonal
  for (var y = 0; y < HEIGHT; y++) {
    for (var x = 0; x < WIDTH; x++) {
      var horiz = [[y, x], [y, x + 1], [y, x + 2], [y, x + 3]];
      var vert = [[y, x], [y + 1, x], [y + 2, x], [y + 3, x]];
      var diagDR = [[y, x], [y + 1, x + 1], [y + 2, x + 2], [y + 3, x + 3]];
      var diagDL = [[y, x], [y + 1, x - 1], [y + 2, x - 2], [y + 3, x - 3]];

      if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) {
        return true;
      }
    }
  }
}

makeBoard();
makeHtmlBoard();
