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
    ({word, clue} = item);
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

// Função para exibir o tabuleiro
function appendRows(rows, gameBoard) {
  for (let row of rows) {
    const gameRow = document.createElement('p')
    gameRow.innerHTML = `${row.join(' ')}`
    gameBoard.append(gameRow)
  }
}

// Função para exibir as pistas
function appendClues(placedWords, ul) {
  placedWords.forEach(entry => {
    const newLi = document.createElement('li');
    newLi.innerHTML = `${entry.clue} (${entry.direction}) - Posição: (${entry.x}, ${entry.y})`
    ul.append(newLi)
  });
}

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

// Chama a função para gerar o tabuleiro de palavras cruzadas
const { board, placedWords } = createCrossword(itens);

const container = document.querySelector('#game-container')
container.innerHTML = `
<div id="game-board"></div>
<p>Game Clues<p>
<ol id="game-clues"></ol>
`
const gameBoard = document.querySelector('#game-board')
const gameClues = document.querySelector('#game-clues')
appendRows(board, gameBoard);
appendClues(placedWords, gameClues); //exibe as dicas de acordo com as palavras colocadas
