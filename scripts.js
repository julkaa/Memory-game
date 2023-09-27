import {MatchGrid} from "./matchGrid.js";

const theme = ['#594B12', '#0FA3B1', '#F7A072', '#8C3608', '#E6C229', '#F5E2C8'];
let isPlaying = false;
let matchGrid;

const startBtn = document.getElementById('start-btn');
const resetBtn = document.getElementById('reset-btn');

startBtn.addEventListener('click', () => {
    if (!isPlaying) {
        matchGrid = new MatchGrid(500, 500, 4, 3, 0, theme);

        matchGrid.createCards();
        matchGrid.renderGame();
        matchGrid.startTimer();

        isPlaying = true;
    }
});

resetBtn.addEventListener('click', () => {
    const memoryGameContainer = document.getElementById('memory-game');
    const pauseMessage = document.getElementById('pause-message');

    isPlaying = false;

    pauseMessage.style.display = 'none';
    memoryGameContainer.innerHTML = '';
    memoryGameContainer.classList.remove('overlay');

    matchGrid.resetTimer();
});
