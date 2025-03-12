/**
 * Renderiza a página inicial do aplicativo
 * Esta é a landing page que os usuários veem quando acessam o site
 */
module.exports.renderHomePage = (req, res, next) => {
    res.render('index');
}