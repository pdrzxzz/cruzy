const mongoose = require('mongoose');

/**
 * Schema de sala que define a estrutura das salas de jogo no MongoDB
 * Cada sala representa um jogo de palavras cruzadas individual
 */
const roomSchema = new mongoose.Schema({
    name: {
      type: String,
      required: true, // Nome da sala é obrigatório para identificação
    },
    theme: {
      type: String,
      required: true, // O tema do jogo de palavras cruzadas
    },
    numWords: {
      type: Number,
      required: true, // Número de palavras que o jogo deve conter
    },
    owner: {
      type: String,
      required: true, // Nome do usuário que criou a sala
    },
    game: {
      type: Object,
      required: true, // Objeto complexo que contém toda a estrutura do jogo
      // Armazena palavras, dicas, posições, estado do tabuleiro, etc.
    }
  });
  
  // Exporta o modelo Room com base no schema definido
  module.exports = mongoose.model('Room', roomSchema);