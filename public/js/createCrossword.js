/**
 * Função principal para criar o tabuleiro de palavras cruzadas
 * Recebe um objeto Game e preenche seu tabuleiro com palavras cruzadas
 * @param {Object} game - Instância da classe Game
 */
module.exports = createCrossword = (game) => {

    /**
     * Verifica se é possível colocar uma palavra em uma determinada posição e direção
     * @param {string} word - A palavra a ser colocada
     * @param {number} row - A linha inicial
     * @param {number} column - A coluna inicial
     * @param {string} direction - A direção ('horizontal' ou 'vertical')
     * @returns {boolean} - True se for possível colocar a palavra, false caso contrário
     */
    function canPlaceWord(word, row, column, direction) {
        /*
        Essa função retorna true, se pode colocar a palavra
        ou false, se não pode colocar a palavra
        */
        for (let placedWord of game.placedWords) {
            //palavras não podem ter intersecção na primeira letra (para não sobrepor wordLabels) <-- Ajuste provisório
            if (word.row === placeWord.row && word.column === placedWord.column) {
                return false;
            }
        }

        //Se for a primeira palavra a ser inserida
        //Não obriga a ter pelo menos uma intersecção já que é a primeira palavra
        if (!game.placedWords.length) {
            if (direction === 'horizontal') {
                for (let i = 0; i < word.length; i++) {
                    if (column + i >= game.size) {
                        return false;
                    }
                }
            }

            if (direction === 'vertical') {
                for (let i = 0; i < word.length; i++) {
                    // Verifica se a palavra ultrapassa os limites verticais
                    if (row + i >= game.size) {
                        return false;
                    }
                }
            }

            return true;
        }


        let totalBlanks = 0;
        if (direction === 'horizontal') {
            for (let i = 0; i < word.length; i++) {
                if (column + i >= game.size) {
                    return false;
                }
                // Se tiver um caractere diferente de espaço e da letra a ser colocada
                if (game.board[row][column + i] && game.board[row][column + i] !== word[i]) {
                    return false;
                }
                //Se quero colocar a letra em um espaço vazio
                if (!game.board[row][column + i]) {
                    totalBlanks++;
                }
            }
        }

        if (direction === 'vertical') {
            for (let i = 0; i < word.length; i++) {
                // Verifica se a palavra ultrapassa os limites verticais
                if (row + i >= game.size) {
                    return false;
                }
                // Permite cruzar palavras no mesmo caractere
                if (game.board[row + i][column] && game.board[row + i][column] !== word[i]) {
                    return false;
                }
                //Se quero colocar a letra em um espaço vazio
                if (!game.board[row + i][column]) {
                    totalBlanks++;
                }
            }
        }

        //Garante pelo menos 1 intersecção com outra palavra
        //Se minha palavra não teve nenhuma intersecção (quero colocar apenas em espaços vazios)
        if (totalBlanks === word.length) {
            //Não colocar palavra
            return false;
        }

        //Se chegou até aqui não saiu dos limites e tem alguma intersecção, logo colocar palavra
        return true;
    }

    /**
     * Coloca uma palavra no tabuleiro na posição e direção especificadas
     * @param {string} word - A palavra a ser colocada
     * @param {number} row - A linha inicial
     * @param {number} column - A coluna inicial
     * @param {string} direction - A direção ('horizontal' ou 'vertical')
     * @param {number} wordIndex - O índice da palavra para identificação
     */
    function placeWord(word, row, column, direction, wordIndex) {
        for (let i = 0; i < word.length; i++) {
            if (direction === 'horizontal') {
                game.board[row][column + i] = word[i];
                if (game.wordLocations[row][column + i] === '') {
                    game.wordLocations[row][column + i] += String(wordIndex);
                } else {
                    game.wordLocations[row][column + i] += '-' + String(wordIndex);
                }
            } else if (direction === 'vertical') {
                game.board[row + i][column] = word[i];
                if (game.wordLocations[row + i][column] === '') {
                    game.wordLocations[row + i][column] += String(wordIndex);
                } else {
                    game.wordLocations[row + i][column] += '-' + String(wordIndex);
                }
            }
        }
    }

    /**
     * Aumenta o tamanho do tabuleiro quando não é possível colocar todas as palavras
     * Reinicia o processo de criação do tabuleiro
     */
    function increaseBoardSize() {
        console.log('Aumentando tamanho do tabuleiro...')
        game.size++; // Aumenta o tamanho do tabuleiro
        game.canvasSize = game.gridSize * game.size + 5; // Atualiza o tamanho do canvas
        game.board = Array.from({ length: game.size }, () => Array(game.size).fill('')); // Cria um novo tabuleiro maior
        game.userInput = Array.from({ length: game.size }, () => Array(game.size).fill(''));
        game.placedWords = []; // Limpa as palavras já colocadas e tenta colocar novamente (Voltando ao começo do while)
        game.unplacedWords = [...game.themeArray]; // Reinicia com todas as palavras
        game.wordLocations = Array.from({ length: game.size }, () => Array(game.size).fill(''));
    }

    /**
     * Tenta preencher o tabuleiro com todas as palavras
     * Usa tentativas aleatórias para posicionar cada palavra
     */
    function tryFillBoard() {
        /*
        Se as palavras conseguem ser colocadas todas em um tabuleiro de game.size então depois que terminar de executar tryFillBoard
        unPlacedWords estará vazio e placedAllWords será true
        O sucesso dessa função é checado pela função isBoardFilled()
        */
        let wordCount = 1;
        for (let i = 0; i < 1000; i++) {

            let wordIndex = i % game.unplacedWords.length;
            //item === random {word, clue} that do not are placed
            let item = game.unplacedWords[wordIndex];
            let { word, clue } = item;
            let placed = false;

            const maxAttempts = 100;
            let attempts = 0;
            while (!placed && attempts < maxAttempts) {
                const row = Math.floor(Math.random() * game.size);
                const column = Math.floor(Math.random() * game.size);
                const direction = Math.random() > 0.5 ? 'horizontal' : 'vertical';

                if (canPlaceWord(word, row, column, direction)) {
                    placeWord(word, row, column, direction, wordCount++);
                    game.placedWords.push({ word, row, column, direction, clue });
                    // console.log(game.placedWords)
                    game.unplacedWords.splice(wordIndex, 1)
                    placed = true;
                }
                attempts++;
            }

            // Se todas as palavras já foram colocadas, não faz sentido continuar com esse for
            if (!game.unplacedWords.length) {
                break;
            }
        }
    }

    /**
     * Verifica se todas as palavras foram colocadas no tabuleiro
     * @returns {boolean} - True se todas as palavras foram colocadas, false caso contrário
     */
    function isBoardFilled() {
        // If unplacedWords.length = 0, board is filled
        return !game.unplacedWords.length
    }

    // Tentando colocar as palavras, ajustando o tabuleiro se necessário
    let placedAllWords = false;

    while (!placedAllWords) {
        // Tenta preencher o tabuleiro
        tryFillBoard()

        if (isBoardFilled()) {
            // Se conseguiu colocar todas as palavras, dá o comando de encerrar o while
            placedAllWords = true;
        } else {
            // Se não conseguiu colocar todas as palavras, significa que precisamos aumentar o tamanho do tabuleiro
            increaseBoardSize()
        }
    }
}


