displayGame = (game) => {
    function displayBoard() {

        // Função para criar uma célula de palavras cruzadas
        const createCrosswordCell = (row, column, char, groupName) => {
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

            const textBox = new fabric.Textbox(char, {
                left: game.gridSize * column + 15,
                top: game.gridSize * row,
                width: game.gridSize - 30,
                height: game.gridSize - 20,
                fontSize: game.gridSize / 1.5,
                fill: 'black',
                editable: false, // Inicialmente desativado
                hasControls: false,
                backgroundColor: 'transparent',
                stroke: null,
                hasBorders: false,
                lockMovementX: true,
                lockMovementY: true,
                selectable: false
            });

            // Agrupar os elementos relacionados à célula
            const group = new fabric.Group([rect, textBox], {
                left: game.gridSize * column,
                top: game.gridSize * row,
                lockMovementX: true,
                lockMovementY: true,
                hasControls: false,
                selectable: false,
                evented: true,
                groupName, // Nome para identificar grupos relacionados
            });

            // Adicionar evento de clique no grupo
            group.on('mousedown', function () {
                // Destacar o retângulo
                rect.set('fill', 'lightblue');
                game.canvas.renderAll();

                // Ativar edição do `Textbox`
                textBox.set('editable', true);
                game.canvas.setActiveObject(textBox);
                textBox.enterEditing();

                // Selecionar todo o texto automaticamente
                setTimeout(() => {
                    textBox.selectAll();
                    game.canvas.renderAll();
                }, 0);
            });

            // Atualizar canvas em tempo real ao digitar
            textBox.on('changed', function () {
                game.canvas.renderAll(); // Atualizar o texto no canvas imediatamente
            });

            // Remover destaque ao sair da edição
            textBox.on('editing:exited', function () {
                rect.set('fill', 'transparent');
                textBox.set('editable', false);
                game.canvas.renderAll();
            });

            game.canvas.add(group);
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
                    createCrosswordCell(rowIndex, colIndex, char, `group-${rowIndex}-${colIndex}`);

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
      <canvas width="${game.canvasSize}" height="${game.canvasSize}" id="game-board">The game is loading or can't load on your browser.</canvas>
      <div>
        <p>Game Clues<p>
        <ol id="game-clues"></ol>
      </div>
    `;
    game.canvas = new fabric.Canvas(document.querySelector('#game-board'));
    game.canvas.hoverCursor = 'default';
    displayBoard();
    displayClues(document.querySelector('#game-clues'));
}