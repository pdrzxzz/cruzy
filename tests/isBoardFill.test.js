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

    test('should have valid intersections between words', () => {
        let hasIntersection = false;
        game.board.forEach((row, i) => {
            row.forEach((cell, j) => {
                if (game.wordLocations[i][j].includes('-')) {
                    hasIntersection = true;
                }
            });
        });
        expect(hasIntersection).toBe(true);
    });

    test('should have correct board size for words', () => {
        const maxWordLength = Math.max(...mockTheme.map(item => item.word.length));
        expect(game.size).toBeGreaterThanOrEqual(maxWordLength);
    });

    test('should increase board size for very long words', () => {
        const longWord = { 
            word: 'supercalifragilisticexpialidocious', 
            clue: 'Very long word' 
        };
        const newGame = new Game([...mockTheme, longWord]);
        expect(newGame.size).toBeGreaterThan(game.size);
    });

    test('should have all words placed within board boundaries', () => {
        let withinBounds = true;
        game.placedWords.forEach(({word, row, column, direction}) => {
            if (direction === 'horizontal') {
                withinBounds = withinBounds && (column + word.length <= game.size);
            } else {
                withinBounds = withinBounds && (row + word.length <= game.size);
            }
        });
        expect(withinBounds).toBe(true);
    });

    test('should have filled board matching placed words', () => {
        game.placedWords.forEach(({word, row, column, direction}) => {
            for (let i = 0; i < word.length; i++) {
                if (direction === 'horizontal') {
                    expect(game.board[row][column + i]).toBe(word[i]);
                } else {
                    expect(game.board[row + i][column]).toBe(word[i]);
                }
            }
        });
    });
});