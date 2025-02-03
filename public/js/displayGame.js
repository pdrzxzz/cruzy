displayGame = (game) => {
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
                    console.log('You won!!!')
                }
            }

            function stopEditingCell() {
                const textBox = game.activeCell._objects[1]

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
            }

            const rect = new fabric.Rect({
                left: game.gridSize * column,
                top: game.gridSize * row,
                width: game.gridSize,
                height: game.gridSize,
                stroke: 'black',
                fill: 'transparent',
                strokeWidth: 2,
                lockMovementX: true,
                lockMovementY: true,
                hasControls: false,
                selectable: false,
            });

            const textBox = new fabric.Textbox('', {
                left: game.gridSize * column + 15,
                top: game.gridSize * row + 10,
                fontSize: game.gridSize / 1.6,
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
                left: game.gridSize * column,
                top: game.gridSize * row,
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
                    game.toggleUserDirection();
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
                    startEditingCell(goToNextWord())
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
                left: game.gridSize * column + 5,
                top: game.gridSize * row,
                fontSize: game.gridSize / 3,
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
        game.canvas.hoverCursor = 'default';
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
                game.toggleUserDirection();
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
        <p>Game Board</p>
        <canvas width="${game.canvasSize}" height="${game.canvasSize}" id="game-board">The game is loading or can't load on your browser.</canvas>
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