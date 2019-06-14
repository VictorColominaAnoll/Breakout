function Power(x, y){
    this.x = x; this.y = y;
    this.vx = 0;  this.vy = 100;
    this.radi = 10;                 // radi de la pilota
    this.color = "#FF0000";  // vermell fosc
}

Power.prototype.update = function (dt){
    var dtXoc;      // temps empleat fins al xoc
    var xoc=false;  // si hi ha xoc en aquest dt
    var k;          // proporciÃ³ de la trajectoria que supera al xoc
    var dreta;
    var trajectoria={};
    trajectoria.p1={x:this.x, y:this.y};
    trajectoria.p2={x:this.x + this.vx*dt, y:this.y + this.vy*dt};

    this.y = this.y + this.vy*dt; // La direccio de la pilota va cap avall

    if(mode =="2") {
        // Xoc amb la superiorPaddle
        var rXoc = Utilitats.interseccioSegmentRectangle(trajectoria, {
            p: {x: game.superiorPaddle.x, y: game.superiorPaddle.y - this.radi},
            w: game.superiorPaddle.width,
            h: game.superiorPaddle.height
        });
        if (rXoc) {
            xoc = true;
            this.x = rXoc.p.x;
            this.y = rXoc.p.y;
            dtXoc = (Utilitats.distancia(rXoc.p, trajectoria.p2) / Utilitats.distancia(trajectoria.p1, trajectoria.p2)) * dt;
            game.power.splice(this, 1)

            game.numeroBall++;

            var ball = new Ball();
            ball.x = 100;
            ball.y = 100;
            ball.vy = -300;
            ball.vx = -300;

            game.ball.push(ball);

        }
    }
    if(mode == "3") {
        // Xoc amb la reversPaddle
        var rXoc = Utilitats.interseccioSegmentRectangle(trajectoria, {
            p: {x: game.reversPaddle.x, y: game.reversPaddle.y - this.radi},
            w: game.reversPaddle.width,
            h: game.reversPaddle.height
        });
        if (rXoc) {
            xoc = true;
            this.x = rXoc.p.x;
            this.y = rXoc.p.y;
            dtXoc = (Utilitats.distancia(rXoc.p, trajectoria.p2) / Utilitats.distancia(trajectoria.p1, trajectoria.p2)) * dt;
            game.power.splice(this, 1)

            game.numeroBall++;

            var ball = new Ball();
            ball.x = 100;
            ball.y = 100;
            ball.vy = -300;
            ball.vx = -300;

            game.ball.push(ball);

        }
    }

    // Xoc amb la raqueta
    var rXoc=Utilitats.interseccioSegmentRectangle(trajectoria,{p:{x:game.paddle.x, y:game.paddle.y-this.radi},
        w:game.paddle.width,
        h:game.paddle.height});
    if(rXoc){
        xoc=true;
        this.x=rXoc.p.x;
        this.y=rXoc.p.y;
        dtXoc=(Utilitats.distancia(rXoc.p,trajectoria.p2)/Utilitats.distancia(trajectoria.p1,trajectoria.p2))*dt;
        game.power.splice(this, 1)

        game.numeroBall++;

        var ball = new Ball();
        ball.x = 100;
        ball.y = 100;
        ball.vy = -300;
        ball.vx = -300;

        game.ball.push(ball);

    }
};

Power.prototype.draw = function(ctx){
    ctx.save();
    ctx.fillStyle=this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radi, 0, 2*Math.PI);   // pilota rodona
    ctx.fill();
    ctx.stroke();
    ctx.restore();
};
