const User = require('../models/user')

/**
 * Função para validar a senha seguindo critérios de segurança
 * @param {string} password - A senha a ser validada
 * @returns {boolean} - Retorna true se a senha atende a todos os critérios
 */
const validatePassword = (password) => {
    const minLength = 8; // Comprimento mínimo de 8 caracteres
    const hasUpperCase = /[A-Z]/.test(password); // Pelo menos uma letra maiúscula
    const hasLowerCase = /[a-z]/.test(password); // Pelo menos uma letra minúscula
    const hasNumber = /[0-9]/.test(password); // Pelo menos um número
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password); // Pelo menos um caractere especial

    return password.length >= minLength && hasUpperCase && hasLowerCase && hasNumber && hasSpecialChar;
};

/**
 * Renderiza a página de registro
 */
module.exports.renderRegister = (req, res) => {
    res.render('users/register')
}

/**
 * Processa o registro de um novo usuário
 * Valida a senha, cria o usuário no banco de dados e faz login automático
 */
module.exports.register = async (req, res) => {
    try {
        const { username, password } = req.body

        if(!validatePassword(password)){
            throw new Error("Password Requirements not satisfied.")
        }

        const user = new User({ username })
        const registeredUser = await User.register(user, password)
        req.login(registeredUser, err => {
            if (err) return next(err)
            req.flash('success', `Welcome to Cruzy ${username}`)
            res.redirect('/')

        })

    } catch (e) {
        req.flash('error', e.message)
        res.redirect('register')
    }
}

/**
 * Renderiza a página de login
 */
module.exports.renderLogin = (req, res) => {
    res.render('users/login')
}

/**
 * Processa o login do usuário (chamado após autenticação bem-sucedida pelo Passport)
 * Adiciona mensagem de boas-vindas e redireciona para a página inicial
 */
module.exports.login = (req, res) => {
    req.flash('success', 'Welcome back ' + req.user.username);
    res.redirect('/');
}

/**
 * Realiza o logout do usuário e redireciona para a página inicial
 */
module.exports.logout = (req, res, next) => {
    req.logout(function (err) {
        if (err) {
            return next(err);
        }
        res.redirect('/');
    });
}