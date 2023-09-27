export class Card {
    constructor(color, id) {
        this.color = color;
        this.id = id;
    }

    getCardHtml() {
        return `<div class="memory-card" id="${this.id}">
<div class="front-face" style="background-color: ${this.color}"><span class="card-number">${this.id}</span></div>
            <div class="back-face"></div>
            </div>`;
    }

}
