/**
 * Created by spries on 02/06/2016.
 */

var mode;

///////////////////////////////////    Objecte game
function Game(){

    this.AMPLADA_TOTXO= 50; this.ALÇADA_TOTXO=25; // MIDES DEL TOTXO EN PÃXELS
    this.canvas,  this.context;       // context per poder dibuixar en el Canvas
    this.width, this.height;          // mides del canvas

    this.paddle;   // la raqueta
    this.ball = [];     // array de pilota/s
    this.totxo;

    this.willFrame = true;


    if(mode == "3")
        this.reversPaddle; // Mode en el que la raqueta va al contrari

    if(mode == "2")
        this.superiorPaddle; // Mode en el que la raqueta va al contrari

    this.vida = 4;

    this.numeroBall = 1;

    this.NIVELLS;
    this.nivellActual = 0;

    this.reinici = false;

    this.lol = []; // Array que conté tots els totxos de la partida actual
    this.lolPower = []; // Array de totxos que deixaran anar un power

    this.power = [];

    this.t=0;      // el temps

    // Events del teclat
    this.key={
        RIGHT:{code: 39, pressed:false},
        LEFT :{code: 37, pressed:false},
        A:{code: 65, pressed: false},
        D:{code: 68, pressed: false},
        SPACE:{code: 32, pressed: false}
    };

}

Game.prototype.inicialitzar = function(){
    this.t = 0;

    this.canvas = document.getElementById("game");
    this.width = this.AMPLADA_TOTXO*19;  // 15 totxos com a mÃ xim d'amplada
    this.canvas.width = this.width;
    this.height = this.ALÇADA_TOTXO*25;
    this.canvas.height =this.height;
    this.context = this.canvas.getContext("2d");
    
    this.paddle = new Paddle();

    if(mode == "3")
        this.reversPaddle = new reversPaddle();

    if(mode == "2")
        this.superiorPaddle = new superiorPaddle();


    for(var i = 0; i<this.numeroBall; i++) {
        this.ball.push(new Ball());
    }

    this.llegirNivells();

    var variableX = 75;
    var variableY = 0;



        for(var j = 0; j<this.NIVELLS[this.nivellActual].totxos.length; j++) {

            var string = this.NIVELLS[this.nivellActual].totxos[j];

            for (var k = 0; k < string.length; k++) {

                var lletra = string.charAt(k);
                if (lletra != " ") {
                    this.totxo = new Totxo(variableX, variableY, 50, 25, this.NIVELLS[this.nivellActual].colors[lletra]);
                    this.lol.push(this.totxo);
                }

                variableX = variableX + 50;
            }
            variableX = 75;
            variableY = variableY + 25
        }

    var vegades = Math.round(Utilitats.nombreAleatoriEntre(1, 5));

    for(var i = 0; i < vegades; i++){

        var numeroTotxo; // Aleatoriament seleccionem un totxo del qual sortira un power

        numeroTotxo = Math.round(Utilitats.nombreAleatoriEntre(0, this.lol.length - 1));


        this.lolPower.push(this.lol[numeroTotxo])

    }

    document.getElementById("menu").addEventListener("click", function () {
        console.log("menu")
        delete game;
        delete this.paddle;
        this.ball = [];

        this.numeroBall = 1;

        this.willFrame = false;

        $("#intro").css("display", "block");
        $("#principal").css("display", "none");
    });

    // Events amb jQuery
    $(document).on("keydown", {game:this},function(e) {
        if(e.keyCode==e.data.game.key.RIGHT.code){
            e.data.game.key.RIGHT.pressed = true;
        }
        else if(e.keyCode==e.data.game.key.LEFT.code){
            e.data.game.key.LEFT.pressed = true;
        }
        else if(e.keyCode==e.data.game.key.A.code){
            e.data.game.key.A.pressed = true;
        }
        else if(e.keyCode==e.data.game.key.D.code){
            e.data.game.key.D.pressed = true;
        }
        else if(e.keyCode==e.data.game.key.SPACE.code){
            e.data.game.key.SPACE.pressed = true;
        }
    });
    $(document).on("keyup", {game:this},function(e) {
        if(e.keyCode==e.data.game.key.RIGHT.code){
            e.data.game.key.RIGHT.pressed = false;
            e.data.game.key.RIGHT.pressed = false;
        }
        else if(e.keyCode==e.data.game.key.LEFT.code){
            e.data.game.key.LEFT.pressed = false;
        }
        else if(e.keyCode==e.data.game.key.A.code){
            e.data.game.key.A.pressed = false;
        }
        else if(e.keyCode==e.data.game.key.D.code){
            e.data.game.key.D.pressed = false;
        }
        else if(e.keyCode==e.data.game.key.SPACE.code){
            e.data.game.key.SPACE.pressed = false;
        }
    });

    this.t=new Date().getTime();     // inicialitzem el temps

    if(this.willFrame)
        requestAnimationFrame(mainLoop);

    else
        this.willFrame = true;

}

