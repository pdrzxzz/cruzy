const createCrossword = require('./createCrossword')
// const displayGame = require('./displayGame')

/**
 * Classe que representa o jogo de palavras cruzadas
 * Gerencia o estado do jogo, a geração do tabuleiro e a interação do usuário
 */
module.exports = class Game {
  /**
   * Construtor da classe Game
   * @param {Array} themeArray - Array de objetos contendo {word: string, clue: string}
   */
  constructor(themeArray) {
    this.themeArray = themeArray; // Array de objetos que contém {word: clue}
    this.size = this.generateSize() // Tamanho inicial do tabuleiro (1 dimension)
    this.board = Array.from({ length: this.size }, () => Array(this.size).fill('')); // Matrix inicial do tabuleiro
    this.userInput = Array.from({ length: this.size }, () => Array(this.size).fill('')); // Matrix inicial da digitação do usuário
    this.wordLocations = Array.from({ length: this.size }, () => Array(this.size).fill(''));
    this.unplacedWords = [...themeArray]; // Cópia usada no algoritmo createCrossword
    this.highlightedCells = []; // Células atualmente destacadas no tabuleiro
    this.userDirection = 'vertical'; // Direção padrão para entrada de palavras (vertical/horizontal)
    this.completedCells = []; // Células preenchidas corretamente pelo usuário
    this.completedWords = []; // Palavras completadas corretamente pelo usuário
    this.placedWords = []; // Array para guardar informação da posição em que foi colocada cada palavra
    this.createCrossword(); // Cria o palavras cruzadas, preenche this.board e this.placedWords
    // this.displayGame(); // Exibe o jogo na tela (desativado - chamado pelo cliente)
  }

  /**
   * Gera o tabuleiro de palavras cruzadas chamando a função importada
   */
  createCrossword() {
    createCrossword(this); // Função importada do arquivo createCrossword.js
  }

  /**
   * Calcula o tamanho inicial do tabuleiro com base no tamanho das palavras
   * @returns {number} - O tamanho do tabuleiro (matriz quadrada)
   */
  generateSize() {
    console.log(this.themeArray)
    const maxWordLength = Math.max(...this.themeArray.map(item => item.word.length)); // Tamanho da maior palavra
    return Math.ceil(Math.sqrt(this.themeArray.length * maxWordLength)); // Tamanho inicial do tabuleiro (1 dimension)
  }
}