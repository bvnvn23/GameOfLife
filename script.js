document.addEventListener('DOMContentLoaded', () => {
    const columnInput = document.getElementById('column');
    const rowInput = document.getElementById('row');
    const grid = document.querySelector('.grid');
    const startButton = document.querySelector('.start');
    const stopButton = document.querySelector('.stop');
    const clearButton = document.querySelector('.clear');
    const randomButton = document.querySelector('.random');
    const message = document.getElementById('message');

    let hidden = false;

    function toggleDisplay(elements, displayStyle) {
        elements.forEach(element => {
            if (element) {
                element.style.display = displayStyle;
            } else {
                console.error('Element not found:', element);
            }
        });
    }

    // Grid and menu logic
    function hiddenMenu() { 
        hidden = !hidden;
        if (hidden) {
            toggleDisplay([startButton, stopButton, clearButton, randomButton], 'none');
            grid.textContent = '';
            toggleDisplay([columnInput, rowInput, message], 'block');
        } else { 
            toggleDisplay([startButton, stopButton, clearButton, randomButton], 'block');
            toggleDisplay([columnInput, rowInput, message], 'none');
        }
    }
    
    function getValues() {
        const columns = parseInt(columnInput.value, 10);
        const rows = parseInt(rowInput.value, 10);
        if (isNaN(columns) || isNaN(rows)) {
            alert('Please enter a valid number for both columns and rows');
            return;
        }
        if (columns < 5 || rows < 5 || columns > 50) {
            alert('Please enter a number between 5 and 50 for both columns and rows');
            return;
        }
        return { columns, rows };
    }

    function handleKeyPress(event) {
        if (event.key === 'Enter') {
            const values = getValues();
            if (values) {
                grid.textContent = '';
                createGrid(values.columns, values.rows);
                hiddenMenu(); 
            }
        }
    }

    function createGrid(columns, rows) {
        grid.style.gridTemplateRows = `repeat(${rows}, 20px)`;
        grid.style.gridTemplateColumns = `repeat(${columns}, 20px)`;
        let isDrawing = false;
    
        for (let i = 0; i < columns * rows; i++) {
            let cell = document.createElement('div');
            cell.className = 'cell';
            cell.style.backgroundColor = 'lightslategray';
    
            cell.addEventListener('click', () => {
                if (cell.style.backgroundColor === 'lightslategray') {
                    cell.style.backgroundColor = 'lightcoral';
                } else {
                    cell.style.backgroundColor = 'lightslategray';
                }
            });
    

            cell.addEventListener('mousedown', () => {
                isDrawing = true;
            });
    
            cell.addEventListener('mouseup', () => {
                isDrawing = false;
            });
    
            cell.addEventListener('mouseenter', () => {
                if (isDrawing) {
                    if (cell.style.backgroundColor === 'lightslategray') {
                        cell.style.backgroundColor = 'lightcoral';
                    } else {
                        cell.style.backgroundColor = 'lightslategray';
                    }
                }
            });
    
            grid.appendChild(cell);
        }
    
        grid.addEventListener('mouseleave', () => {
            isDrawing = false;
        });
    }
    
    

    function randomizeGrid() {
        const cells = document.querySelectorAll('.cell');
        cells.forEach(cell => {
            const randomColor = Math.random() > 0.5 ? 'lightcoral' : 'lightslategray';
            cell.style.backgroundColor = randomColor;
        });
    }

    function clearGrid() {
        const cells = document.querySelectorAll('.cell');
        cells.forEach(cell => {
            cell.style.backgroundColor = 'lightslategray';
        });
    }

    // cells logic

    function getCellIndex(row, column, columns) {
        return (row * columns) + column; 
    }

    function isAlive(cell, columns, cells) {
        if (cell.style.backgroundColor === 'lightcoral') {
            return 1;
        }
        return 0;
    }

    function getAliveNeighbors(cellIndex, columns, cells) {
        let aliveNeighbors = 0;
        const cell = cells[cellIndex];
        const row = Math.floor(cellIndex / columns);
        const column = cellIndex % columns;
        for (let i = row - 1; i <= row + 1; i++) {
            for (let j = column - 1; j <= column + 1; j++) {
                if (i >= 0 && i < columns && j >= 0 && j < columns) {
                    const neighborIndex = getCellIndex(i, j, columns);
                    if (neighborIndex !== cellIndex) {
                        aliveNeighbors += isAlive(cells[neighborIndex], columns, cells);
                    }
                }
            }
        }
        return aliveNeighbors;
    }

    function updateCells(columns, cells) {
        const newCells = [];
        cells.forEach((cell, index) => {
            const aliveNeighbors = getAliveNeighbors(index, columns, cells);
            if (cell.style.backgroundColor === 'lightcoral') {
                if (aliveNeighbors < 2 || aliveNeighbors > 3) {
                    newCells.push('lightslategray');
                } else {
                    newCells.push('lightcoral');
                }
            } else {
                if (aliveNeighbors === 3) {
                    newCells.push('lightcoral');
                } else {
                    newCells.push('lightslategray');
                }
            }
        });
        return newCells;
    }
    
    function updateGrid(columns, cells) {
        const newCells = updateCells(columns, cells);
        cells.forEach((cell, index) => {
            cell.style.backgroundColor = newCells[index];
        });
    }
    
    let intervalId = null;
    
    function startGame() {
        if (intervalId !== null) {
            clearInterval(intervalId);
        }
        intervalId = setInterval(() => {
            const cells = document.querySelectorAll('.cell');
            const columns = Math.sqrt(cells.length);
            updateGrid(columns, cells);
        }, 500);
        console.log('Game started, intervalId:', intervalId);
    }
    
    function stopGame() {
        if (intervalId !== null) {
            clearInterval(intervalId);
            console.log('Game stopped, intervalId:', intervalId);
            intervalId = null;
        }
    }
    
    // Event listeners
    
    hiddenMenu();
    
    columnInput.addEventListener('keypress', handleKeyPress);
    rowInput.addEventListener('keypress', handleKeyPress);
    startButton.addEventListener('click', () => {
        const values = getValues();
        if (values) {
            startGame();
        }
    });
    stopButton.addEventListener('click', stopGame);
    clearButton.addEventListener('click', clearGrid);
    randomButton.addEventListener('click', randomizeGrid);

    // Add event listener to handle drawing outside the grid
    document.addEventListener('mouseup', () => {
        isDrawing = false;
    });
});