Game.prototype.draw = function(){

    var pelota;

    if(game.lol.length == 0) {
        this.nivellActual++;
        delete game;
        delete this.paddle;
        this.ball = [];

        this.numeroBall = 1;

        this.willFrame = false;

        game.inicialitzar();
    }

    this.context.clearRect(0, 0, this.width, this.height);

    for(var k = 0; k < this.lol.length; k++)
        this.lol[k].draw(this.context);

    this.paddle.draw(this.context);


    for(var i = 0; i<this.numeroBall; i++) {
        this.ball[i].draw(this.context);
    }
    for(var i = 0; i<this.numeroBall; i++) {
        if (this.reinici) {
            pelota = this.ball[i];
            pelota.x = this.paddle.x + (this.paddle.width/2);
            pelota.y = this.paddle.y - 10;
        }

        if (this.key.SPACE.pressed && this.reinici) {
            this.reinici = false;
        }
    }

    for (var i = 0; i<this.power.length; i++) {
        if (this.power.length != 0) {
            this.power[i].draw(this.context);
        }
    }

    if(mode == "3")
        this.reversPaddle.draw(this.context);

    if(mode == "2")
        this.superiorPaddle.draw(this.context);
};

Game.prototype.update = function(){
    var dt=Math.min((new Date().getTime() -this.t)/1000, 1); // temps, en segons, que ha passat des del darrer update
    this.t=new Date().getTime();

    if(this.vida > 3){
        $("#numeroVides").css("display", "inline");
        $("#numeroVides").text("x" + this.vida)
        $("#vida2").css("display", "none");
        $("#vida3").css("display", "none");

    }
    else if(this.vida == 1){
        $("#numeroVides").css("display", "none");
        $("#vida2").css("display", "none");
        $("#vida3").css("display", "none");
    }
    else if(this.vida == 2){
        $("#numeroVides").css("display", "none");
        $("#vida2").css("display", "inline");
        $("#vida3").css("display", "none");
    }
    else if(this.vida == 3){
        $("#numeroVides").css("display", "none");
        $("#vida2").css("display", "inline");
        $("#vida3").css("display", "inline");
    }
    else if(this.vida== 0){
        $("#numeroVides").css("display", "none");
        $("#vida1").css("display", "none");
        $("#vida2").css("display", "none");
        $("#vida3").css("display", "none");
    }



    this.paddle.update();    // Moviment de la raqueta

    for(var i = 0; i<this.numeroBall; i++) {
        this.ball[i].update(dt);    // moviment de la bola, depen del temps que ha passat
    }

    for (var i = 0; i<this.power.length; i++) {
        if (this.power.length != 0) {
            this.power[i].update(dt);
        }
    }

    if(mode == "2")
        this.superiorPaddle.update(); // Moviment de la raqueta mirall

    if(mode == "3")
        this.reversPaddle.update(); // Moviment de la raqueta mirall
};

