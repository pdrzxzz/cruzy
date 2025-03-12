/**
 * Função utilitária para envolver handlers de rotas assíncronas
 * Evita a necessidade de usar try/catch em cada rota
 * 
 * Esta função recebe um handler assíncrono e retorna uma nova função
 * que executa o handler original e captura qualquer erro que possa ocorrer,
 * encaminhando-o para o middleware de tratamento de erros do Express
 * através do parâmetro 'next'
 * 
 * @param {Function} func - Função assíncrona de manipulação de rota
 * @returns {Function} - Handler envolvido com tratamento de erro
 */
module.exports = func => {
    return (req, res, next) => {
        // Executa a função original e captura qualquer erro usando .catch()
        // Se ocorrer um erro, passa-o para o próximo middleware (geralmente o error handler)
        func(req, res, next).catch(next);
    }
}