class Game {
  constructor(themeArray) {
    this.maxWordLength = Math.max(...themeArray.map(item => item.word.length)); //Tamanho da maior palavra
    this.size = Math.ceil(Math.sqrt(themeArray.length * this.maxWordLength)); // Tamanho inicial
    this.gridSize = 50; //Tamanho de cada bloquinho
    this.canvasSize = this.gridSize * this.size + 5; //Tamanho inicial do canvas
    this.board = Array.from({ length: this.size }, () => Array(this.size).fill(' ')); //Matrix inicial do tabuleiro
    this.themeArray = themeArray; //Array de objetos que contém {word: clue}
    this.placedWords = []; //Array para guardar informação da posição em que foi colocada cada palavra 
    this.createCrossword(); //Cria o caça palavras, preenche this.board e this.placedWords
    this.displayGame(); //Exibe o jogo na tela
  }

  createCrossword() {
    // Tentando colocar as palavras, ajustando o tabuleiro se necessário
    let placedAllWords = false;

    while (!placedAllWords) {
      placedAllWords = true;
      for (const item of this.themeArray) {
        let { word, clue } = item;
        let placed = false;
        const maxAttempts = 100;  // Número máximo de tentativas antes de ajustar o tamanho

        let attempts = 0;
        while (!placed && attempts < maxAttempts) {
          const x = Math.floor(Math.random() * this.size);
          const y = Math.floor(Math.random() * this.size);
          const direction = Math.random() > 0.5 ? 'horizontal' : 'vertical';

          if (this.canPlaceWord(word, x, y, direction)) {
            this.placeWord(word, x, y, direction);
            this.placedWords.push({ word, x, y, direction, clue });
            placed = true;
          }
          attempts++;
        }

        if (!placed) {
          // Se não conseguir colocar a palavra, significa que precisamos aumentar o tamanho do tabuleiro
          console.log('Aumentando tamanho do tabuleiro...')
          placedAllWords = false;
          this.size++; // Aumenta o tamanho do tabuleiro
          this.canvasSize = this.gridSize * this.size + 5; //Atualiza o tamanho do canvas
          this.board = Array.from({ length: this.size }, () => Array(this.size).fill(' ')); // Cria um novo tabuleiro maior
          this.placedWords = []; // Limpa as palavras já colocadas e tenta colocar novamente ( Voltando ao começo do while )
          break;
        }
      }
    }
  }

  placeWord(word, x, y, direction) {
    for (let i = 0; i < word.length; i++) {
      if (direction === 'horizontal') {
        this.board[y][x + i] = word[i];
        console.log(`Colocando ${word[i]} na posição (${x + i}, ${y})`)
      } else if (direction === 'vertical') {
        this.board[y + i][x] = word[i];
        console.log(`Colocando ${word[i]} na posição (${x}, ${y + i})`)
      }
    }
  }

  canPlaceWord(word, x, y, direction) {
    console.log(`Tentando colocar ${word} na posição: (${x}, ${y})`)
    console.log(this.board)
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

  // Função para criar uma célula de palavras cruzadas
  const createCrosswordCell = (canvas, x, y, char, groupName) => {
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
      selectable: false,
    });

    const textBox = new fabric.Textbox(char, {
      left: this.gridSize * y + 15,
      top: this.gridSize * x,
      width: this.gridSize - 30,
      height: this.gridSize - 20,
      fontSize: this.gridSize / 1.5,
      fill: 'black',
      editable: false, // Inicialmente desativado
      hasControls: false,
      backgroundColor: 'transparent',
    });

    // Agrupar os elementos relacionados à célula
    const group = new fabric.Group([rect, textBox], {
      left: this.gridSize * y,
      top: this.gridSize * x,
      lockMovementX: true,
      lockMovementY: true,
      hasControls: false,
      selectable: true,
      evented: true,
      groupName, // Nome para identificar grupos relacionados
    });

    // Adicionar evento de clique no grupo
    group.on('mousedown', function () {
      // Destacar o retângulo
      rect.set('fill', 'lightblue');
      canvas.renderAll();

      // Ativar edição do `Textbox`
      textBox.set('editable', true);
      canvas.setActiveObject(textBox);
      textBox.enterEditing();

      // Selecionar todo o texto automaticamente
      setTimeout(() => {
        textBox.selectAll();
        canvas.renderAll();
      }, 0);
    });

    // Atualizar canvas em tempo real ao digitar
    textBox.on('changed', function () {
      canvas.renderAll(); // Atualizar o texto no canvas imediatamente
    });

    // Remover destaque ao sair da edição
    textBox.on('editing:exited', function () {
      rect.set('fill', 'transparent');
      textBox.set('editable', false);
      canvas.renderAll();
    });

    canvas.add(group);
  };

  // Renderizar o tabuleiro
  this.board.forEach((row, y) => {
    row.forEach((char, x) => {
      if (char !== ' ') {
        // Adicionar números de palavras, se aplicável
        for (let word of this.placedWords) {
          if (word.x === x && word.y === y) {
            const wordLabel = new fabric.Text(wordCount.toString(), {
              left: this.gridSize * y + 5,
              top: this.gridSize * x,
              fontSize: this.gridSize / 3,
              fill: 'red',
            });
            canvas.add(wordLabel);
            wordCount++;
          }
        }

        // Criar a célula de palavras cruzadas
        createCrosswordCell(canvas, x, y, char, `group-${x}-${y}`);
      }
    });
  });
}
 
  

  displayClues(ol) {
    this.placedWords.forEach(entry => {
      const newLi = document.createElement('li');
      newLi.innerHTML = `${entry.clue} (${entry.direction}) - Posição: (${entry.x}, ${entry.y})`;
      ol.append(newLi);
    });
  }

  displayGame() {
    const container = document.querySelector('#game-container');
    container.innerHTML = `
      <canvas width="${this.canvasSize}" height="${this.canvasSize}" id="game-board">The game is loading or can't load on your browser.</canvas>
      <div>
        <p>Game Clues<p>
        <ol id="game-clues"></ol>
      </div>
    `;
    this.canvas = new fabric.Canvas(document.querySelector('#game-board'));
    this.canvas.hoverCursor = 'default';
    this.displayBoard(this.canvas);
    this.displayClues(document.querySelector('#game-clues'));
  }
}

const game = new Game(themeArray);

// Debugging
console.log('themeArray: ', game.themeArray);
console.log('maxWordLength: ', game.maxWordLength);
console.log('size: ', game.size);
console.log('canvasSize: ', game.canvasSize);
console.log('board: ', game.board);
console.log('canvas: ', game.canvas);
console.log('game.placedWords: ', game.placedWords);