//////////////////////////////////////////////////////////////////////
// ComenÃ§a el programa
var game;

$(document).ready(function(){

    if(mode != "1" || mode != "2" || mode != "3") {
        document.getElementById("normal").addEventListener("click", function () {
            mode = "1";
            $("#intro").css("display", "none");
            $("#principal").css("display", "block");
            game = new Game();  	   // Inicialitzem la instÃ ncia del joc
            game.inicialitzar();   // estat inicial del joc

        });

        document.getElementById("multiplayer").addEventListener("click", function () {
            mode = "2";
            $("#intro").css("display", "none");
            $("#principal").css("display", "block");
            game = new Game();  	   // Inicialitzem la instÃ ncia del joc
            game.inicialitzar();   // estat inicial del joc

        });

        document.getElementById("dual").addEventListener("click", function () {
            mode = "3";
            $("#intro").css("display", "none");
            $("#principal").css("display", "block");
            game = new Game();  	   // Inicialitzem la instÃ ncia del joc
            game.inicialitzar();   // estat inicial del joc

        });
    }
});

function mainLoop(){

    game.update();
    game.draw();
    requestAnimationFrame(mainLoop);

}

///////////////////////////////////    Raqueta    ///////////////////////////////////

function Paddle(){

    if(mode == "1")
        this.width = 300;

    else
        this.width = 150;

    this.height = 20;
    this.x = (game.width/2 - this.width/2) + 75;
    this.y = game.height - 50;
    this.vx = 10;
    this.color = "#fbb";
}

/////////////////////////////////////////////////////////////////////////////////////

Paddle.prototype.update = function(){
    if (game.key.RIGHT.pressed) {
        this.x = Math.min(game.width - this.width, this.x + this.vx);
    }
    else if (game.key.LEFT.pressed) {
        this.x = Math.max(0, this.x - this.vx);
    }
}

Paddle.prototype.draw = function(ctx){
    ctx.save();
    ctx.fillStyle=this.color;
    ctx.fillRect(this.x, this.y, this.width, this.height);
    ctx.restore();
};

/////////////////////////////////////////////////////////////////////////////////////

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



////////////////////////////////    superiorPaddle    ////////////////////////////////

    function superiorPaddle() {
        this.width = 150;
        this.height = 20;
        this.x = (game.width / 2 - this.width / 2) - 75;
        this.y = game.height - 100;
        this.vx = 10;
        this.color = "#000";
    }

/////////////////////////////////////////////////////////////////////////////////////


    superiorPaddle.prototype.update = function () {
        if (game.key.A.pressed) {
            this.x = Math.max(0, this.x - this.vx);
        }
        else if (game.key.D.pressed) {
            this.x = Math.min(game.width - this.width, this.x + this.vx);
        }
    }

    superiorPaddle.prototype.draw = function (ctx) {
        ctx.save();
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y - 1, this.width, this.height);
        ctx.restore();
    };

/////////////////////////////////////////////////////////////////////////////////////

///////////////////////////////////    Pilota
function Ball(){
    this.x = game.paddle.x + game.paddle.width/2; this.y = game.paddle.y - 10;
    this.vx = -300;  this.vy = -310;  // velocitat = 300 pÃ­xels per segon, cal evitar els 45 graus en el check!!
    this.radi = 10;                 // radi de la pilota
    this.color = "#333";  // gris fosc
}

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

