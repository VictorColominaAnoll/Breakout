//  Game Object 
var mode = "1";

function Game() {

    this.AMPLADA_TOTXO = 50; this.ALÇADA_TOTXO = 25; // MIDES DEL TOTXO EN PÃXELS
    this.canvas, this.context;       // context per poder dibuixar en el Canvas
    this.width, this.height;          // mides del canvas

    this.paddle;   // la raqueta
    this.ball = [];     // array de pilota/s
    this.totxo;

    this.willFrame = true;

    if (mode == "2")
        this.superiorPaddle; // Mode en el que la raqueta va al contrari

    if (mode == "3")
        this.reversPaddle; // Mode en el que la raqueta va al contrari

    this.vida = 4;

    this.numeroBall = 1;

    this.NIVELLS;
    this.nivellActual = 0;

    this.reinici = false;

    this.lol = []; // Array que conté tots els totxos de la partida actual
    this.lolPower = []; // Array de totxos que deixaran anar un power

    this.power = [];

    this.t = 0;      // el temps

    // Events del teclat
    this.key = {
        RIGHT: { code: 39, pressed: false },
        LEFT: { code: 37, pressed: false },
        A: { code: 65, pressed: false },
        D: { code: 68, pressed: false },
        SPACE: { code: 32, pressed: false }
    };

}

Game.prototype.inicialitzar = function () {

    this.t = 0;

    this.canvas = document.getElementById("game");
    this.width = this.AMPLADA_TOTXO * 19;  // 15 totxos com a mÃ xim d'amplada
    this.canvas.width = this.width;
    this.height = this.ALÇADA_TOTXO * 25;
    this.canvas.height = this.height;
    this.context = this.canvas.getContext("2d");

    this.paddle = new Paddle();

    if (mode == "2")
        this.superiorPaddle = new superiorPaddle();

    if (mode == "3")
        this.reversPaddle = new reversPaddle();

    for (var i = 0; i < this.numeroBall; i++) {
        this.ball.push(new Ball());
    }

    this.llegirNivells();

    var variableX = 75;
    var variableY = 0;

    for (var j = 0; j < this.NIVELLS[this.nivellActual].totxos.length; j++) {

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

    for (var i = 0; i < vegades; i++) {
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
    $(document).on("keydown", { game: this }, function (e) {
        if (e.keyCode == e.data.game.key.RIGHT.code) {
            e.data.game.key.RIGHT.pressed = true;
        }
        else if (e.keyCode == e.data.game.key.LEFT.code) {
            e.data.game.key.LEFT.pressed = true;
        }
        else if (e.keyCode == e.data.game.key.A.code) {
            e.data.game.key.A.pressed = true;
        }
        else if (e.keyCode == e.data.game.key.D.code) {
            e.data.game.key.D.pressed = true;
        }
        else if (e.keyCode == e.data.game.key.SPACE.code) {
            e.data.game.key.SPACE.pressed = true;
        }
    });
    $(document).on("keyup", { game: this }, function (e) {
        if (e.keyCode == e.data.game.key.RIGHT.code) {
            e.data.game.key.RIGHT.pressed = false;
            e.data.game.key.RIGHT.pressed = false;
        }
        else if (e.keyCode == e.data.game.key.LEFT.code) {
            e.data.game.key.LEFT.pressed = false;
        }
        else if (e.keyCode == e.data.game.key.A.code) {
            e.data.game.key.A.pressed = false;
        }
        else if (e.keyCode == e.data.game.key.D.code) {
            e.data.game.key.D.pressed = false;
        }
        else if (e.keyCode == e.data.game.key.SPACE.code) {
            e.data.game.key.SPACE.pressed = false;
        }
    });

    this.t = new Date().getTime();     // inicialitzem el temps

    if (this.willFrame)
        requestAnimationFrame(mainLoop);
    else
        this.willFrame = true;

}

Game.prototype.draw = function () {

    var pelota;

    if (game.lol.length == 0) {
        this.nivellActual++;
        delete game;
        delete this.paddle;
        this.ball = [];

        this.numeroBall = 1;

        this.willFrame = false;

        game.inicialitzar();
    }

    this.context.clearRect(0, 0, this.width, this.height);

    for (var k = 0; k < this.lol.length; k++)
        this.lol[k].draw(this.context);

    this.paddle.draw(this.context);


    for (var i = 0; i < this.numeroBall; i++) {
        this.ball[i].draw(this.context);
    }
    for (var i = 0; i < this.numeroBall; i++) {
        if (this.reinici) {
            pelota = this.ball[i];
            pelota.x = this.paddle.x + (this.paddle.width / 2);
            pelota.y = this.paddle.y - 10;
        }

        if (this.key.SPACE.pressed && this.reinici) {
            this.reinici = false;
        }
    }

    for (var i = 0; i < this.power.length; i++) {
        if (this.power.length != 0) {
            this.power[i].draw(this.context);
        }
    }

    if (mode == "2")
        this.superiorPaddle.draw(this.context);

    if (mode == "3")
        this.reversPaddle.draw(this.context);

};

Game.prototype.update = function () {
    var dt = Math.min((new Date().getTime() - this.t) / 1000, 1); // temps, en segons, que ha passat des del darrer update
    this.t = new Date().getTime();

    if (this.vida > 3) {
        $("#numeroVides").css("display", "inline");
        $("#numeroVides").text("x" + this.vida)
        $("#vida2").css("display", "none");
        $("#vida3").css("display", "none");

    }
    else if (this.vida == 1) {
        $("#numeroVides").css("display", "none");
        $("#vida2").css("display", "none");
        $("#vida3").css("display", "none");
    }
    else if (this.vida == 2) {
        $("#numeroVides").css("display", "none");
        $("#vida2").css("display", "inline");
        $("#vida3").css("display", "none");
    }
    else if (this.vida == 3) {
        $("#numeroVides").css("display", "none");
        $("#vida2").css("display", "inline");
        $("#vida3").css("display", "inline");
    }
    else if (this.vida == 0) {
        $("#numeroVides").css("display", "none");
        $("#vida1").css("display", "none");
        $("#vida2").css("display", "none");
        $("#vida3").css("display", "none");
    }

    this.paddle.update();    // Moviment de la raqueta

    for (var i = 0; i < this.numeroBall; i++) {
        this.ball[i].update(dt);    // moviment de la bola, depen del temps que ha passat
    }

    for (var i = 0; i < this.power.length; i++) {
        if (this.power.length != 0) {
            this.power[i].update(dt);
        }
    }

    if (mode == "2")
        this.superiorPaddle.update(); // Moviment de la raqueta mirall

    if (mode == "3")
        this.reversPaddle.update(); // Moviment de la raqueta mirall
};

Game.prototype.llegirNivells = function () {
    this.NIVELLS = [
        {
            colors: {
                //BOMBA
                l: "#000080", // Lila
                a: "#0000FF", // Lila flojo
                n: "#000000 ", // Negro
                b: "#FFFFFF", // Blanco
                s: "#9370DB", // Rosa
                r: "#FF0000 "//Rojo
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
                n: "#FF8C00",//Naranja
                r: "#FF0000 ",//Rojo
                b: "#000000",//Negro
                g: "#32CD32 ",//Verde
                v: "#7CFC00 ",//Vede flojito
            },
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
        },
        {
            colors: {
                //BOO
                b: "#000000 ",//Negro
                g: "#A9A9A9 ",//Gris
                r: "#FF0000"//Rojo
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
        }, {
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
        }, {
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
