import { CELL_VALUE, GAME_STATUS, TURN } from './constants.js';
import {
    getCellElementAtIdx,
    getCellElementList,
    getCurrentTurnElement,
    getGameStatusElement,
    getReplayButtonElement,
} from './selectors.js';

import { checkGameStatus } from './utils.js';
/**
 * Global variables
 */
let currentTurn = TURN.CROSS;
let gameStatus = GAME_STATUS.PLAYING;
let cellValues = new Array(9).fill('');

const setCurrentTurn = (currentTurnElement, turn = currentTurn) => {
    currentTurnElement.classList.remove(TURN.CROSS, TURN.CIRCLE);
    currentTurnElement.classList.add(turn);
};

const toggleTurn = () => {
    currentTurn = currentTurn === TURN.CROSS ? TURN.CIRCLE : TURN.CROSS;
    const currentTurnElement = getCurrentTurnElement();

    setCurrentTurn(currentTurnElement);
};

const updateGameStatus = (status) => {
    gameStatus = status;

    const gameStatusElement = getGameStatusElement();
    gameStatusElement.textContent = gameStatus;
};

const showReplayButton = () => {
    const replayButton = getReplayButtonElement();
    replayButton.classList.add('show');
};

const hideReplayButton = () => {
    const replayButton = getReplayButtonElement();
    replayButton.classList.remove('show');
};

const highlightWinCells = (winPositions) => {
    if (!Array.isArray(winPositions) || winPositions.length !== 3) return;
    winPositions.forEach((position) => {
        const cell = getCellElementAtIdx(position);
        cell.classList.add('win');
    });
};

const handleCellClick = (cell, index) => {
    const isClicked =
        cell.classList.contains(TURN.CIRCLE) || cell.classList.contains(TURN.CROSS);

    const isEndGame = gameStatus !== GAME_STATUS.PLAYING;
    // allow click when game is playing and that cell is clicked
    if (isEndGame || isClicked) return;
    // set selected sell
    cell.classList.add(currentTurn);

    // update cell values
    cellValues[index] =
        currentTurn === TURN.CIRCLE ? CELL_VALUE.CIRCLE : CELL_VALUE.CROSS;

    // check game status
    const game = checkGameStatus(cellValues);
    switch (game.status) {
        case GAME_STATUS.ENDED:
            updateGameStatus(game.status);
            showReplayButton();
            break;
        case GAME_STATUS.X_WIN:
        case GAME_STATUS.O_WIN:
            updateGameStatus(game.status);
            showReplayButton();
            highlightWinCells(game.winPositions);
            break;
        default:
    }

    // toggle turn
    toggleTurn();
};

const initCellElements = () => {
    const cellElements = getCellElementList();
    cellElements.forEach((cell, index) => {
        cell.addEventListener('click', () => {
            handleCellClick(cell, index);
        });
    });
};

const resetGame = () => {
    // reset global variables
    currentTurn = TURN.CROSS;
    gameStatus = GAME_STATUS.PLAYING;
    cellValues = cellValues.map((cell) => (cell = ''));

    updateGameStatus(gameStatus);

    // reset current turn
    const currentTurnElement = getCurrentTurnElement();
    setCurrentTurn(currentTurnElement);

    // reset game board
    const cellElements = getCellElementList();
    cellElements.forEach((cell) => {
        cell.className = '';
    });

    // hide replay button
    hideReplayButton();
};

const initReplayButton = () => {
    const replayButton = getReplayButtonElement();
    replayButton.addEventListener('click', resetGame);
};

// MAIN
initCellElements();
initReplayButton();

/**
 * TODOs
 *
 * 1. Bind click event for all cells
 * 2. On cell click, do the following:
 *    - Toggle current turn
 *    - Mark current turn to the selected cell
 *    - Check game state: win, ended or playing
 *    - If game is win, highlight win cells
 *    - Not allow to re-click the cell having value.
 *
 * 3. If game is win or ended --> show replay button.
 * 4. On replay button click --> reset game to play again.
 *
 */