Ball.prototype.update = function(dt){
    var dtXoc;      // temps empleat fins al xoc
    var xoc=false;  // si hi ha xoc en aquest dt
    var k;          // proporciÃ³ de la trajectoria que supera al xoc
    var dreta;
    var trajectoria={};
    trajectoria.p1={x:this.x, y:this.y};
    trajectoria.p2={x:this.x + this.vx*dt, y:this.y + this.vy*dt};

    // La pilota es troba sobre de la raqueta y la tornem a posar en moviment presionant la tecla SPACE
    if(game.reinici == false){
        if(game.key.RIGHT.pressed || game.key.D.pressed) dreta = true;
        else {if(game.key.LEFT.pressed || game.key.A.pressed) dreta = false;}

        if(dreta) {
            this.vx = 300;
            this.vy = -310;
        }
        else{
            this.vx = -300;
            this.vy = -310;
        }


        game.reinici = null;
    }

    // Xoc amb la vora de sota de la pista
    if (trajectoria.p2.y + this.radi > game.height && game.vida > 0){
        // hem perdut l'intent actual

        k=(trajectoria.p2.y+this.radi - game.height)/this.vy;

        // Ens coloquem en la raqueta per iniciar un altre cop el joc
        this.x= game.paddle.x + game.paddle.width/2;
        this.y = game.paddle.y - 10;
        this.vx = 0; this.vy = 0;

        dtXoc=k*dt;  // temps que queda
        xoc=true;

        if(game.ball.length < 2) {
            game.vida--; //Restem una vida a la total
            game.reinici = true;
        }
        else{
            console.log("abans "+game.ball);

            for (var i = 0; i<game.numeroBall; i++) {

                if(game.ball[i] == this)
                    game.ball.splice(i, 1);

                console.log(game.ball);
            }

            game.numeroBall--;

        }

    }

    // Xoc amb la vora de dalt de la pista
    if (trajectoria.p2.y - this.radi < 0){
        k=(trajectoria.p2.y-this.radi)/this.vy;  // k sempre positiu
        // ens colÂ·loquem just tocant la vora de dalt
        this.x=trajectoria.p2.x-k*this.vx;
        this.y=this.radi;
        this.vy = -this.vy;
        dtXoc=k*dt;  // temps que queda
        xoc=true;
    }

    // Xoc amb la vora dreta de la pista
    if (trajectoria.p2.x + this.radi > game.width){
        k=(trajectoria.p2.x+this.radi - game.width)/this.vx;
        // ens colÂ·loquem just tocant la vora de la dreta
        this.x=game.width-this.radi;
        this.y=trajectoria.p2.y-k*this.vy;
        this.vx = -this.vx;
        dtXoc=k*dt;  // temps que queda
        xoc=true;
    }

    // Xoc amb la vora esquerra de la pista
    if (trajectoria.p2.x - this.radi< 0){
        k=(trajectoria.p2.x-this.radi)/this.vx;  // k sempre positiu
        // ens colÂ·loquem just tocant la vora de l'esquerra
        this.x=this.radi;
        this.y=trajectoria.p2.y-k*this.vy;
        this.vx = -this.vx;
        dtXoc=k*dt;  // temps que queda
        xoc=true;
    }

    // Xoc amb la raqueta
    var rXoc=Utilitats.interseccioSegmentRectangle(trajectoria,{p:{x:game.paddle.x, y:game.paddle.y-this.radi},
        w:game.paddle.width,
        h:game.paddle.height});
    if(rXoc){
        xoc=true;
        this.x=rXoc.p.x;
        this.y=rXoc.p.y;
        switch(rXoc.vora){
            case "superior":
            case "inferior":  this.vy = -this.vy; break;
            case "esquerra":
            case "dreta"   :  this.vx = -this.vx; break;
        }
        dtXoc=(Utilitats.distancia(rXoc.p,trajectoria.p2)/Utilitats.distancia(trajectoria.p1,trajectoria.p2))*dt;
    }

    if(mode == "3") {

        //xoc amb la revers paddle
        var reversXoc = Utilitats.interseccioSegmentRectangle(trajectoria, {
            p: {x: game.reversPaddle.x, y: game.reversPaddle.y - this.radi},
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
                case "dreta"   :
                    this.vx = -this.vx;
                    break;
            }
            dtXoc = (Utilitats.distancia(reversXoc.p, trajectoria.p2) / Utilitats.distancia(trajectoria.p1, trajectoria.p2)) * dt;
        }

    }

    if(mode == "2") {
        //xoc amb la superior paddle
        var superiorXoc = Utilitats.interseccioSegmentRectangle(trajectoria, {
            p: {x: game.superiorPaddle.x, y: game.superiorPaddle.y - this.radi},
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
                case "dreta"   :
                    this.vx = -this.vx;
                    break;
            }
            dtXoc = (Utilitats.distancia(superiorXoc.p, trajectoria.p2) / Utilitats.distancia(trajectoria.p1, trajectoria.p2)) * dt;
        }
    }
    // xoc amb un totxo
    for(var i = 0; i < game.lol.length; i++) {
        var pXoc = Utilitats.interseccioSegmentRectangle(trajectoria, {
            p: {x: game.lol[i].x - this.radi, y: game.lol[i].y - this.radi},
            w: game.lol[i].w + 2 * this.radi,
            h: game.lol[i].h + 2 * this.radi
        });

        if (pXoc) {
            for(var j = 0; j < game.lolPower.length; j++) {
                if (game.lol[i] == game.lolPower[j]){
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
                case "dreta"   :
                    this.vx = -this.vx;
                    break;
            }
            dtXoc = (Utilitats.distancia(pXoc.p, trajectoria.p2) / Utilitats.distancia(trajectoria.p1, trajectoria.p2)) * dt;
        }
    }

    // actualitzem la posiciÃ³ de la bola
    if(xoc){
        this.update(dtXoc);  // crida recursiva
    }
    else{
        this.x=trajectoria.p2.x;
        this.y=trajectoria.p2.y;
    }

};

Ball.prototype.draw = function(ctx){
    ctx.save();
    ctx.fillStyle=this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radi, 0, 2*Math.PI);   // pilota rodona
    ctx.fill();
    ctx.stroke();
    ctx.restore();
};

