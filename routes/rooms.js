const express = require('express');
const router = express.Router();
const rooms = require('../controllers/rooms')
const catchAsync = require('../utils/catchAsync');
const { isLoggedIn } = require('../middleware')

/**
 * Rotas para gerenciamento de salas de jogo
 * Todas as rotas aqui começam com /rooms devido à configuração em app.js
 */

/**
 * GET & POST /rooms
 * Rotas para listagem e criação de salas
 */
router.route('/')
.get(
  isLoggedIn, // Middleware que verifica se o usuário está logado
  catchAsync(rooms.showAllRooms) // Exibe todas as salas do usuário atual
)
.post(
  isLoggedIn,
  catchAsync(rooms.createNewRoom) // Cria uma nova sala no banco de dados e redireciona para ela
)

/**
 * GET /rooms/new
 * Rota para exibir o formulário de criação de sala
 */
router.route('/new')
.get(
  isLoggedIn,
  rooms.showRoomCreation // Renderiza o formulário de criação de sala
)

/**
 * DELETE /rooms/:id
 * Rota para excluir uma sala específica
 * @param {string} id - ID da sala a ser excluída
 */
router.route('/:id')
.delete(
  isLoggedIn,
  catchAsync(rooms.deleteRoom) // Remove a sala do banco de dados
)

module.exports = router;
