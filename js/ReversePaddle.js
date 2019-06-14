////////////////////////////////    reversPaddle    ////////////////////////////////

function reversPaddle() {
    this.width = 150;
    this.height = 20;
    this.x = (game.width / 2 - this.width / 2) - 75;
    this.y = game.height - 49;
    this.vx = 10;
    this.color = "#000"; // vermell
}


reversPaddle.prototype.update = function () {
    if (game.key.RIGHT.pressed) {
        this.x = Math.max(0, this.x - this.vx);
    }
    else if (game.key.LEFT.pressed) {
        this.x = Math.min(game.width - this.width, this.x + this.vx);
    }
}

reversPaddle.prototype.draw = function (ctx) {
    ctx.save();
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y - 1, this.width, this.height);
    ctx.restore();
};