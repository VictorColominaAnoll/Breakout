function select(obj){

    var gameModes = document.querySelectorAll(".game-mode");

    gameModes.forEach(element => {
        element.classList.remove("selected");
    });

    obj.classList.add("selected");

}

function play(){
    window.location.href = "./game.html";
}