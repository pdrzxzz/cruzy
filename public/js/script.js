
class Game {
  // Função para criar o tabuleiro de palavras cruzadas
  constructor(themeArray) {
    this.size = 10;
    this.board = Array.from({ length: this.size }, () => Array(this.size).fill(' '));
    this.themeArray = themeArray;
    this.placedWords = [];
    this.gridSize = 50;
    this.createCrossword();
    this.displayGame();
  }

  createCrossword() {
    // Tenta colocar as palavras no tabuleiro
    for (const item of this.themeArray) {
      let { word, clue } = item;
      let placed = false;
      while (!placed) {
        const x = Math.floor(Math.random() * this.size);
        const y = Math.floor(Math.random() * this.size);
        const direction = Math.random() > 0.5 ? 'horizontal' : 'vertical';

        if (this.canPlaceWord(item.word, x, y, direction)) {
          this.placeWord(item.word, x, y, direction);
          this.placedWords.push({ word, x, y, direction, clue });
          placed = true;
        }
      }
    }
  }

  // Função para inserir uma palavra no tabuleiro
  placeWord(word, x, y, direction) {
    // direction: 'horizontal' ou 'vertical'
    for (let i = 0; i < word.length; i++) {
      if (direction === 'horizontal') {
        // console.log(`Colocando ${word[i]} na posição (${x+i}, ${y})`)
        this.board[y][x + i] = word[i];
      } else if (direction === 'vertical') {
        // console.log(`Colocando ${word[i]} na posição (${x}, ${y+i})`)
        this.board[y + i][x] = word[i];
      }
    }
  }

  // Função para verificar se uma palavra pode ser colocada no tabuleiro
  canPlaceWord(word, x, y, direction) {
    for (let i = 0; i < word.length; i++) {
      if (direction === 'horizontal') {
        if (x + i >= this.size || this.board[y][x + i] !== ' ' && this.board[y][x + i] !== word[i]) {
          return false;
        }
      } else if (direction === 'vertical') {
        if (y + i >= this.size || this.board[y + i][x] !== ' ' && this.board[y + i][x] !== word[i]) {
          return false;
        }
      }
    }
    return true;
  }

  displayBoard(canvas) {
    let wordCount = 1;

    this.board.forEach((row, y) => {  // Itera sobre a matriz
      row.forEach((char, x) => {
        if (char !== ' ') {  // Se for um caractere
          for (let word of this.placedWords) {
            if (word.x === x && word.y === y) {  // Se for a primeira letra da palavra
              const wordLabel = new fabric.Text(wordCount.toString(), {
                left: this.gridSize * y + 5,
                top: this.gridSize * x,
                fontSize: 16,
                fill: 'red',
              });
              canvas.add(wordLabel);  // Adiciona o número da palavra ao canvas
              wordCount++;
            }
          }

          // Desenha o contorno da célula
          const rect = new fabric.Rect({
            left: this.gridSize * y,
            top: this.gridSize * x,
            width: this.gridSize,
            height: this.gridSize,
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
            left: this.gridSize * y + 15,
            top: this.gridSize * x,
            width: this.gridSize - 30,
            height: this.gridSize - 20,
            fontSize: 36,
            fill: 'black',
            editable: true,
            hasControls: false,
            backgroundColor: 'transparent', // Cor de fundo transparente
          });
          canvas.add(TextBox);  // Adiciona o caractere ao canvas
        } else {  // Se for um espaço em branco
          const rect = new fabric.Rect({ // Adiciona o espaço branco ao canvas
            left: this.gridSize * y,
            top: this.gridSize * x,
            width: this.gridSize,
            height: this.gridSize,
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
  displayClues(ol) {
    this.placedWords.forEach(entry => {
      const newLi = document.createElement('li');
      newLi.innerHTML = `${entry.clue} (${entry.direction}) - Posição: (${entry.x}, ${entry.y})`
      ol.append(newLi)
    });
  }

  displayGame() {
    const container = document.querySelector('#game-container')
    container.innerHTML = `
        <canvas width="${this.gridSize * 10 + 5}" height="${this.gridSize * 10 + 5}" id="game-board">The game is loading or can't load on your browser.</canvas>
        <p>Game Clues<p>
        <ol id="game-clues"></ol>
        `
    const canvas = new fabric.Canvas(document.querySelector('#game-board'));
    canvas.hoverCursor = 'default'
    this.displayBoard(canvas);
    this.displayClues(document.querySelector('#game-clues')); //exibe as dicas de acordo com as palavras colocada
  }
}

const game = new Game(themeArray)

//Debugging
console.log('themeArray: ', game.themeArray)
console.log('board: ', game.board)
console.log('canvas: ', game.canvas)
console.log('game.placedWords: ', game.placedWords)
