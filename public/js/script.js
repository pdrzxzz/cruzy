class Game {
  constructor(themeArray) {
    this.maxWordLength = Math.max(...themeArray.map(item => item.word.length)); //Tamanho da maior palavra
    this.size = Math.ceil(Math.sqrt(themeArray.length * this.maxWordLength)); // Tamanho inicial
    this.gridSize = 50; //Tamanho de cada bloquinho
    this.canvasSize = this.gridSize * this.size + 5; //Tamanho inicial do canvas
    this.board = Array.from({ length: this.size }, () => Array(this.size).fill(' ')); //Matrix inicial do tabuleiro
    this.themeArray = themeArray; //Array de objetos que contém {word: clue}
    this.unplacedWords = [...themeArray]; //Copy
    this.placedWords = []; //Array para guardar informação da posição em que foi colocada cada palavra 
    this.createCrossword(); //Cria o caça palavras, preenche this.board e this.placedWords
    this.displayGame(); //Exibe o jogo na tela
  }

  createCrossword() {
    // Tentando colocar as palavras, ajustando o tabuleiro se necessário
    let placedAllWords = false;

    while (!placedAllWords) {
      //Se as palavras conseguem ser colocadas todas em um tabuleiro desse tamanho então depois que acabar esse for
      //unPlacedWords estará vazio e placedAllWords será true
      //Caso contrário, aumentamos o tamanho do tabuleiro
      for (let i = 0; i < 1000; i++) {
        //Se todas as palavras já foram colocadas, não faz sentido continuar com esse for
        if(!this.unplacedWords.length){
          break;
        }
        //item === random {word, clue} that do not are placed
        let item = this.unplacedWords[i % this.unplacedWords.length];
        let { word, clue } = item;
        let placed = false;
        
        const maxAttempts = 100;
        let attempts = 0;
        while (!placed && attempts < maxAttempts) {
          const row = Math.floor(Math.random() * this.size);
          const column = Math.floor(Math.random() * this.size);
          const direction = Math.random() > 0.5 ? 'horizontal' : 'vertical';
          
          if (this.canPlaceWord(word, row, column, direction)) {
            this.placeWord(word, row, column, direction);
            this.placedWords.push({ word, row, column, direction, clue });
            // console.log(this.placedWords)
            this.unplacedWords.splice(i % this.unplacedWords.length, 1)
            placed = true;
          }
          attempts++;
        }
      }

      //Se conseguiu colocar todas as palavras, dá o comando de encerrar o while
      if (!this.unplacedWords.length) {
        placedAllWords = true;
      } else {
        // Se não conseguiu colocar todas as palavras, significa que precisamos aumentar o tamanho do tabuleiro
        console.log('Aumentando tamanho do tabuleiro...')
        this.size++; // Aumenta o tamanho do tabuleiro
        this.canvasSize = this.gridSize * this.size + 5; //Atualiza o tamanho do canvas
        this.board = Array.from({ length: this.size }, () => Array(this.size).fill(' ')); // Cria um novo tabuleiro maior
        this.placedWords = []; // Limpa as palavras já colocadas e tenta colocar novamente ( Voltando ao começo do while )
        this.unplacedWords = [...themeArray]; //restart
      }
    }
  }

  placeWord(word, row, column, direction) {
    for (let i = 0; i < word.length; i++) {
      if (direction === 'horizontal') {
        this.board[row][column + i] = word[i];
        // console.log(`Colocando ${word[i]} na posição (${x + i}, ${y})`)
      } else if (direction === 'vertical') {
        this.board[row + i][column] = word[i];
        // console.log(`Colocando ${word[i]} na posição (${x}, ${y + i})`)
      }
    }
  }

  canPlaceWord(word, row, column, direction) {

    //Se for a primeira palavra a ser inserida
    //Não obriga a ter pelo menos uma intersecção já que é a primeira palavra
    if (!this.placedWords.length) {
      if (direction === 'horizontal') {
        for (let i = 0; i < word.length; i++) {
          if (column + i >= this.size) {
            return false;
          }
        }
      }

      if (direction === 'vertical') {
        for (let i = 0; i < word.length; i++) {
          // Verifica se a palavra ultrapassa os limites verticais
          if (row + i >= this.size) {
            return false;
          }
        }
      }

      return true;
    }


    let totalBlanks = 0;
    if (direction === 'horizontal') {
      for (let i = 0; i < word.length; i++) {
        if (column + i >= this.size) {
          return false;
        }
        // Se tiver um caractere diferente de espaço e da letra a ser colocada
        if (this.board[row][column + i] !== word[i] && this.board[row][column + i] !== ' ') {
          return false;
        }
        //Se quero colocar a letra em um espaço vazio
        if (this.board[row][column + i] === ' ') {
          totalBlanks++;
        }
      }
    }

    if (direction === 'vertical') {
      for (let i = 0; i < word.length; i++) {
        // Verifica se a palavra ultrapassa os limites verticais
        if (row + i >= this.size) {
          return false;
        }
        // Permite cruzar palavras no mesmo caractere
        if (this.board[row + i][column] !== word[i] && this.board[row + i][column] !== ' ') {
          return false;
        }
        //Se quero colocar a letra em um espaço vazio
        if (this.board[row + i][column] === ' ') {
          totalBlanks++;
        }
      }
    }

    //Garante pelo menos 1 intersecção com outra palavra
    //Se minha palavra não teve nenhuma intersecção (quero colocar apenas em espaços vazios)
    if (totalBlanks === word.length) {
      //Não colocar palavra
      return false;
    }

    //Se chegou até aqui não saiu dos limites e tem alguma intersecção, logo colocar palavra
    return true;
  }
  //true, se pode colocar a palavra
  //false, se não pode colocar a palavra


  displayBoard(canvas) {
    let wordCount = 1;

    // Função para criar uma célula de palavras cruzadas
    const createCrosswordCell = (canvas, row, column, char, groupName) => {
      const rect = new fabric.Rect({
        left: this.gridSize * column,
        top: this.gridSize * row,
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
        left: this.gridSize * column + 15,
        top: this.gridSize * row,
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
        left: this.gridSize * column,
        top: this.gridSize * row,
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
    this.board.forEach((row, rowIndex) => {
      row.forEach((char, colIndex) => {
        if (char !== ' ') {
          // Adicionar números de palavras, se aplicável
          for (let word of this.placedWords) {
            if (word.row === rowIndex && word.column === colIndex) {
              const wordLabel = new fabric.Text(String(this.placedWords.indexOf(word) + 1), {
                left: this.gridSize * colIndex + 5,
                top: this.gridSize * rowIndex,
                fontSize: this.gridSize / 3,
                fill: 'red',
              });
              canvas.add(wordLabel);
              wordCount++;
            }
          }

          // Criar a célula de palavras cruzadas
          createCrosswordCell(canvas, rowIndex, colIndex, char, `group-${rowIndex}-${colIndex}`);
        }
      });
    });
  }

  displayClues(ol) {
    this.placedWords.forEach(entry => {
      const newLi = document.createElement('li');
      newLi.innerHTML = `${entry.clue} (${entry.direction}) - Posição: (${entry.row}, ${entry.column})`;
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
