const express = require('express')
const router = express.Router()
const passport = require('passport')
const catchAsync = require('../utils/catchAsync')
const users = require('../controllers/users')

/**
 * Rotas para autenticação e gerenciamento de usuários
 */

/**
 * GET & POST /register
 * Rotas para registro de novos usuários
 */
router.route('/register')
.get(users.renderRegister) // Renderiza o formulário de registro

.post(catchAsync(users.register)) // Processa o registro de novo usuário

/**
 * GET & POST /login
 * Rotas para autenticação de usuários
 */
router.route('/login')
.get(users.renderLogin) // Renderiza o formulário de login

.post(
    // Middleware do Passport para autenticação local
    passport.authenticate('local', { 
        failureFlash: true, // Habilita mensagens flash para falhas
        failureRedirect: '/login' // Redireciona de volta ao login em caso de falha
    }), 
    users.login // Função executada após autenticação bem-sucedida
)

/**
 * GET /logout
 * Rota para encerrar a sessão do usuário
 */
router.get('/logout', users.logout);

module.exports = router