///////////////////////////////////    Totxo
function Totxo(x,y,w,h,color){
    this.x=x; this.y=y;         // posiciÃ³, en pÃ­xels respecte el canvas
    this.w=w; this.h=h;         // mides
    this.color=color;
}

Totxo.prototype.draw = function(ctx){
    ctx.save();
    ctx.fillStyle=this.color;
    ctx.fillRect(this.x, this.y, this.w, this.h);
    ctx.strokeStyle="#333";
    ctx.strokeRect(this.x, this.y, this.w, this.h);
    ctx.restore();
};


/////////////////////////////////// Utilitats /////////////////////////////////////

var Utilitats={};
Utilitats.esTallen = function(p1,p2,p3,p4){
    function check(p1,p2,p3){
        return (p2.y-p1.y)*(p3.x-p1.x) < (p3.y-p1.y)*(p2.x-p1.x);
    }
    return check(p1,p2,p3) != check(p1,p2,p4) && check(p1,p3,p4) != check(p2,p3,p4);
}

// si retorna undefined Ã©s que no es tallen
Utilitats.puntInterseccio = function(p1,p2,p3,p4){
    var A1, B1, C1, A2, B2, C2, x, y, d;
    if(Utilitats.esTallen(p1,p2,p3,p4)){
        A1=p2.y-p1.y; B1=p1.x-p2.x; C1=p1.x*p2.y-p2.x*p1.y;
        A2=p4.y-p3.y; B2=p3.x-p4.x; C2=p3.x*p4.y-p4.x*p3.y;
        d=A1*B2-A2*B1;
        if(d!=0){
            x=(C1*B2-C2*B1)/d;
            y= (A1*C2-A2*C1)/d;
            return {x:x, y:y};
        }
    }
}

