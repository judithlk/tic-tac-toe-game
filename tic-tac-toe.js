let x //for the number of the tile
let a, b, c //for the tiles to check
var record = [] //for the record of clicked tiles
var sign, sound, color //for the symbol of the player(X or O), the sound to play on clicking, and the symbol color
var gameOver = false //a variable to hold the boolean which determines if the game is over
var drawAlert //to hold the boolean which determines if the game is a draw
var i = 0 //iterations of the game
var alertType //variables for the 'notify' function
let winSound = new Audio('sounds/winner.wav');
let drawSound = new Audio('sounds/draw.wav');
let soundOn;
let clickSound;
var tester //to test if there is a winner. In the draw function, this is checked to avoid reading a draw when the final play is a winning play.

//light mode colors
var lightBg = "#FCD77F";
var lightBorder = "black";
var infoLight = "black";

//dark mode colors
var darkBg = "#1E1548";
var darkBorder = "lightgrey";
var infoDark = "lightgrey";

document.addEventListener("DOMContentLoaded", function() {
    const lightState = localStorage.getItem("state");
    console.log(lightState);
    if(lightState == "dark") {
        setDark();
        document.getElementById('bright-button').innerHTML = '<i class="fa-regular fa-lightbulb"></i>';
    } else {
        setLight();
        document.getElementById('bright-button').innerHTML = '<i class="fa-solid fa-lightbulb"></i>';
    };

    const soundState = localStorage.getItem("sound");
    if(soundState == "off") {
        soundOn = false;
    } else {
        soundOn = true;
    }
});

function play(x) { //the function to fill a tile with X or O
    while(i < 10) {
        if(gameOver == false){ //checks if the game is over or not
            if(record[x - 1] == null){ //checks if the selected tile has been filled
                if(i == 0 || i == 2 || i == 4 || i == 6 || i == 8){ //checks if it is player one
                    sign = "X";
                    color = "#FF2E4C";
                    clickSound = new Audio('sounds/xclick.wav');
                }else{ //if it is player two
                    sign = "O";
                    color = "#2E99B0";
                    clickSound = new Audio('sounds/oclick.wav');
                };
                document.getElementById("tile" + x).innerHTML = "<span class='letter' style=' color:" + color + "';>" + sign + "</span>"; //A span tag is created is created to write either X or O in the tile
                record[x - 1] = sign; //fills the record to keep track of players' moves
                if(soundOn == true){
                    clickSound.play();
                }
                i++;
                while(i == 9){ //when 10 moves have been made, the draw function is called
                    drawAlert = record.every(draw);
                    return;
                }
                return check(); 
            }else{
                notify("filled tile");
                return;
            }
        }else{
            notify("game over");
            break;
        }
    }
}

function check(){ //this function checks if any straight threes have been achieved by either player
    function sub(a,b,c){
        if(record[a] != null && record[b] != null && record[c] != null){ //makes sure none of the tiles to be checked is empty
            if(record[a] == record[b] && record[b] == record[c]){ //checks the record, if the three tiles have the same symbol
                gameOver = true;
                tester = true;
                if(record[a] == "X"){
                    notify("Player X");
                    return;
                }else if(record[a] == "O"){
                    notify("Player O");
                    return;
                }
            }
        }
    }
    //run the function for the different possible arrangements of a win
    sub(0,1,2); // row one
    sub(3,4,5); // row two
    sub(6,7,8); // row three
    sub(0,3,6); // column one
    sub(1,4,7); // column two
    sub(2,5,8); // column three
    sub(0,4,8); // diagonal, top left to bottom right
    sub(2,4,6); // diagonal, top right to bottom left
}

function draw(){ // the aim of this function is to determine if a draw has been reached between the players
    if(record.length == 9){
        check();
        if(tester != true){
            notify("draw");
        }
        return;
    }
}

function reset(){ // a function to clear the tiles
    let tiles = document.querySelectorAll('.letter');
    tiles.forEach(letter => {
        letter.remove();
    });
    record = [];
    i = 0;
    gameOver = false;
    if(document.getElementById("alert-box").style.display == "block"){
        document.getElementById("alert-box").style.display = "none";
    };
    tester = "";
}

function okay(){ // a function to hide the alert box without resetting the game
    document.getElementById("alert-box").style.display = "none";
}

