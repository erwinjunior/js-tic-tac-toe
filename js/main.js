import { TURN } from './constants.js';
import {
    getCellElementAtIdx,
    getCellElementList,
    getCurrentTurnElement,
    getGameStatusElement,
} from './selectors.js';

/**
 * Global variables
 */
let currentTurn = TURN.CROSS;
let isGameEnded = false;
let cellValues = new Array(9).fill('');

const toggleTurn = () => {
    currentTurn = currentTurn === TURN.CROSS ? TURN.CIRCLE : TURN.CROSS;
    const currentTurnElement = getCurrentTurnElement();

    if (currentTurnElement) {
        currentTurnElement.classList.remove(TURN.CROSS, TURN.CIRCLE);
        currentTurnElement.classList.add(currentTurn);
    }
};

const handleCellClick = (cell, index) => {
    const isClicked =
        cell.classList.contains(TURN.CIRCLE) || cell.classList.contains(TURN.CROSS);
    if (isClicked) return;
    // set selected sell
    cell.classList.add(currentTurn);

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

initCellElements();

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