Utilitats.puntInterseccio2=function (p1,p2,p3,p4){
    // converteix segment1 a la forma general de recta: Ax+By = C
    var a1 = p2.y - p1.y;
    var b1 = p1.x - p2.x;
    var c1 = a1 * p1.x + b1 * p1.y;

    // converteix segment2 a la forma general de recta: Ax+By = C
    var a2 = p4.y - p3.y;
    var b2 = p3.x - p4.x;
    var c2 = a2 * p3.x + b2 * p3.y;

    // calculem el punt intersecciÃ³
    var d = a1*b2 - a2*b1;

    // lÃ­nies paralÂ·leles quan d Ã©s 0
    if (d == 0) {
        return false;
    }
    else {
        var x = (b2*c1 - b1*c2) / d;
        var y = (a1*c2 - a2*c1) / d;
        var puntInterseccio={x:x, y:y};	// aquest punt pertany a les dues rectes
        if(Utilitats.contePunt(p1,p2,puntInterseccio) && Utilitats.contePunt(p3,p4,puntInterseccio) )
            return puntInterseccio;
    }
}

Utilitats.contePunt=function(p1,p2, punt){
    return (valorDinsInterval(p1.x, punt.x, p2.x) || valorDinsInterval(p1.y, punt.y, p2.y));

    // funciÃ³ interna
    function valorDinsInterval(a, b, c) {
        // retorna cert si b estÃ  entre a i b, ambdos exclosos
        if (Math.abs(a-b) < 0.000001 || Math.abs(b-c) < 0.000001) { // no podem fer a==b amb valors reals!!
            return false;
        }
        return (a < b && b < c) || (c < b && b < a);
    }
}


Utilitats.distancia = function(p1,p2){
    return Math.sqrt((p2.x-p1.x)*(p2.x-p1.x)+(p2.y-p1.y)*(p2.y-p1.y));
}

Utilitats.interseccioSegmentRectangle = function(seg,rect){  // seg={p1:{x:,y:},p2:{x:,y:}}
    // rect={p:{x:,y:},w:,h:}
    var pI, dI, pImin, dImin=Infinity, vora;
    // vora superior
    pI=Utilitats.puntInterseccio(seg.p1, seg.p2,
        {x:rect.p.x,y:rect.p.y}, {x:rect.p.x+rect.w, y:rect.p.y});
    if(pI){
        dI=Utilitats.distancia(seg.p1, pI);
        if(dI<dImin){
            dImin=dI;
            pImin=pI;
            vora="superior";
        }
    }
    // vora inferior
    pI=Utilitats.puntInterseccio(seg.p1, seg.p2,
        {x:rect.p.x+rect.w, y:rect.p.y+rect.h},{x:rect.p.x, y:rect.p.y+rect.h});
    if(pI){
        dI=Utilitats.distancia(seg.p1, pI);
        if(dI<dImin){
            dImin=dI;
            pImin=pI;
            vora="inferior";
        }
    }

    // vora esquerra
    pI=Utilitats.puntInterseccio(seg.p1, seg.p2,
        {x:rect.p.x, y:rect.p.y+rect.h},{x:rect.p.x,y:rect.p.y});
    if(pI){
        dI=Utilitats.distancia(seg.p1, pI);
        if(dI<dImin){
            dImin=dI;
            pImin=pI;
            vora="esquerra";
        }
    }
    // vora dreta
    pI=Utilitats.puntInterseccio(seg.p1, seg.p2,
        {x:rect.p.x+rect.w, y:rect.p.y}, {x:rect.p.x+rect.w, y:rect.p.y+rect.h});
    if(pI){
        dI=Utilitats.distancia(seg.p1, pI);
        if(dI<dImin){
            dImin=dI;
            pImin=pI;
            vora="dreta";
        }
    }

    if(vora){
        return {p:pImin,vora:vora}
    }

}


Utilitats.nombreAleatoriEntre= function(minim, maxim){
    return Math.random() * ((maxim - minim + 1) + minim)
}
///////////////////////////////////////////////////////////////////////////////////////////////////////

