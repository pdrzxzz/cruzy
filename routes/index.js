const express = require('express');
const router = express.Router();
const rooms = require('../controllers/rooms')
const catchAsync = require('../utils/catchAsync');
const { renderHomePage } = require('../controllers');
const { isLoggedIn } = require('../middleware')

/**
 * Rotas principais da aplicação
 */

/**
 * GET / 
 * Rota para página inicial (home page)
 * Renderiza a página de boas-vindas do aplicativo
 */
router.get('/', renderHomePage);

/**
 * GET /play/:id
 * Rota para jogar uma sala específica
 * @param {string} id - ID da sala a ser jogada
 * Requer autenticação (middleware isLoggedIn)
 * Utiliza catchAsync para tratamento de erros assíncronos
 */
router.get('/play/:id', 
    isLoggedIn,
    catchAsync(rooms.showRoom)) // Renderiza a página de jogo com os dados da sala vindos de req.params.id

module.exports = router;
