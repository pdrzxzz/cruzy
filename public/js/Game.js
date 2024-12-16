class Game {
  constructor(themeArray) {
    this.themeArray = themeArray; //Array de objetos que contém {word: clue}
    this.size = this.generateSize() // Tamanho inicial do tabuleiro (1 dimension)
    this.gridSize = 50; //Tamanho de cada bloquinho
    this.canvasSize = this.gridSize * this.size + 5; //Tamanho inicial do canvas
    this.board = Array.from({ length: this.size }, () => Array(this.size).fill('')); //Matrix inicial do tabuleiro
    this.userInput = Array.from({ length: this.size }, () => Array(this.size).fill('')); //Matrix inicial da digitação do usuário
    this.wordLocations = Array.from({ length: this.size }, () => Array(this.size).fill(''));
    this.unplacedWords = [...themeArray]; //Copy, used on createCrossword
    this.highlightedCells = []
    this.placedWords = []; //Array para guardar informação da posição em que foi colocada cada palavra 
    this.createCrossword(); //Cria o caça palavras, preenche this.board e this.placedWords
    this.displayGame(); //Exibe o jogo na tela
  }

  createCrossword() {
    createCrossword(this); //from createCrossword.js
  }

  displayGame() {
    displayGame(this); //from displayGame.js
  }

  generateSize() {
    const maxWordLength = Math.max(...themeArray.map(item => item.word.length)); //Tamanho da maior palavra
    return Math.ceil(Math.sqrt(themeArray.length * maxWordLength)); // Tamanho inicial do tabuleiro (1 dimension)
  }
}

const game = new Game(themeArray);

// Debugging
console.log('themeArray: ', game.themeArray);
console.log('size: ', game.size);
console.log('canvasSize: ', game.canvasSize);
console.log('board: ', game.board);
console.log('userInput: ', game.userInput)
console.log('canvas: ', game.canvas);
console.log('game.placedWords: ', game.placedWords);
console.log('game.wordLocations: ', game.wordLocations);
