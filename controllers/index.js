module.exports.renderHomePage = (req, res, next) => {
    res.render('index', { title: 'Cruzy' });
}