// Lista de palavras e pistas sobre anatomia
const theme = document.querySelector('#theme').textContent

const itensMatrix = {
  biologia: [
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
  ],
  quimica: [
    { word: 'hidrogênio', clue: 'Elemento químico mais abundante no universo, com símbolo H' },
    { word: 'oxigênio', clue: 'Elemento essencial para a respiração dos seres vivos, com símbolo O' },
    { word: 'carbono', clue: 'Elemento central na química orgânica, com símbolo C' },
    { word: 'sódio', clue: 'Elemento altamente reativo, encontrado em sal, com símbolo Na' },
    { word: 'cloro', clue: 'Elemento químico utilizado em desinfetantes e com símbolo Cl' },
    { word: 'potássio', clue: 'Elemento químico que atua no equilíbrio dos fluidos corporais, com símbolo K' },
    { word: 'ferro', clue: 'Metal usado na fabricação de aço, com símbolo Fe' },
    { word: 'ouro', clue: 'Metal precioso de cor amarela, com símbolo Au' },
    { word: 'álcool', clue: 'Composto orgânico que contém um grupo hidroxila (-OH)' },
    { word: 'nitrogênio', clue: 'Elemento que compõe 78% da atmosfera terrestre, com símbolo N' },
  ]
};

let itens = itensMatrix['quimica']
if (Object.keys(itensMatrix).includes(theme)) {
  itens = itensMatrix[theme]
}
// console.log(itens + ' = ' + Object.keys(itensMatrix).includes(theme) + ' ? ' + itensMatrix[theme] + ' : ' + itensMatrix[0])

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
function displayBoard(board, placedWords, canvas) {
  let wordCount = 1;

  board.forEach((row, y) => {  // Itera sobre a matriz
    row.forEach((char, x) => {
      if (char !== ' ') {  // Se for um caractere
        for (let word of placedWords) {
          if (word.x === x && word.y === y) {  // Se for a primeira letra da palavra
            const wordLabel = new fabric.Text(wordCount.toString(), {
              left: gridSize * y + 5,
              top: gridSize * x,
              fontSize: 16,
              fill: 'red',
            });
            canvas.add(wordLabel);  // Adiciona o número da palavra ao canvas
            wordCount++;
          }
        }


        // Desenha o contorno da célula
        const rect = new fabric.Rect({
          left: gridSize * y,
          top: gridSize * x,
          width: gridSize,
          height: gridSize,
          stroke: 'black',
          fill: 'transparent',
          strokeWidth: 2,
          lockMovementX: true,
          lockMovementY: true,
          hasControls: false,
          evented: true,
          selectable: false,
        });
        canvas.add(rect);  // Adiciona o contorno ao canvas

        // Desenha o caractere
        const TextBox = new fabric.Textbox(char, {
          left: gridSize * y + 15,
          top: gridSize * x,
          width: gridSize - 30,
          height: gridSize - 20,
          fontSize: 36,
          fill: 'black',
          editable: true,
          hasControls: false,
          backgroundColor: 'transparent', // Cor de fundo transparente
        });
        canvas.add(TextBox);  // Adiciona o caractere ao canvas
      } else {  // Se for um espaço em branco
        const rect = new fabric.Rect({ // Adiciona o espaço branco ao canvas
          left: gridSize * y,
          top: gridSize * x,
          width: gridSize,
          height: gridSize,
          fill: 'white',
          lockMovementX: true,
          lockMovementY: true,
          hasControls: false,
          selectable: false
        });
        canvas.add(rect);  // Adiciona o retângulo branco ao canvas
        // Adicionar um event listener ao canvas
      }
    });
  });
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
<canvas width="${gridSize * 10 + 5}" height="${gridSize * 10 + 5}" id="game-board">The game is loading or can't load on your browser.</canvas>
<p>Game Clues<p>
<ol id="game-clues"></ol>
`
const canvas = new fabric.Canvas(document.querySelector('#game-board'));
console.log(canvas)
canvas.hoverCursor = 'default'

const gameClues = document.querySelector('#game-clues')
displayBoard(board, placedWords, canvas);
appendClues(placedWords, gameClues); //exibe as dicas de acordo com as palavras colocadas

//Debugging
console.log(board)
console.log(placedWords)
