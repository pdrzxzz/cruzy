const Game = require('../public/js/Game.js');

describe('Game Board Fill Tests', () => {
    let game;
    const mockTheme = [
        { word: 'test', clue: 'A test word' },
        { word: 'jest', clue: 'Testing framework' },
        { word: 'code', clue: 'What developers write' }
    ];

    beforeEach(() => {
        game = new Game(mockTheme);
    });

    test('should have all words placed after initialization', () => {
        expect(game.unplacedWords.length).toBe(0);
        expect(game.placedWords.length).toBe(mockTheme.length);
    });

    test('should have correct words placed on the board', () => {
        game.placedWords.forEach(({word, row, column, direction}) => {
            for (let i = 0; i < word.length; i++) {
                const cell = game.board[row + (direction === 'vertical' ? i : 0)][column + (direction === 'horizontal' ? i : 0)];
                expect(cell).toBe(word[i]);
            }
        });
    });

    test('should have correct words placed on the board', () => {
        game.placedWords.forEach(({word, row, column, direction}) => {
            const wordIndex = mockTheme.findIndex(item => item.word === word);
            expect(wordIndex).not.toBe(-1);
            expect(mockTheme[wordIndex].word).toBe(word);
        });
    });
});