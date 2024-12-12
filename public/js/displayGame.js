displayGame = (game) => {
    function displayBoard() {

        // Função para criar uma célula de palavras cruzadas
        const createCrosswordCell = (row, column, char, cellName) => {
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
                left: game.gridSize * column,
                top: game.gridSize * row,
                lockMovementX: true,
                lockMovementY: true,
                hasControls: false,
                selectable: false,
                evented: true,
                cellName, // Nome para identificar grupos relacionados
            });

            //CLICOU
            cell.on('mousedown', function () {
                if (game.activeCell) {
                    return; // Impede a edição de outra célula enquanto há uma ativa
                }

                rect.set('fill', 'lightblue');

                textBox.set('editable', true);
                textBox.enterEditing();
                textBox.selectAll();
                game.activeCell = cell; // Define a célula ativa

                game.canvas.renderAll();
            });

            //DIGITOU
            textBox.on('changed', function () {
                console.log(game.board)
                console.log(game.userInput)
                let currentText = textBox.text;
                textBox.text = currentText.replace(/[^a-zA-ZáàäâãéèëêíìïîóòöôõúùüûçÇ]/g, ''); // Remove non-letter characters
                textBox.exitEditing();
                game.canvas.renderAll(); // Atualizar o texto no canvas imediatamente
            });

            //SAIU
            textBox.on('editing:exited', function () {
                game.userInput[row][column] = this.text;
                rect.set('fill', 'transparent');
                textBox.set('editable', false);
                game.activeCell = null; // Libera a célula ativa
                game.canvas.renderAll();
            });

            game.canvas.add(cell);
        };

        const createWordLabel = (row, column, word) => {
            const wordText = String(game.placedWords.indexOf(word) + 1)
            const wordLabel = new fabric.Text(wordText, {
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

        // Renderizar o tabuleiro
        game.board.forEach((row, rowIndex) => {
            row.forEach((char, colIndex) => {
                if (char !== ' ') {
                    // Criar a célula do caractere
                    createCrosswordCell(rowIndex, colIndex, char, `cell-${rowIndex}-${colIndex}`);

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

    function displayClues(ol) {
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
    game.canvas = new fabric.Canvas(document.querySelector('#game-board'));
    game.canvas.hoverCursor = 'default';
    displayBoard();
    displayClues(document.querySelector('#game-clues'));
}