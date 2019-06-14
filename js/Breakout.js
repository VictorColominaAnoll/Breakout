/**
 * Created by spries on 02/06/2016.
 */

var game;

$(document).ready(function () {
    game = new Game();
    game.inicialitzar();
});

function mainLoop() {
    game.update();
    game.draw();
    requestAnimationFrame(mainLoop);
}

/////////////////////////////////// Utilitats /////////////////////////////////////

var Utilitats = {};
Utilitats.esTallen = function (p1, p2, p3, p4) {
    function check(p1, p2, p3) {
        return (p2.y - p1.y) * (p3.x - p1.x) < (p3.y - p1.y) * (p2.x - p1.x);
    }
    return check(p1, p2, p3) != check(p1, p2, p4) && check(p1, p3, p4) != check(p2, p3, p4);
}

// si retorna undefined Ã©s que no es tallen
Utilitats.puntInterseccio = function (p1, p2, p3, p4) {
    var A1, B1, C1, A2, B2, C2, x, y, d;
    if (Utilitats.esTallen(p1, p2, p3, p4)) {
        A1 = p2.y - p1.y; B1 = p1.x - p2.x; C1 = p1.x * p2.y - p2.x * p1.y;
        A2 = p4.y - p3.y; B2 = p3.x - p4.x; C2 = p3.x * p4.y - p4.x * p3.y;
        d = A1 * B2 - A2 * B1;
        if (d != 0) {
            x = (C1 * B2 - C2 * B1) / d;
            y = (A1 * C2 - A2 * C1) / d;
            return { x: x, y: y };
        }
    }
}

Utilitats.puntInterseccio2 = function (p1, p2, p3, p4) {
    // converteix segment1 a la forma general de recta: Ax+By = C
    var a1 = p2.y - p1.y;
    var b1 = p1.x - p2.x;
    var c1 = a1 * p1.x + b1 * p1.y;

    // converteix segment2 a la forma general de recta: Ax+By = C
    var a2 = p4.y - p3.y;
    var b2 = p3.x - p4.x;
    var c2 = a2 * p3.x + b2 * p3.y;

    // calculem el punt intersecciÃ³
    var d = a1 * b2 - a2 * b1;

    // lÃ­nies paralÂ·leles quan d Ã©s 0
    if (d == 0) {
        return false;
    }
    else {
        var x = (b2 * c1 - b1 * c2) / d;
        var y = (a1 * c2 - a2 * c1) / d;
        var puntInterseccio = { x: x, y: y };	// aquest punt pertany a les dues rectes
        if (Utilitats.contePunt(p1, p2, puntInterseccio) && Utilitats.contePunt(p3, p4, puntInterseccio))
            return puntInterseccio;
    }
}

Utilitats.contePunt = function (p1, p2, punt) {
    return (valorDinsInterval(p1.x, punt.x, p2.x) || valorDinsInterval(p1.y, punt.y, p2.y));

    // funciÃ³ interna
    function valorDinsInterval(a, b, c) {
        // retorna cert si b estÃ  entre a i b, ambdos exclosos
        if (Math.abs(a - b) < 0.000001 || Math.abs(b - c) < 0.000001) { // no podem fer a==b amb valors reals!!
            return false;
        }
        return (a < b && b < c) || (c < b && b < a);
    }
}

Utilitats.distancia = function (p1, p2) {
    return Math.sqrt((p2.x - p1.x) * (p2.x - p1.x) + (p2.y - p1.y) * (p2.y - p1.y));
}

Utilitats.interseccioSegmentRectangle = function (seg, rect) {  // seg={p1:{x:,y:},p2:{x:,y:}}
    // rect={p:{x:,y:},w:,h:}
    var pI, dI, pImin, dImin = Infinity, vora;
    // vora superior
    pI = Utilitats.puntInterseccio(seg.p1, seg.p2,
        { x: rect.p.x, y: rect.p.y }, { x: rect.p.x + rect.w, y: rect.p.y });
    if (pI) {
        dI = Utilitats.distancia(seg.p1, pI);
        if (dI < dImin) {
            dImin = dI;
            pImin = pI;
            vora = "superior";
        }
    }
    // vora inferior
    pI = Utilitats.puntInterseccio(seg.p1, seg.p2,
        { x: rect.p.x + rect.w, y: rect.p.y + rect.h }, { x: rect.p.x, y: rect.p.y + rect.h });
    if (pI) {
        dI = Utilitats.distancia(seg.p1, pI);
        if (dI < dImin) {
            dImin = dI;
            pImin = pI;
            vora = "inferior";
        }
    }

    // vora esquerra
    pI = Utilitats.puntInterseccio(seg.p1, seg.p2,
        { x: rect.p.x, y: rect.p.y + rect.h }, { x: rect.p.x, y: rect.p.y });
    if (pI) {
        dI = Utilitats.distancia(seg.p1, pI);
        if (dI < dImin) {
            dImin = dI;
            pImin = pI;
            vora = "esquerra";
        }
    }
    // vora dreta
    pI = Utilitats.puntInterseccio(seg.p1, seg.p2,
        { x: rect.p.x + rect.w, y: rect.p.y }, { x: rect.p.x + rect.w, y: rect.p.y + rect.h });
    if (pI) {
        dI = Utilitats.distancia(seg.p1, pI);
        if (dI < dImin) {
            dImin = dI;
            pImin = pI;
            vora = "dreta";
        }
    }

    if (vora) {
        return { p: pImin, vora: vora }
    }

}

Utilitats.nombreAleatoriEntre = function (minim, maxim) {
    return Math.random() * ((maxim - minim + 1) + minim)
}

