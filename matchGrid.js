import {Card} from "./card.js";

export class MatchGrid {
    hasFlippedCard = false;
    lockBoard = false;
    firstCard;
    secondCard;
    pauseMessage = document.getElementById('pause-message');
    memoryGameContainer = document.getElementById('memory-game');

    timer = 0;
    timerInterval = null;
    startTime = null;

    constructor(width, height, cols, rows, timeLimit, theme) {
        this.width = width;
        this.height = height;
        this.cols = cols;
        this.rows = rows;
        this.timeLimit = timeLimit;
        this.theme = theme;
    }

    createCards() {
        let index = 0;

        for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < this.cols; j++) {
                let card = new Card(this.theme[index], index);
                index++;
                if (index === (this.cols * this.rows) / 2) index = 0;

                this.appendHtml('memory-game', card.getCardHtml());
            }
        }
    }

    appendHtml(parentId, html) {
        const parentElement = document.getElementById(parentId);
        if (parentElement) {
            const div = document.createElement('div');
            div.innerHTML = html;
            parentElement.appendChild(div.children[0]);
        }
    }

    updateTimerDisplay() {
        const timerElement = document.getElementById('timer');
        if (timerElement) {
            const minutes = Math.floor(this.timer / 60);
            const seconds = this.timer % 60;
            const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
            timerElement.textContent = formattedTime;
        }
    }

    createTimeInterval() {
        this.timerInterval = setInterval(() => {
            const currentTime = Date.now();
            this.timer = Math.floor((currentTime - this.startTime) / 1000);
            this.updateTimerDisplay();
        }, 1000);
    }

    startTimer() {
        this.timer = this.timeLimit;
        this.startTime = Date.now();
        this.createTimeInterval();
    }

    pauseTimer() {
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
            this.timerInterval = null;
        }
    }

    resumeTimer() {
        if (!this.timerInterval) {
            this.startTime += Date.now() - (this.startTime + this.timer * 1000);
            this.createTimeInterval();
        }
    }

    resetTimer() {
        this.timer = this.timeLimit;
        this.startTime = 0;
        this.updateTimerDisplay();
    }

    flipAnimation(htmlCard) {
        return anime({
            targets: htmlCard,
            scale: [{value: 1}, {value: 1.4}, {value: 1, delay: 100}],
            rotateY: {value: "+=180", delay: 100},
            easing: "easeInOutSine",
            duration: 400,
        });
    }

    flipCard = () => {
        if (this.lockBoard) return;
        if (event.target.offsetParent === this.firstCard) return;

        this.flipAnimation(event.target.offsetParent);

        if (!this.hasFlippedCard) {
            this.hasFlippedCard = true;
            this.firstCard = event.target.offsetParent;

            return;
        }

        this.secondCard = event.target.offsetParent;
        this.checkForMatch();
    }

    checkForMatch() {
        let isMatch = this.firstCard.id === this.secondCard.id;

        if (isMatch) {
            this.disableCards();
            if (this.allCardsMatched()) {
                this.endGame();
            }
        } else {
            this.unflipCards();
        }
    }

    allCardsMatched() {
        const cards = document.querySelectorAll('.front-face');
        return [...cards].every(card => card.classList.contains('matching-card'));
    }

    endGame() {
        this.pauseTimer();
        setTimeout(() => {
            alert('Congratulations! You have matched all the cards!');
            document.getElementById('reset-btn').click();
            this.resetTimer();
        }, 2000);
    }

    disableCards() {
        this.firstCard.removeEventListener('click', this.flipCard);
        this.secondCard.removeEventListener('click', this.flipCard);
        this.firstCard.querySelector('.front-face').classList.add('matching-card');
        this.secondCard.querySelector('.front-face').classList.add('matching-card');

        this.resetBoard();
    }

    unflipCards() {
        this.lockBoard = true;

        setTimeout(() => {
            this.flipAnimation(this.firstCard);
            this.flipAnimation(this.secondCard);

            this.resetBoard();
        }, 1500);
    }

    resetBoard() {
        [this.hasFlippedCard, this.lockBoard] = [false, false];
        [this.firstCard, this.secondCard] = [null, null];
    }

    pauseGame() {
        if (!this.gamePaused && this.memoryGameContainer.innerHTML !== '') {
            this.gamePaused = true;
            this.pauseMessage.style.display = 'block';
            this.memoryGameContainer.classList.add('overlay');

            this.pauseTimer();
        }
    }

    resumeGame() {
        if (this.gamePaused) {
            this.gamePaused = false;
            this.pauseMessage.style.display = 'none';
            this.memoryGameContainer.classList.remove('overlay');

            this.resumeTimer();
        }

    }

    shuffleCards(cards) {
        cards.forEach(card => {
            let randomPos = Math.floor(Math.random() * 12);
            card.style.order = randomPos;
        });
    }

    renderGame() {
        const cards = document.querySelectorAll('.memory-card');
        this.memoryGameContainer.style.width = `${this.width}px`;
        this.memoryGameContainer.style.height = `${this.height}px`;

        this.shuffleCards(cards);

        this.memoryGameContainer.addEventListener('mouseenter', () => this.resumeGame());
        this.memoryGameContainer.addEventListener('mouseleave', () => this.pauseGame());

        cards.forEach(card => card.addEventListener('click', this.flipCard));
    }
}