Game.prototype.llegirNivells = function(){
    this.NIVELLS = [
        {
            colors: {
//BOMBA
        l: "#000080", // Lila
        a: "#0000FF", // Lila flojo
        n: "#000000 ", // Negro
        b: "#FFFFFF", // Blanco
        s: "#9370DB", // Rosa
        r:"#FF0000 "//Rojo
},
    totxos: [
        "     nnnn       ",
        "   nnllllnn     ",
        "  naaaaallln    ",
        " naaaaaaallln nn",
        " n a aaaaallnn n",
        "nl a aaaaallnn n",
        "nl a aaaaaln   n",
        "nlaaaaaaaalnss n",
        "nllaaaaaalllnnsn",
        " nllaaaallllnnsn  ",
        " nllllllllln  nn",
        "  nnllllllnn    ",
        " nrrnllllnrrn   ",
        " nrrrnnnnrrrn   ",
        "  nrrn  nrrn    ",
        "   nn    nn     "
    ]
},
    {
        colors: {
//PLANTA
            n:"#FF8C00",//Naranja
            r:"#FF0000 ",//Rojo
            b:"#000000",//Negro
            g:"#32CD32 ",//Verde
            v:"#7CFC00 ",//Vede flojito
        } ,
        totxos: [
            "      bb       ",
            "  b   bnb   n  ",
            " bnb bnnnb bnb ",
            "bnnnnnnnnnnnnnb",
            "brnnnbbnnbbnnnb",
            "brnnbnbnbnnbnnb",
            "brnnnnnnnnnnnnb",
            " brnnnnnnnnnnb ",
            "  brrnnnnnnnnb ",
            "   bbrrrrrbb   ",
            "    bbbbbb     ",
            "  bbbbgvb bbb  ",
            " bgvvbgvbbgvvb ",
            "bggggvbvbggggvb",
            "bggggvbbbggggvb"
        ]
    } ,
        {
            colors: {
//BOO
                b:"#000000 ",//Negro
                g:"#A9A9A9 ",//Gris
                r:"#FF0000"//Rojo
            },
            totxos: [
                "      bbbbb     ",
                "    bbgggggbb   ",
                "   bgg     ggb  ",
                "  bg         gb ",
                " bg       b bgb ",
                "bg bbb    b b gb",
                "bg bbb    b b gb",
                " bgb          gb",
                "bg  b    r r rgb",
                "bg       rrrrrgb",
                "bg      rrrrrrgb",
                "bg      r r rgb ",
                " bg          gb ",
                "  bgg      ggb  ",
                "   bbggggggbb   ",
                "     bbbbbb     "
            ]
        } , {
        colors: {

        b: "#000000", //negro
        a: "#FFFF00" // amarillo

        },

    totxos: [
        "    bbbbbb    ",
        "  bbb   bbbb  ",
        " bb  aaaaabb  ",
        " b aa   baabb ",
        "bb aa aabaabb ",
        "b aaa aabaaabb",
        "b aaa aabaaabb",
        "b aaa aabaaabb",
        "b aaa aabaaabb",
        "b aaa aabaaabb",
        "b aaa aabaaabb",
        "bb aa aabaaabb",
        " b aabbbbaabb ",
        " bb aaaaaabb  ",
        "  bbbaaabbbb  ",
        "    bbbbbb    "

    ]
        },{
            colors: {

            b: "#000000" //negro
        },

            totxos: [

                "      bbbbbb  bb",
                "    bbb     bb  ",
                "  bbbb bbbbbb bb",
                " bbb bbbbbbbbbbb",
                " bb  bbbbbbbbbbb",
                "b b  bbbbbbbbbbb",
                "b   bbbbb  bbbbb",
                "bbbbbb  b   bbbb",
                " bbbb      bbbbb",
                " bbbbb   bbbbbbb",
                "  bbbbbbbbbbbbbb",
                "   bbbbbbbbbbbbb",
                "      bbbbbb  bb"
            ]
        }
    ];
}