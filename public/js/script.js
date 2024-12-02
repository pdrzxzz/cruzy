// Lista de palavras e pistas sobre anatomia
const itens = [
  { word: 'coração', clue: 'Órgão responsável por bombear sangue pelo corpo' },
  { word: 'fêmur', clue: 'Osso da coxa' },
  { word: 'cérebro', clue: 'Órgão responsável pelas funções mentais' },
  { word: 'artéria', clue: 'Vaso sanguíneo que leva o sangue do coração' },
  { word: 'veia', clue: 'Vaso sanguíneo que leva o sangue de volta ao coração' },
  { word: 'pulmão', clue: 'Órgão responsável pela troca gasosa no corpo' },
  { word: 'rins', clue: 'Órgãos responsáveis pela filtragem do sangue' },
  { word: 'ossos', clue: 'Estruturas que formam o esqueleto' },
  { word: 'músculos', clue: 'Tecidos que permitem o movimento do corpo' },
  { word: 'nervos', clue: 'Estruturas que transmitem sinais do cérebro para o corpo' },
];

// Função para criar o tabuleiro de palavras cruzadas
function createCrossword(itens) {
  const size = 10; // Tamanho do tabuleiro 10x10
  const board = Array.from({ length: size }, () => Array(size).fill(' '));

  // Função para inserir uma palavra no tabuleiro
  function placeWord(word, x, y, direction, clue) {
    // direction: 'horizontal' ou 'vertical'
    for (let i = 0; i < word.length; i++) {
      if (direction === 'horizontal') {
        board[y][x + i] = word[i];
      } else if (direction === 'vertical') {
        board[y + i][x] = word[i];
      }
    }
  }

  // Função para verificar se uma palavra pode ser colocada no tabuleiro
  function canPlaceWord(word, x, y, direction) {
    for (let i = 0; i < word.length; i++) {
      if (direction === 'horizontal') {
        if (x + i >= size || board[y][x + i] !== ' ' && board[y][x + i] !== word[i]) {
          return false;
        }
      } else if (direction === 'vertical') {
        if (y + i >= size || board[y + i][x] !== ' ' && board[y + i][x] !== word[i]) {
          return false;
        }
      }
    }
    return true;
  }

  // Tenta colocar as palavras no tabuleiro
  let placedWords = [];
  for (const item of itens) {
    ({ word, clue } = item);
    let placed = false;
    while (!placed) {
      const x = Math.floor(Math.random() * size);
      const y = Math.floor(Math.random() * size);
      const direction = Math.random() > 0.5 ? 'horizontal' : 'vertical';

      if (canPlaceWord(item.word, x, y, direction)) {
        placeWord(item.word, x, y, direction);
        placedWords.push({ word, x, y, direction, clue });
        placed = true;
      }
    }
  }

  return { board, placedWords };
}

const gridSize = 50;
// Função para exibir o tabuleiro
function displayBoard(board, placedWords, ctx) {
  let wordCount = 1;
  board.forEach((row, y) => {
    row.forEach((char, x) => {
      if (char != ' ') {
        for (let word of placedWords) {
          if (word.x === x && word.y === y) { //if first letter of the word
            ctx.font = "16px serif";
            ctx.fillStyle = "rgb(255 0 0)"; //red
            ctx.fillText(wordCount++, gridSize * y + 5, gridSize * (x + 1) - 35); //NOT THE BEST DESIGN APPROACH
          }
        }
        ctx.font = "36px serif";
        ctx.fillStyle = "rgb(0 0 0)"; //black
        ctx.strokeRect(gridSize * y, gridSize * x, gridSize, gridSize)
        ctx.fillText(char, gridSize * y + 15, gridSize * (x + 1) - 10); //NOT THE BEST DESIGN APPROACH
      }
      else { //Whitespace
        ctx.fillStyle = "rgb(255 255 255)"; //white
        ctx.fillRect(gridSize * y, gridSize * x, gridSize, gridSize)
      }
    })
  })
}

// Função para exibir as pistas
function appendClues(placedWords, ul) {
  placedWords.forEach(entry => {
    const newLi = document.createElement('li');
    newLi.innerHTML = `${entry.clue} (${entry.direction}) - Posição: (${entry.x}, ${entry.y})`
    ul.append(newLi)
  });
}


// Chama a função para gerar o tabuleiro de palavras cruzadas
const { board, placedWords } = createCrossword(itens);

const container = document.querySelector('#game-container')
container.innerHTML = `
<canvas width="${gridSize * 10}" height="${gridSize * 10}" id="game-board">The game is loading or can't load on your browser.</canvas>
<p>Game Clues<p>
<ol id="game-clues"></ol>
`
const gameCanvas = document.querySelector('#game-board')
const ctx = gameCanvas.getContext("2d") //Canvas context 

const gameClues = document.querySelector('#game-clues')
displayBoard(board, placedWords, ctx);
appendClues(placedWords, gameClues); //exibe as dicas de acordo com as palavras colocadas
console.log(board)
console.log(placedWords)

gameCanvas.addEventListener('click', (event) => {
  console.log(event)
})