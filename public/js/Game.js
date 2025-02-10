const createCrossword = require('./createCrossword')
// const displayGame = require('./displayGame')

module.exports = class Game {
  constructor(themeArray) {
    this.themeArray = themeArray; //Array de objetos que contém {word: clue}
    this.size = this.generateSize() // Tamanho inicial do tabuleiro (1 dimension)
    this.board = Array.from({ length: this.size }, () => Array(this.size).fill('')); //Matrix inicial do tabuleiro
    this.userInput = Array.from({ length: this.size }, () => Array(this.size).fill('')); //Matrix inicial da digitação do usuário
    this.wordLocations = Array.from({ length: this.size }, () => Array(this.size).fill(''));
    this.unplacedWords = [...themeArray]; //Copy, used on createCrossword
    this.highlightedCells = [];
    this.userDirection = 'vertical';
    this.completedCells = [];
    this.completedWords = [];
    this.placedWords = []; //Array para guardar informação da posição em que foi colocada cada palavra 
    this.createCrossword(); //Cria o palavras cruzadas, preenche this.board e this.placedWords
    // this.displayGame(); //Exibe o jogo na tela
  }

  createCrossword() {
    createCrossword(this); //from createCrossword.js
  }

  generateSize() {
    console.log(this.themeArray)
    const maxWordLength = Math.max(...this.themeArray.map(item => item.word.length)); //Tamanho da maior palavra
    return Math.ceil(Math.sqrt(this.themeArray.length * maxWordLength)); // Tamanho inicial do tabuleiro (1 dimension)
  }
}

// const game = new Game(data.themeArray);

// Debugging
// console.log('data.theme :', data.theme)
// console.log('data.owner :', data.owner)
// console.log('data.language :', data.language)

// console.log('game.themeArray: ', game.themeArray);
// console.log('size: ', game.size);
// console.log('canvasSize: ', game.canvasSize);
// console.log('board: ', game.board);
// console.log('userInput: ', game.userInput)
// console.log('canvas: ', game.canvas);
// console.log('game.placedWords: ', game.placedWords);
// console.log('game.wordLocations: ', game.wordLocations);
