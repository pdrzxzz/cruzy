module.exports.isLoggedIn = (req, res, next) => {
    console.log('req.isAuthenticated: ', req.isAuthenticated())
    if (!req.isAuthenticated()) {
        req.flash('error', 'You must be signed in first.')
        return res.redirect('/login')
    }
    next()
}