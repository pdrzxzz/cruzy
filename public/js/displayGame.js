/**
 * Função principal que renderiza e gerencia a interface do jogo de palavras cruzadas
 * Utiliza a biblioteca Fabric.js para criar um canvas interativo
 * @param {Object} game - Instância da classe Game com todos os dados do jogo
 */
displayGame = (game) => {
    const GRID_SIZE = 50; // Tamanho de cada célula do tabuleiro em pixels
    const CANVAS_SIZE = GRID_SIZE * game.size + 5; // Tamanho total do canvas

    /**
     * Renderiza o tabuleiro completo de palavras cruzadas no canvas
     * Cria todas as células interativas e controles visuais
     */
    function displayBoard() {

        /**
         * Cria uma célula interativa para o tabuleiro de palavras cruzadas
         * Configura os eventos de interação e a estrutura visual
         * @param {number} row - A linha da célula no tabuleiro
         * @param {number} column - A coluna da célula no tabuleiro
         */
        const createCrosswordCell = (row, column) => {

            /**
             * Aplica destaque visual azul a uma célula selecionada
             * @param {Object} cell - Objeto Fabric.js representando a célula
             */
            function highlightCell(cell) {
                game.highlightedCells.push(cell)
                const rect = cell._objects[0]
                rect.set('fill', 'lightblue');
            }

            /**
             * Remove o destaque visual de uma célula
             * @param {Object} cell - Objeto Fabric.js representando a célula
             */
            function unhighlightCell(cell) {
                game.highlightedCells.splice(game.highlightedCells.indexOf(cell), 1)
                const rect = cell._objects[0]
                rect.set('fill', 'white'); // Cor padrão para células sem destaque
            }

            /**
             * Aplica destaque visual cinza a uma célula (destaque secundário)
             * Usado para palavras relacionadas à célula ativa
             * @param {Object} cell - Objeto Fabric.js representando a célula
             */
            function grayHighlightCell(cell) {
                const rect = cell._objects[0];
                rect.set('fill', '#e6e6e6');
            }

            /**
             * Inicia o modo de edição em uma célula
             * Configura a edição de texto e destaca visualmente células relacionadas
             * @param {Object} cell - Objeto Fabric.js representando a célula
             */
            function startEditingCell(cell) {

                if (!game.completedCells.includes(cell)) { // Se a célula não estiver completada corretamente
                    const textBox = cell._objects[1]
                    textBox.set('editable', true);
                    textBox.enterEditing();
                    textBox.selectAll();

                    // Adiciona listener para teclas especiais (backspace/delete) na área de texto oculta do Fabric.js
                    const handleKeyDown = function(e) {
                        // Verifica se é backspace/delete e se a célula está vazia
                        if ((e.key === 'Backspace' || e.key === 'Delete') && textBox.text === '') {
                            e.preventDefault(); // Impede o comportamento padrão da tecla
                            
                            // Encontra a célula anterior na sequência
                            let currentIndex = game.highlightedCells.indexOf(cell);
                            let prevCell = currentIndex > 0 ? game.highlightedCells[currentIndex - 1] : null;
                            
                            if (prevCell) {
                                stopEditingCell(); // Finaliza edição da célula atual
                                
                                // Limpa o conteúdo da célula anterior
                                const prevTextBox = prevCell._objects[1];
                                prevTextBox.text = '';
                                game.userInput[prevCell.row][prevCell.column] = '';
                                
                                // Inicia edição da célula anterior
                                startEditingCell(prevCell);
                                
                                // Ativa cursor visual
                                prevTextBox.hiddenTextarea?.focus();
                                prevTextBox.setCursorByClick({}); 
                                
                                // Atualiza o canvas
                                game.canvas.renderAll();
                            }
                        }
                    };
                    // Guarda referência ao handler para poder removê-lo depois
                    textBox.keyDownHandler = handleKeyDown;
                    // Adiciona o listener no hiddenTextarea do Fabric.js
                    if (textBox.hiddenTextarea) {
                        textBox.hiddenTextarea.addEventListener('keydown', handleKeyDown);
                    }
                }

                // Destaca todas as células da mesma palavra para orientação visual
                game.canvas.getObjects().forEach((obj) => {
                    if (!game.completedCells.includes(obj)) { // Se a célula não estiver completada
                        if (obj.cellName && obj.cellName.split('-').some(element => cell.cellName.split('-').includes(element))) { // Verifica se obj e cell estão na mesma palavra
                            grayHighlightCell(obj);
                            if ((game.userDirection === 'horizontal' && obj.top === cell.top) || (game.userDirection === 'vertical' && obj.left === cell.left)) {
                                highlightCell(obj);
                            }
                            // console.log('game.highlightedCells: ', game.highlightedCells)
                        }
                    }
                });

                game.activeCell = cell; // Define a célula ativa atual
            }

            /**
             * Marca uma palavra como completada corretamente
             * Destaca visualmente todas as células da palavra em verde
             * @param {Object} word - Objeto representando a palavra completada
             */
            function completeWord(word) {
                let { row, column, direction } = word;
                let cell;
                // Localiza a célula inicial da palavra
                game.canvas.getObjects().forEach((obj) => {
                    if (obj.cellName && obj.row === row && obj.column === column) {
                        cell = obj;
                    }
                });

                // Destaca todas as células desta palavra como completas
                game.canvas.getObjects().forEach((obj) => {
                    if (obj.cellName && obj.cellName.split('-').some(element => cell.cellName.split('-').includes(element))) { // Verifica se obj e cell estão na mesma palavra
                        if (direction === 'horizontal' && obj.top === cell.top && obj.left >= cell.left) { // Apenas células na mesma linha horizontal
                            const rect = obj._objects[0];
                            game.completedCells.push(obj)
                            rect.set('fill', 'lightgreen');
                        } else if (direction === 'vertical' && obj.left === cell.left && obj.top >= cell.top) { // Apenas células na mesma coluna vertical
                            const rect = obj._objects[0];
                            game.completedCells.push(obj)
                            rect.set('fill', 'lightgreen');
                        }
                    }
                });

                game.completedWords.push(word);
                // console.log('game.completedWords: ', game.completedWords)
                checkGameCompletion()
            }

            /**
             * Verifica se alguma palavra foi completada corretamente
             * Compara as letras inseridas pelo usuário com as palavras do tabuleiro
             */
            function checkWordCompletion() {
                for (let word of game.placedWords) {
                    if (game.completedWords.includes(word)) {
                        continue; // Pula palavras já completadas
                    }
                    let { row, column, direction } = word;
                    let i = 0;

                    if (direction === 'horizontal') {
                        while (i < word.word.length) {
                            if (game.board[row][column + i] !== game.userInput[row][column + i]) {
                                // console.log(`${game.board[row][column + i]} !== ${game.userInput[row][column + i]}`)
                                break; // Palavra está incorreta, interrompe verificação
                            }
                            i++;
                        }
                        if (i >= word.word.length) {
                            console.log('completeWord');
                            completeWord(word); // Palavra completa corretamente
                        }
                    }
                    else { // vertical
                        while (i < word.word.length) {
                            if (game.board[row + i][column] !== game.userInput[row + i][column]) {
                                // console.log(`${game.board[row + i][column]} !== ${game.userInput[row + i][column]}`)
                                break; // Palavra está incorreta, interrompe verificação
                            }
                            i++;
                        }
                        if (i >= word.word.length) {
                            console.log('completeWord');
                            completeWord(word); // Palavra completa corretamente
                        }
                    }
                }
            }

            /**
             * Verifica se todas as palavras do jogo foram completadas
             * Se sim, chama a função de finalização do jogo
             */
            function checkGameCompletion() {
                if (game.completedWords.length >= game.placedWords.length) {
                    completeGame();
                }
            }

            /**
             * Finaliza o jogo quando todas as palavras são completadas
             * Mostra mensagem de parabéns e opções para continuar
             */
            function completeGame() {
                setTimeout(() => {
                    alert('Parabéns! Você completou o jogo!')
                    if (confirm('Deseja jogar novamente?')){
                        location.reload();
                    } else {
                        window.location.href = '/rooms'
                    }
                }, 500);
            }

            /**
             * Encontra e retorna a próxima palavra não completada
             * Útil para navegação automática após completar uma palavra
             * @returns {Object|null} - Célula inicial da próxima palavra ou null
             */
            function goToNextWord() {
                // Procurar a próxima palavra que ainda não foi completada
                let nextWord = null;
        
                for (let i = 0; i < game.placedWords.length; i++) {
                    let word = game.placedWords[i];
        
                    // Verifica se a palavra ainda não foi completada
                    if (!game.completedWords.includes(word)) {
                        nextWord = word;
                        break; // Encontra a primeira palavra não completada
                    }
                }
        
                if (nextWord) {
                    // Encontra a célula inicial da próxima palavra
                    let { row, column, direction } = nextWord;
                    if (game.userDirection !== direction) {
                        toggleUserDirection();
                    }
        
                    // Encontra a célula correspondente
                    let startingCell = null;
                    game.canvas.getObjects().forEach((obj) => {
                        if (obj.cellName && obj.row === row && obj.column === column) {
                            startingCell = obj;
                        }
                    });
                    return startingCell;
                }
            }
        
            /**
             * Alterna a direção de entrada do usuário entre horizontal e vertical
             * Afeta como as células são destacadas e a navegação pelo tabuleiro
             */
            function toggleUserDirection() {
                game.userDirection = game.userDirection === 'vertical' ? 'horizontal' : 'vertical';
            }

            /**
             * Finaliza o modo de edição de uma célula
             * Limpa os listeners, valida o texto inserido e atualiza o estado do jogo
             */
            function stopEditingCell() {
                const textBox = game.activeCell._objects[1];

                // Remove o handler de eventos de teclado
                if (textBox.hiddenTextarea && textBox.keyDownHandler) {
                    textBox.hiddenTextarea.removeEventListener('keydown', textBox.keyDownHandler);
                }

                // Finaliza edição e formata o texto inserido
                textBox.exitEditing();
                textBox.set('editable', false);
                textBox.text = textBox.text.toUpperCase().replace(/[^A-ZÁÀÄÂÃÉÈËÊÍÌÏÎÓÒÖÔÕÚÙÜÛÇç]/g, '');

                // Atualiza a matriz de entrada do usuário
                game.userInput[row][column] = textBox.text.toLowerCase();

                // Remove o destaque visual de todas as células da mesma palavra
                game.canvas.getObjects().forEach((obj) => {
                    if (!game.completedCells.includes(obj)) {
                        // Verifica se obj e cell estão na mesma palavra
                        if (obj.cellName && obj.cellName.split('-').some(element => game.activeCell.cellName.split('-').includes(element))) {
                            unhighlightCell(obj);
                            // console.log('game.highlightedCells: ', game.highlightedCells)
                        }
                    }
                });

                game.activeCell = null; // Remove referência à célula ativa
                game.canvas.renderAll() // Atualiza o canvas
            }

            // Cria o retângulo de fundo da célula
            const rect = new fabric.Rect({
                left: GRID_SIZE * column,
                top: GRID_SIZE * row,
                width: GRID_SIZE,
                height: GRID_SIZE,
                stroke: '#8a3384',      // Cor da borda (roxo)
                fill: '#fff',           // Cor de fundo (branco)
                strokeWidth: 2,         // Espessura da borda
                rx: 5,                  // Raio da borda horizontal (cantos arredondados)
                ry: 5,                  // Raio da borda vertical
                lockMovementX: true,    // Impede movimento horizontal
                lockMovementY: true,    // Impede movimento vertical
                hasControls: false,     // Remove controles de manipulação
                selectable: false,      // Não permite seleção direta
            });

            // Cria a caixa de texto para entrada de letras
            const textBox = new fabric.Textbox('', {
                left: GRID_SIZE * column + 15, // Centralizado horizontalmente na célula
                top: GRID_SIZE * row + 10,     // Ligeiramente abaixo do topo da célula
                fontSize: GRID_SIZE / 1.6,     // Tamanho proporcional à célula
                fill: '#8a3384',               // Cor do texto (roxo)
                fontFamily: 'Courier New',     // Fonte monoespaçada
                fontWeight: 'bold',            // Texto em negrito
                editable: false,               // Não editável inicialmente
                hasControls: false,            // Remove controles de manipulação
                backgroundColor: 'transparent', // Fundo transparente
                stroke: null,                   // Sem borda
                hasBorders: false,              // Sem bordas
                transparentCorners: true,       // Cantos transparentes
                lockMovementX: true,            // Impede movimento horizontal
                lockMovementY: true,            // Impede movimento vertical
                selectable: false,              // Não permite seleção direta
            });

            // Agrupa o retângulo e o texto para formar uma célula completa
            const cell = new fabric.Group([rect, textBox], {
                row,                    // Coordenada da linha no tabuleiro
                column,                 // Coordenada da coluna no tabuleiro
                left: GRID_SIZE * column, // Posição X no canvas
                top: GRID_SIZE * row,   // Posição Y no canvas
                lockMovementX: true,    // Impede movimento horizontal
                lockMovementY: true,    // Impede movimento vertical
                hasControls: false,     // Remove controles de manipulação
                selectable: false,      // Não permite seleção direta
                evented: true,          // Permite eventos (cliques)
                cellName: game.wordLocations[row][column], // Identificador para palavras relacionadas
            });

            // Evento de clique na célula
            cell.on('mousedown', function () {
                // Se clicar na célula já ativa, alterna a direção
                if (game.activeCell && game.activeCell === cell) {
                    toggleUserDirection();
                }
                // Desativa a célula anterior se existir
                if (game.activeCell) {
                    stopEditingCell()
                }
                // Ativa a célula atual para edição
                startEditingCell(cell);
            });

            // Evento para quando o texto da célula é alterado
            textBox.on('changed', function () {
                let actualIndex = game.highlightedCells.indexOf(cell)
                let nextCell = game.highlightedCells[actualIndex + 1]
                
                // Finaliza edição desta célula
                stopEditingCell(cell)
                
                // Verifica se completou alguma palavra
                checkWordCompletion();

                // Navega para a próxima célula ou próxima palavra
                if (nextCell) {
                    startEditingCell(nextCell)
                } else {
                    nextCell = goToNextWord();
                    if(nextCell) {
                        startEditingCell(nextCell)
                    }
                }
            });

            // Adiciona a célula ao canvas
            game.canvas.add(cell);
        };

        /**
         * Cria e posiciona os rótulos numéricos para as palavras
         * @param {number} row - Linha inicial da palavra
         * @param {number} column - Coluna inicial da palavra
         * @param {Object} word - Objeto representando a palavra
         */
        const createWordLabel = (row, column, word) => {
            const wordLabelText = String(game.placedWords.indexOf(word) + 1)

            // Verifica se já existe um rótulo nesta posição
            for (let obj of game.canvas.getObjects()) {
                if (obj.text) { // Se for um objeto de texto (rótulo)
                    if (obj.row === row && obj.column === column) { // Se estiver na mesma posição
                        // Concatena os números separados por hífen
                        obj.text += '-' + wordLabelText;
                        return;
                    }
                }
            }

            // Cria um novo rótulo numérico
            const wordLabel = new fabric.Text(wordLabelText, {
                row,
                column,
                left: GRID_SIZE * column + 5,
                top: GRID_SIZE * row,
                fontSize: GRID_SIZE / 3,
                fill: '#8a3384',
                editable: false,
                hasControls: false,
                lockMovementX: true,
                lockMovementY: true,
                selectable: false
            });
            game.canvas.add(wordLabel);
        }

        // Inicializa o canvas do Fabric.js
        game.canvas = new fabric.Canvas(document.querySelector('#game-board'));
        game.canvas.hoverCursor = 'pointer'; // Cursor de mão ao passar sobre células
        
        // Renderiza cada célula do tabuleiro
        game.board.forEach((row, rowIndex) => {
            row.forEach((char, colIndex) => {
                if (char) { // Se houver uma letra nesta posição
                    // Cria a célula para esta letra
                    createCrosswordCell(rowIndex, colIndex);

                    // Adiciona rótulo numérico se for o início de uma palavra
                    for (let word of game.placedWords) {
                        if (word.row === rowIndex && word.column === colIndex) {
                            createWordLabel(rowIndex, colIndex, word);
                        }
                    }
                }
            });
        });
    }

    /**
     * Exibe as dicas das palavras na interface
     * Cria uma lista ordenada com as dicas e informações de cada palavra
     */
    function displayClues() {
        const ol = document.querySelector('#game-clues')
        game.placedWords.forEach(entry => {
            const newLi = document.createElement('li');
            newLi.innerHTML = `${entry.clue} (${entry.direction}) - Posição: (${entry.row}, ${entry.column})`;
            ol.append(newLi);
        });
    }

    // Constrói a estrutura HTML básica do jogo
    const container = document.querySelector('#game-container');
    container.innerHTML = `
      <div class="game-layout">
        <div class="game-clues-container">
          <h3>Game Clues</h3>
          <ol id="game-clues"></ol>
        </div>
        <div class="game-info">
          <h2>Room Information</h2>
          <p class="room-detail">Room Name: ${room.name}</p>
          <p class="room-detail">Theme: ${room.theme}</p>
          <p class="room-detail">Created By: ${room.owner}</p>
        </div>
        <div class="game-board-container">
          <canvas width="${CANVAS_SIZE}" height="${CANVAS_SIZE}" id="game-board">
            The game is loading or can't load on your browser.
          </canvas>
        </div>
      </div>
    `;

    // Renderiza o tabuleiro e as dicas
    displayBoard();
    displayClues();

    /**
     * Manipula cliques fora das células destacadas
     * Remove o destaque das células quando o usuário clica em outra área
     * @param {Object} event - Objeto de evento do Fabric.js
     */
    function handleClickOutside(event) {
        // Obter coordenadas do clique em relação ao canvas
        const pointer = game.canvas.getPointer(event.e);
        const clickedObject = game.canvas.findTarget(event.e);
        
        // Verifica se clicou fora das células destacadas
        const clickedHighlightedCell = game.highlightedCells.find(cell => {
            return clickedObject === cell;
        });

        if (!clickedHighlightedCell) {
            // Get all cells (not just highlighted ones in the array)
            game.canvas.getObjects().forEach(obj => {
                // Check if it's a cell (has _objects)
                if (obj._objects && obj._objects[0]) {
                    const rect = obj._objects[0];
                    const textBox = obj._objects[1];
                    
                    // Exit editing if needed
                    if (textBox && textBox.isEditing) {
                        textBox.exitEditing();
                        textBox.set('editable', false);
                    }
                    
                    // Reset fill color unless it's a completed cell
                    if (!game.completedCells.includes(obj)) {
                        rect.set('fill', 'white');
                    }
                }
            });
            
            // Clear highlighted cells array
            game.highlightedCells = [];
            
            // Update canvas
            game.canvas.renderAll();
        }
    }

    // Adiciona evento de clique no canvas para lidar com cliques fora das células
    game.canvas.on('mouse:down', handleClickOutside);
}

// Inicializa o jogo com os dados recebidos do servidor
displayGame(room.game)

// Informações de debug
console.log('themeArray: ', room.game.themeArray);
console.log('size: ', room.game.size);
console.log('canvasSize: ', room.CANVAS_SIZE);
console.log('board: ', room.game.board);
console.log('userInput: ', room.game.userInput)
console.log('canvas: ', room.game.canvas);
console.log('placedWords: ', room.game.placedWords);
console.log('wordLocations: ', room.game.wordLocations);
