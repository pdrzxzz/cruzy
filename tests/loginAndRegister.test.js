jest.setTimeout(10000);

const sqlite3 = require('sqlite3').verbose();
const { open } = require('sqlite');
const User = require('../models/user');

let db;

beforeAll(async () => {
    db = await open({
        filename: ':memory:',
        driver: sqlite3.Database
    });

    await db.exec(`
        CREATE TABLE users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE,
            password TEXT
        );
    `);

    // Injeta a instância do SQLite no modelo
    User.setDB(db);
});

afterAll(async () => {
    await db.close();
});

beforeEach(async () => {
    await db.exec('DELETE FROM users');
});

const mockNewUser = {
    username: 'testuser',
    password: 'password123',
};

const mockExistingUser = {
    username: 'existinguser',
    password: 'password456',
};

describe('Login and Register Functionality with SQLite', () => {
    test('should register a new user successfully', async () => {
        const newUser = { username: mockNewUser.username };
        const registeredUser = await User.register(newUser, mockNewUser.password);
        expect(registeredUser.username).toBe(mockNewUser.username);

        const foundUser = await db.get('SELECT * FROM users WHERE username = ?', mockNewUser.username);
        expect(foundUser).toBeDefined();
        expect(foundUser.username).toBe(mockNewUser.username);
    });

    test('should login an existing user successfully', async () => {
        const newUser = { username: mockExistingUser.username };
        await User.register(newUser, mockExistingUser.password);

        const loggedInUser = await User.authenticate(mockExistingUser.username, mockExistingUser.password);
        expect(loggedInUser.user.username).toBe(mockExistingUser.username);
    });

    test('should not login with incorrect password', async () => {
        const newUser = { username: mockExistingUser.username };
        await User.register(newUser, mockExistingUser.password);

        const loggedInUser = await User.authenticate(mockExistingUser.username, 'wrongpassword');
        expect(loggedInUser.message).toBe('Incorrect password for username');
    });

    test('should not register a user if username already exists', async () => {
        const newUser = { username: mockExistingUser.username };
        await User.register(newUser, mockExistingUser.password);

        await expect(
            User.register({ username: mockExistingUser.username }, mockNewUser.password)
        ).rejects.toThrow(/SQLITE_CONSTRAINT: UNIQUE constraint failed/);
    });

    test('should update user password successfully', async () => {
        const newUser = { username: mockNewUser.username };
        await User.register(newUser, mockNewUser.password);

        const updatedUser = await User.updatePassword(mockNewUser.username, 'newpassword123');
        expect(updatedUser.password).toBe('newpassword123');

        const foundUser = await db.get('SELECT * FROM users WHERE username = ?', mockNewUser.username);
        expect(foundUser.password).toBe('newpassword123');
    });

    test('should delete a user successfully', async () => {
        const newUser = { username: mockNewUser.username };
        await User.register(newUser, mockNewUser.password);

        await User.delete(mockNewUser.username);

        const foundUser = await db.get('SELECT * FROM users WHERE username = ?', mockNewUser.username);
        expect(foundUser).toBeUndefined();
    });
});