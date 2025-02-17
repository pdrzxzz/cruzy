
displayGame = (game) => {
    const GRID_SIZE = 50; //Tamanho de cada bloquinho
    const CANVAS_SIZE = GRID_SIZE * game.size + 5; //Tamanho inicial do canvas

    function displayBoard() {

        // Função para criar uma célula de palavras cruzadas
        const createCrosswordCell = (row, column) => {

            function highlightCell(cell) {
                game.highlightedCells.push(cell)
                const rect = cell._objects[0]
                rect.set('fill', 'lightblue');
            }

            function unhighlightCell(cell) {
                game.highlightedCells.splice(game.highlightedCells.indexOf(cell), 1)
                const rect = cell._objects[0]
                rect.set('fill', 'white'); // Altere a cor desejada para as células na linha
            }

            function grayHighlightCell(cell) {
                const rect = cell._objects[0]
                rect.set('fill', '#e6e6e6');
            }

            function startEditingCell(cell) {

                if (!game.completedCells.includes(cell)) { //Se a célula não tiver sido completada
                    const textBox = cell._objects[1]
                    textBox.set('editable', true);
                    textBox.enterEditing();
                    textBox.selectAll();

                    // Add keydown listener using hiddenTextarea, which is used by fabric.js
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
                    // atribuindo a função à propriedade keyDownHandler do textBox para que seja possível removê-la posteriormente
                    textBox.keyDownHandler = handleKeyDown;
                    // adicionando o listener ao hiddenTextarea
                    if (textBox.hiddenTextarea) {
                        textBox.hiddenTextarea.addEventListener('keydown', handleKeyDown);
                    }
                }

                // Destaca todas as células da mesma palavra
                game.canvas.getObjects().forEach((obj) => {
                    if (!game.completedCells.includes(obj)) { //Se a célula não tiver sido concluida
                        if (obj.cellName && obj.cellName.split('-').some(element => cell.cellName.split('-').includes(element))) { // Verifica se obj e cell estão na mesma palavra
                            grayHighlightCell(obj);
                            if ((game.userDirection === 'horizontal' && obj.top === cell.top) || (game.userDirection === 'vertical' && obj.left === cell.left)) {
                                highlightCell(obj);
                            }
                            // console.log('game.highlightedCells: ', game.highlightedCells)
                        }
                    }
                });

                game.activeCell = cell; // Define a célula ativa    
            }

            function completeWord(word) {
                let { row, column, direction } = word;
                let cell;
                //This loop finds the cell on row, column position
                game.canvas.getObjects().forEach((obj) => {
                    if (obj.cellName && obj.row === row && obj.column === column) {
                        cell = obj;
                    }
                });

                // Highlights the correct objs based on cell and direction (from completed word)
                game.canvas.getObjects().forEach((obj) => {
                    if (obj.cellName && obj.cellName.split('-').some(element => cell.cellName.split('-').includes(element))) { // Verifica se obj e cell estão na mesma palavra
                        if (direction === 'horizontal' && obj.top === cell.top && obj.left >= cell.left) { // Apenas objetos na mesma horizontal e para direita
                            const rect = obj._objects[0];
                            game.completedCells.push(obj)
                            rect.set('fill', 'lightgreen');
                        } else if (direction === 'vertical' && obj.left === cell.left && obj.top >= cell.top) { // Apenas objetos na mesma vertical e para baixo
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

            function checkWordCompletion() {
                for (let word of game.placedWords) {
                    if (game.completedWords.includes(word)) {
                        continue;
                    }
                    let { row, column, direction } = word;
                    let i = 0;

                    if (direction === 'horizontal') {
                        while (i < word.word.length) {
                            if (game.board[row][column + i] !== game.userInput[row][column + i]) { //if wrong letter, break. if not wrong letter, continue.
                                // console.log(`${game.board[row][column + i]} !== ${game.userInput[row][column + i]}`)
                                break; //wrong word
                            }
                            i++;
                        }
                        if (i >= word.word.length) {
                            console.log('completeWord');
                            completeWord(word);
                        }
                    }


                    else { //vertical
                        while (i < word.word.length) {
                            if (game.board[row + i][column] !== game.userInput[row + i][column]) { //if wrong letter, break. if not wrong letter, continue.
                                // console.log(`${game.board[row + i][column]} !== ${game.userInput[row + i][column]}`)
                                break; //wrong word
                            }
                            i++;
                        }
                        if (i >= word.word.length) {
                            console.log('completeWord');
                            completeWord(word);
                        }
                    }

                }
            }

            function checkGameCompletion() {
                if (game.completedWords.length >= game.placedWords.length) {
                    completeGame();
                }
            }

            function completeGame() {
                console.log('you won')
            }

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
        
                    // Encontrar a célula correspondente
                    let startingCell = null;
                    game.canvas.getObjects().forEach((obj) => {
                        if (obj.cellName && obj.row === row && obj.column === column) {
                            startingCell = obj;
                        }
                    });
                    return startingCell;
                }
            }
        
            function toggleUserDirection() {
                game.userDirection = game.userDirection === 'vertical' ? 'horizontal' : 'vertical';
            }

            function stopEditingCell() {
                const textBox = game.activeCell._objects[1];

                // hiddenTextArea é usado para capturar eventos de teclado
                if (textBox.hiddenTextarea && textBox.keyDownHandler) {
                    // para de ouvir eventos de teclado no hiddenTextarea quando a célula é desativada
                    textBox.hiddenTextarea.removeEventListener('keydown', textBox.keyDownHandler);
                }

                // Remove caracteres não permitidos
                textBox.exitEditing();
                textBox.set('editable', false);
                textBox.text = textBox.text.toUpperCase().replace(/[^A-ZÁÀÄÂÃÉÈËÊÍÌÏÎÓÒÖÔÕÚÙÜÛÇç]/g, '');

                game.userInput[row][column] = textBox.text.toLowerCase();

                // Tira o destaque de todas as células da mesma palavra
                game.canvas.getObjects().forEach((obj) => {
                    if (!game.completedCells.includes(obj)) { //Se a célula não tiver sido concluida
                        if (obj.cellName && obj.cellName.split('-').some(element => game.activeCell.cellName.split('-').includes(element))) {// Verifica se obj e cell estão na mesma palavra
                            unhighlightCell(obj);
                            // console.log('game.highlightedCells: ', game.highlightedCells)
                        }
                    }
                });

                game.activeCell = null; // Libera a célula ativa
                game.canvas.renderAll()
            }

            const rect = new fabric.Rect({
                left: GRID_SIZE * column,
                top: GRID_SIZE * row,
                width: GRID_SIZE,
                height: GRID_SIZE,
                stroke: 'black',
                fill: 'transparent',
                strokeWidth: 2,
                lockMovementX: true,
                lockMovementY: true,
                hasControls: false,
                selectable: false,
            });

            const textBox = new fabric.Textbox('', {
                left: GRID_SIZE * column + 15,
                top: GRID_SIZE * row + 10,
                fontSize: GRID_SIZE / 1.6,
                fill: 'black',
                editable: false, // Inicialmente desativado
                hasControls: false,
                backgroundColor: 'transparent',
                stroke: null,
                hasBorders: false,
                transparentCorners: true,
                lockMovementX: true,
                lockMovementY: true,
                selectable: false,
            });

            // Agrupar os elementos relacionados à célula
            const cell = new fabric.Group([rect, textBox], {
                row,
                column,
                left: GRID_SIZE * column,
                top: GRID_SIZE * row,
                lockMovementX: true,
                lockMovementY: true,
                hasControls: false,
                selectable: false,
                evented: true,
                cellName: game.wordLocations[row][column], // Nome para identificar grupos relacionados
            });

            //CLICOU
            cell.on('mousedown', function () {
                //Se clicar na mesma célula
                if (game.activeCell && game.activeCell === cell) {
                    toggleUserDirection();
                }
                //Se tiver uma célula ativa, desativá-la
                if (game.activeCell) {
                    stopEditingCell()
                }
                //Se a palavra da célula clicada não estiver completada
                startEditingCell(cell);
            });

            //DIGITOU
            textBox.on('changed', function () {
                let actualIndex = game.highlightedCells.indexOf(cell)
                let nextCell = game.highlightedCells[actualIndex + 1]
                //Finaliza edição dessa célula
                stopEditingCell(cell)
                checkWordCompletion();

                // Move para a próxima célula
                if (nextCell) {
                    startEditingCell(nextCell)
                } else {
                    nextCell = goToNextWord();
                    if(nextCell) {
                        startEditingCell(nextCell)
                    }
                    
                }
            });

            game.canvas.add(cell);
        };

        const createWordLabel = (row, column, word) => {
            const wordLabelText = String(game.placedWords.indexOf(word) + 1)

            //Check if there's already a word label at this position
            for (let obj of game.canvas.getObjects()) {
                if (obj.text) { //if it's a wordlabel (not the best checking but work for now)
                    if (obj.row === row && obj.column === column) { //If at this position
                        // console.log('Sobreposição!!!');
                        obj.text += '-' + wordLabelText;
                        return;
                    }
                }
            }

            const wordLabel = new fabric.Text(wordLabelText, {
                row,
                column,
                left: GRID_SIZE * column + 5,
                top: GRID_SIZE * row,
                fontSize: GRID_SIZE / 3,
                fill: 'red',
                editable: false,
                hasControls: false,
                lockMovementX: true,
                lockMovementY: true,
                selectable: false
            });
            game.canvas.add(wordLabel);
        }

        game.canvas = new fabric.Canvas(document.querySelector('#game-board'));
        game.canvas.hoverCursor = 'pointer';
        // Renderizar o tabuleiro
        game.board.forEach((row, rowIndex) => {
            row.forEach((char, colIndex) => {
                if (char) {
                    // Criar a célula do caractere
                    createCrosswordCell(rowIndex, colIndex);

                    // Adiciona word label, se for o primeiro caractere da palavra
                    for (let word of game.placedWords) {
                        if (word.row === rowIndex && word.column === colIndex) {
                            createWordLabel(rowIndex, colIndex, word);
                        }
                    }
                }
            });

        });
    }

    function displayClues() {
        const ol = document.querySelector('#game-clues')
        game.placedWords.forEach(entry => {
            const newLi = document.createElement('li');
            newLi.innerHTML = `${entry.clue} (${entry.direction}) - Posição: (${entry.row}, ${entry.column})`;
            ol.append(newLi);
        });
    }

    const container = document.querySelector('#game-container');
    container.innerHTML = `
      <div>
        <p>Room Name: ${room.name}</p>
        <p>Theme: ${room.theme}</p>
        <p>Created By: ${room.owner}</p>
        <canvas width="${CANVAS_SIZE}" height="${CANVAS_SIZE}" id="game-board">The game is loading or can't load on your browser.</canvas>
      </div>
      <div>
        <p>Game Clues</p>
        <ol id="game-clues"></ol>
      </div>
    `;

    displayBoard();
    displayClues();

    function handleClickOutside(event) {
        // Get click coordinates relative to canvas
        const pointer = game.canvas.getPointer(event.e);
        const clickedObject = game.canvas.findTarget(event.e);
        
        // Check if click is outside highlighted cells
        const clickedHighlightedCell = game.highlightedCells.find(cell => {
            return clickedObject === cell;
        });

        if (!clickedHighlightedCell) {
            // Stop editing for all highlighted cells
            game.highlightedCells.forEach(cell => {
                const textBox = cell._objects[1];
                if (textBox.isEditing) {
                    textBox.exitEditing();
                }
                textBox.set('editable', false);
                
                // Remove highlight
                const rect = cell._objects[0];
                rect.set('fill', 'white');
            });
            
            // Clear highlighted cells array
            game.highlightedCells = [];
            
            // Render canvas to show changes
            game.canvas.renderAll();
        }
    }

    // Add event listener to canvas
    game.canvas.on('mouse:down', handleClickOutside);
}

displayGame(room.game)

console.log('themeArray: ', room.game.themeArray);
console.log('size: ', room.game.size);
console.log('canvasSize: ', room.CANVAS_SIZE);
console.log('board: ', room.game.board);
console.log('userInput: ', room.game.userInput)
console.log('canvas: ', room.game.canvas);
console.log('placedWords: ', room.game.placedWords);
console.log('wordLocations: ', room.game.wordLocations);
