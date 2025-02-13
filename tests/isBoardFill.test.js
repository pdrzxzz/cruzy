const createCrossword = require('../public/js/createCrossword.js');

describe('createCrossword', () => {
    let game;

    beforeEach(() => {
        game = {
            themeArray: [
                { word: 'test', clue: 'A test word' },
                { word: 'jest', clue: 'Testing framework' },
                { word: 'code', clue: 'What developers write' },
                { word: 'development', clue: 'The process of creating software' },
                { word: 'programming', clue: 'The act of writing code' }
            ],
            size: 5,
            gridSize: 50,
            board: [],
            userInput: [],
            wordLocations: [],
            unplacedWords: [],
            placedWords: [],
            canvasSize: 0
        };
        
        // Initialize arrays
        game.board = Array.from({ length: game.size }, () => Array(game.size).fill(''));
        game.userInput = Array.from({ length: game.size }, () => Array(game.size).fill(''));
        game.wordLocations = Array.from({ length: game.size }, () => Array(game.size).fill(''));
        game.unplacedWords = [...game.themeArray];
    });

    test('should initialize board with correct size', () => {
        createCrossword(game);
        expect(game.board.length).toBeGreaterThanOrEqual(game.size);
        expect(game.board[0].length).toBeGreaterThanOrEqual(game.size);
    });

    test('should place all words from theme', () => {
        createCrossword(game);
        expect(game.unplacedWords.length).toBe(0);
        expect(game.placedWords.length).toBe(game.themeArray.length);
    });

    test('should have valid word intersections', () => {
        createCrossword(game);
        let hasIntersection = false;
        
        game.placedWords.forEach(word1 => {
            game.placedWords.forEach(word2 => {
                if (word1 !== word2) {
                    // Check if words share any position
                    const word1Positions = getWordPositions(word1);
                    const word2Positions = getWordPositions(word2);
                    
                    word1Positions.forEach(pos1 => {
                        word2Positions.forEach(pos2 => {
                            if (pos1.row === pos2.row && pos1.col === pos2.col) {
                                hasIntersection = true;
                            }
                        });
                    });
                }
            });
        });
        
        expect(hasIntersection).toBe(true);
    });

    test('should increase board size if needed', () => {
        const initialSize = game.size;
        game.themeArray.push({ word: 'supercalifragilisticexpialidocious', clue: 'A very long word' });
        game.unplacedWords = [...game.themeArray];
        
        createCrossword(game);
        
        expect(game.size).toBeGreaterThan(initialSize);
    });

    test('should not place words outside board boundaries', () => {
        createCrossword(game);
        
        let withinBounds = true;
        game.placedWords.forEach(({ word, row, column, direction }) => {
            if (direction === 'horizontal') {
                withinBounds = withinBounds && (column + word.length <= game.board[0].length);
            } else {
                withinBounds = withinBounds && (row + word.length <= game.board.length);
            }
        });
        
        expect(withinBounds).toBe(true);
    });
});

// Helper function to get all positions occupied by a word
function getWordPositions(wordObj) {
    const positions = [];
    const { word, row, column, direction } = wordObj;
    
    for (let i = 0; i < word.length; i++) {
        if (direction === 'horizontal') {
            positions.push({ row, col: column + i });
        } else {
            positions.push({ row: row + i, col: column });
        }
    }
    
    return positions;
}