function notify(alertType){ //A function to display alert messages
    document.getElementById("alert-box").style.display = "block";
    if(alertType == "game over"){
        document.getElementById("alert-message").innerHTML = "Game Over! Reset?";
        document.getElementById("alert-buttons").innerHTML = '<button class="alert-button" onclick="reset()">Reset</button> <button class="alert-button" onclick="okay()">Okay</button>';
    }else if(alertType == "filled tile"){
        document.getElementById("alert-message").innerHTML = "This tile is already filled";
        document.getElementById("alert-buttons").innerHTML = '<button class="alert-button" onclick="okay()">Okay</button>';
    }else if(alertType == "Player X"){
        document.getElementById("alert-message").innerHTML = alertType + " wins! Play again?";
        document.getElementById("alert-buttons").innerHTML = '<button class="alert-button" onclick="reset()">Again</button> <button class="alert-button" onclick="okay()">Okay</button>';
        if(soundOn == true){
            winSound.play();
        };
    }else if(alertType == "Player O"){
        document.getElementById("alert-message").innerHTML = alertType + " wins! Play again?";
        document.getElementById("alert-buttons").innerHTML = '<button class="alert-button" onclick="reset()">Again</button> <button class="alert-button" onclick="okay()">Okay</button>';
        if(soundOn == true){
            winSound.play();
        };
    }else if(alertType == "draw"){
        document.getElementById("alert-message").innerHTML = "Draw! Play again?";
        document.getElementById("alert-buttons").innerHTML = '<button class="alert-button" onclick="reset()">Again</button> <button class="alert-button" onclick="okay()">Okay</button>';
        if(soundOn == true){
            drawSound.play();
        };
    }
}

function sound(){ // a function to control the sound
    if(document.getElementById("sound-button").innerHTML == '<i class="fa-solid fa-volume-xmark"></i>'){
        document.getElementById("sound-button").innerHTML = '<i class="fa-solid fa-volume-high"></i>';
        localStorage.setItem("sound", "off");
        soundOn = false;
    }else if(document.getElementById("sound-button").innerHTML == '<i class="fa-solid fa-volume-high"></i>'){
        document.getElementById("sound-button").innerHTML = '<i class="fa-solid fa-volume-xmark"></i>';
        localStorage.setItem("sound", "on");
        soundOn = true;
    }
}

function brightness() {
    if(document.getElementById('bright-button').innerHTML == '<i class="fa-regular fa-lightbulb"></i>') {
        document.getElementById('bright-button').innerHTML = '<i class="fa-solid fa-lightbulb"></i>';
        setLight();
        localStorage.setItem("state", "light");
    } else if(document.getElementById('bright-button').innerHTML == '<i class="fa-solid fa-lightbulb"></i>') {
        document.getElementById('bright-button').innerHTML = '<i class="fa-regular fa-lightbulb"></i>';
        setDark();
        localStorage.setItem("state", "dark");
    }
}

function setLight() {
    document.body.style.backgroundColor = lightBg;
    document.getElementById('info-container').style.color = infoLight;
    document.getElementById('title').style.color = infoLight;
    var tiles = document.querySelectorAll('.tile');
    for(var i = 0; i < tiles.length; i++) {
        tiles[i].style.border = '2px solid ' + lightBorder;
        if(i == 0) {
            tiles[i].style.borderTop = 'none';
            tiles[i].style.borderLeft = 'none';
        } else  if(i == 1) {
            tiles[i].style.borderTop = 'none';
        } else if(i == 2) {
            tiles[i].style.borderRight = 'none';
            tiles[i].style.borderTop = 'none';
        } else if(i == 3) {
            tiles[i].style.borderLeft = 'none';
        } else if(i == 5) {
            tiles[i].style.borderRight = 'none';
        } else if(i == 6) {
            tiles[i].style.borderLeft = 'none';
            tiles[i].style.borderBottom = 'none';
        } else if(i == 7) {
            tiles[i].style.borderBottom = 'none';
        } else if(i == 8) {
            tiles[i].style.borderRight = 'none';
            tiles[i].style.borderBottom = 'none';
        }
    };
}

function setDark() {
    document.body.style.backgroundColor = darkBg;
    document.getElementById('info-container').style.color = infoDark;
    document.getElementById('title').style.color = infoDark;
    var tiles = document.querySelectorAll('.tile');
    for(var i = 0; i < tiles.length; i++) {
        tiles[i].style.border = '2px solid ' + darkBorder;
        if(i == 0) {
            tiles[i].style.borderTop = 'none';
            tiles[i].style.borderLeft = 'none';
        } else  if(i == 1) {
            tiles[i].style.borderTop = 'none';
        } else if(i == 2) {
            tiles[i].style.borderRight = 'none';
            tiles[i].style.borderTop = 'none';
        } else if(i == 3) {
            tiles[i].style.borderLeft = 'none';
        } else if(i == 5) {
            tiles[i].style.borderRight = 'none';
        } else if(i == 6) {
            tiles[i].style.borderLeft = 'none';
            tiles[i].style.borderBottom = 'none';
        } else if(i == 7) {
            tiles[i].style.borderBottom = 'none';
        } else if(i == 8) {
            tiles[i].style.borderRight = 'none';
            tiles[i].style.borderBottom = 'none';
        }
    };
}