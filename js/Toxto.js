function Totxo(x, y, w, h, color) {
    this.x = x; this.y = y;         // posiciÃ³, en pÃ­xels respecte el canvas
    this.w = w; this.h = h;         // mides
    this.color = color;
}

Totxo.prototype.draw = function (ctx) {
    ctx.save();
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, this.w, this.h);
    ctx.strokeStyle = "#333";
    ctx.strokeRect(this.x, this.y, this.w, this.h);
    ctx.restore();
};
