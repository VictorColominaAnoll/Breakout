function Ball() {

    console.log(game)

    this.x = game.paddle.x + game.paddle.width / 2; this.y = game.paddle.y - 10;
    this.vx = -300; this.vy = -310;  // velocitat = 300 pÃ­xels per segon, cal evitar els 45 graus en el check!!
    this.radi = 10;                 // radi de la pilota
    this.color = "#333";  // gris fosc
}


Ball.prototype.update = function (dt) {
    var dtXoc;      // temps empleat fins al xoc
    var xoc = false;  // si hi ha xoc en aquest dt
    var k;          // proporciÃ³ de la trajectoria que supera al xoc
    var dreta;
    var trajectoria = {};
    trajectoria.p1 = { x: this.x, y: this.y };
    trajectoria.p2 = { x: this.x + this.vx * dt, y: this.y + this.vy * dt };

    // La pilota es troba sobre de la raqueta y la tornem a posar en moviment presionant la tecla SPACE
    if (game.reinici == false) {
        if (game.key.RIGHT.pressed || game.key.D.pressed) dreta = true;
        else { if (game.key.LEFT.pressed || game.key.A.pressed) dreta = false; }

        if (dreta) {
            this.vx = 300;
            this.vy = -310;
        }
        else {
            this.vx = -300;
            this.vy = -310;
        }


        game.reinici = null;
    }

    // Xoc amb la vora de sota de la pista
    if (trajectoria.p2.y + this.radi > game.height && game.vida > 0) {
        // hem perdut l'intent actual

        k = (trajectoria.p2.y + this.radi - game.height) / this.vy;

        // Ens coloquem en la raqueta per iniciar un altre cop el joc
        this.x = game.paddle.x + game.paddle.width / 2;
        this.y = game.paddle.y - 10;
        this.vx = 0; this.vy = 0;

        dtXoc = k * dt;  // temps que queda
        xoc = true;

        if (game.ball.length < 2) {
            game.vida--; //Restem una vida a la total
            game.reinici = true;
        }
        else {
            console.log("abans " + game.ball);

            for (var i = 0; i < game.numeroBall; i++) {

                if (game.ball[i] == this)
                    game.ball.splice(i, 1);

                console.log(game.ball);
            }

            game.numeroBall--;

        }

    }

    // Xoc amb la vora de dalt de la pista
    if (trajectoria.p2.y - this.radi < 0) {
        k = (trajectoria.p2.y - this.radi) / this.vy;  // k sempre positiu
        // ens colÂ·loquem just tocant la vora de dalt
        this.x = trajectoria.p2.x - k * this.vx;
        this.y = this.radi;
        this.vy = -this.vy;
        dtXoc = k * dt;  // temps que queda
        xoc = true;
    }

    // Xoc amb la vora dreta de la pista
    if (trajectoria.p2.x + this.radi > game.width) {
        k = (trajectoria.p2.x + this.radi - game.width) / this.vx;
        // ens colÂ·loquem just tocant la vora de la dreta
        this.x = game.width - this.radi;
        this.y = trajectoria.p2.y - k * this.vy;
        this.vx = -this.vx;
        dtXoc = k * dt;  // temps que queda
        xoc = true;
    }

    // Xoc amb la vora esquerra de la pista
    if (trajectoria.p2.x - this.radi < 0) {
        k = (trajectoria.p2.x - this.radi) / this.vx;  // k sempre positiu
        // ens colÂ·loquem just tocant la vora de l'esquerra
        this.x = this.radi;
        this.y = trajectoria.p2.y - k * this.vy;
        this.vx = -this.vx;
        dtXoc = k * dt;  // temps que queda
        xoc = true;
    }

    // Xoc amb la raqueta
    var rXoc = Utilitats.interseccioSegmentRectangle(trajectoria, {
        p: { x: game.paddle.x, y: game.paddle.y - this.radi },
        w: game.paddle.width,
        h: game.paddle.height
    });
    if (rXoc) {
        xoc = true;
        this.x = rXoc.p.x;
        this.y = rXoc.p.y;
        switch (rXoc.vora) {
            case "superior":
            case "inferior": this.vy = -this.vy; break;
            case "esquerra":
            case "dreta": this.vx = -this.vx; break;
        }
        dtXoc = (Utilitats.distancia(rXoc.p, trajectoria.p2) / Utilitats.distancia(trajectoria.p1, trajectoria.p2)) * dt;
    }

    if (mode == "3") {

        //xoc amb la revers paddle
        var reversXoc = Utilitats.interseccioSegmentRectangle(trajectoria, {
            p: { x: game.reversPaddle.x, y: game.reversPaddle.y - this.radi },
            w: game.reversPaddle.width,
            h: game.reversPaddle.height
        });
        if (reversXoc) {
            xoc = true;
            this.x = reversXoc.p.x;
            this.y = reversXoc.p.y;
            switch (reversXoc.vora) {
                case "superior":
                case "inferior":
                    this.vy = -this.vy;
                    break;
                case "esquerra":
                case "dreta":
                    this.vx = -this.vx;
                    break;
            }
            dtXoc = (Utilitats.distancia(reversXoc.p, trajectoria.p2) / Utilitats.distancia(trajectoria.p1, trajectoria.p2)) * dt;
        }

    }

    if (mode == "2") {
        //xoc amb la superior paddle
        var superiorXoc = Utilitats.interseccioSegmentRectangle(trajectoria, {
            p: { x: game.superiorPaddle.x, y: game.superiorPaddle.y - this.radi },
            w: game.superiorPaddle.width,
            h: game.superiorPaddle.height
        });
        if (superiorXoc) {
            xoc = true;
            this.x = superiorXoc.p.x;
            this.y = superiorXoc.p.y;
            switch (superiorXoc.vora) {
                case "superior":
                case "inferior":
                    this.vy = -this.vy;
                    break;
                case "esquerra":
                case "dreta":
                    this.vx = -this.vx;
                    break;
            }
            dtXoc = (Utilitats.distancia(superiorXoc.p, trajectoria.p2) / Utilitats.distancia(trajectoria.p1, trajectoria.p2)) * dt;
        }
    }
    // xoc amb un totxo
    for (var i = 0; i < game.lol.length; i++) {
        var pXoc = Utilitats.interseccioSegmentRectangle(trajectoria, {
            p: { x: game.lol[i].x - this.radi, y: game.lol[i].y - this.radi },
            w: game.lol[i].w + 2 * this.radi,
            h: game.lol[i].h + 2 * this.radi
        });

        if (pXoc) {
            for (var j = 0; j < game.lolPower.length; j++) {
                if (game.lol[i] == game.lolPower[j]) {
                    game.lolPower.splice(j, 1);

                    var power = new Power(game.lol[i].x + game.lol[i].w / 2, game.lol[i].y + 10);
                    game.power.push(power);

                }
            }

            xoc = true;
            game.lol.splice(i, 1);
            this.x = pXoc.p.x;
            this.y = pXoc.p.y;
            switch (pXoc.vora) {
                case "superior":
                case "inferior":
                    this.vy = -this.vy;
                    break;
                case "esquerra":
                case "dreta":
                    this.vx = -this.vx;
                    break;
            }
            dtXoc = (Utilitats.distancia(pXoc.p, trajectoria.p2) / Utilitats.distancia(trajectoria.p1, trajectoria.p2)) * dt;
        }
    }

    // actualitzem la posiciÃ³ de la bola
    if (xoc) {
        this.update(dtXoc);  // crida recursiva
    }
    else {
        this.x = trajectoria.p2.x;
        this.y = trajectoria.p2.y;
    }

};

Ball.prototype.draw = function (ctx) {
    ctx.save();
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radi, 0, 2 * Math.PI);   // pilota rodona
    ctx.fill();
    ctx.stroke();
    ctx.restore();
};
