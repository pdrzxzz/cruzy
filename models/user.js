let db;

module.exports = {
    // Injeta a instância do banco
    setDB: function(database) {
        db = database;
    },

    register: async function(user, password) {
        try {
            const result = await db.run(
                'INSERT INTO users (username, password) VALUES (?, ?)',
                user.username,
                password
            );
            return { id: result.lastID, username: user.username, password };
        } catch (error) {
            throw error;
        }
    },

    authenticate: async function(username, password) {
        const foundUser = await db.get('SELECT * FROM users WHERE username = ?', username);
        if (!foundUser) {
            throw new Error('User not found');
        }
        if (foundUser.password !== password) {
            return { message: 'Incorrect password for username' };
        }
        return { user: foundUser };
    },

    updatePassword: async function(username, newPassword) {
        await db.run('UPDATE users SET password = ? WHERE username = ?', newPassword, username);
        return await db.get('SELECT * FROM users WHERE username = ?', username);
    },

    delete: async function(username) {
        await db.run('DELETE FROM users WHERE username = ?', username);
    }
};