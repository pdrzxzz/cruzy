const Game = require('../public/js/Game.js');

describe('Game Board Fill Tests', () => {
    let game;
    const mockTheme = [
        { word: 'apple', clue: 'A fruit' },
        { word: 'river', clue: 'A natural watercourse' },
        { word: 'mountain', clue: 'A large natural elevation of the earth surface' }
    ];

    beforeEach(() => {
        game = new Game(mockTheme);
    });

    test('should have all words placed', () => {
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
});