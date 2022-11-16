const wrap = document.getElementById("wrapper");

const arrH = 20; // height in blocks for the play area
const arrW = 30; // width in blocks
// const fieldArr = []; // holds the id's of every block
const playerArr = ["0-0"]; // holds all tiles that makes the players snake
let goal = Math.floor(Math.random() * (arrH-1) + 1) + "-" + Math.floor(Math.random() * (arrW-1) + 1); // tile to "eat" and grow bigger
const growth = 3; // amount of tiles the player grows for each goal
let grow = 0; // current amount to grow
let gameSpeed = 300; // update speed, in milliseconds
let gameEnd = false; // not used right now
let score = 0;

let lastKey = ""; // last key pressed
// allows next input, there to prevent a bug where you could press
// w and d within a game tick to turn around while going to the left
let canMove = true;

// fill the field array with id's in form of "0-0" or "12-3" which corresponds to row-column
for(let i = 0; i < arrH; i++){
    for(let j = 0; j < arrW; j++){
        // fieldArr.push(i+"-"+j);
        const block = document.createElement("div");
        block.className = "block";
        block.id = i+"-"+j;
        block.style.width = `calc(100%/${arrW})`;
        block.style.height = `calc(100%/${arrH})`;
        // block.innerHTML = i+"-"+j;
        wrap.appendChild(block);
    };
};

// draw the initial player to the screen
for(let i = 0; i < playerArr.length; i++){
    const tile = document.getElementById(playerArr[i]);
    tile.style.backgroundColor = "red";
}

// draw the goal
document.getElementById(goal).style.backgroundColor = "green";

// check user input and dont let the player go back in it self
window.addEventListener("keypress", (e) => {
    if(canMove){
        if(e.key == "w" && lastKey != "s"){
            lastKey = e.key;
        }
        if(e.key == "a" && lastKey != "d"){
            lastKey = e.key;
        }
        if(e.key == "s" && lastKey != "w"){
            lastKey = e.key;
        }
        if(e.key == "d" && lastKey != "a"){
            lastKey = e.key;
        }
        canMove = false; // wait for the next game tick to reallow movement, prevents a bug
    }
});

// game loop
const gameLoop = setInterval(() => {
    // console.log(playerArr);
    const lastPos = document.getElementById(playerArr[playerArr.length-1]); // last entry in player array
    const pPos = playerArr[0].split("-"); // read out the numbers from "10-10" for example
    pPos[0] = Number(pPos[0]);
    pPos[1] = Number(pPos[1]);
    switch(lastKey){
        case "w": // up
            pPos[0] -= 1;
            update(pPos, lastPos);
            break;

        case "s": // down
            pPos[0] += 1;
            update(pPos, lastPos);
            break;

        case "a": // left
            pPos[1] -= 1;
            update(pPos, lastPos);
            break;

        case "d": // right
            pPos[1] += 1;
            update(pPos, lastPos);
            break;

        default:
            break;
    }
    canMove = true; // allow next input
}, gameSpeed);

function update(pPos, lastPos){
    // check if out of bounds and terminate game loop if true
    if(pPos[0] < 0 || pPos[0] > arrH-1 || pPos[1] < 0 || pPos[1] > arrW-1 || playerArr.includes(pPos.join("-"))){
        console.log("end");
        gameEnd = true;
        if(playerArr.includes(pPos.join("-"))){ // this if is just for visuals
            playerArr.unshift(pPos.join("-")); // put the new position in the first spot in the array
        }
        const pDiv = document.getElementById(playerArr[0]);
        pDiv.style.backgroundColor = "darkred";
        clearInterval(gameLoop); // terminate loop
    }
    // otherwise update the player array and goal
    else{
        // if players tile is the goal
        if(playerArr[0] == goal){
            grow += growth; // add a preset amount the player should grow
            score += 1;
            gameSpeed -= 10; // make it harder
            console.log(score);
            while(playerArr.includes(goal)){ // checks if the new goal is inside the player and repeats until not
                let ran1 = Math.floor(Math.random() * arrH);
                let ran2 = Math.floor(Math.random() * arrW);
                goal = ran1 + "-" + ran2;
            }
            document.getElementById(goal).style.backgroundColor = "green";
        }
        playerArr.unshift(pPos.join("-")); // put the new position in the first spot in the array
        const pDiv = document.getElementById(playerArr[0]);
        pDiv.style.backgroundColor = "red";
        // if there is grow then dont delete the last array entry from player
        // that way there is a new tile added to the players array and we can grow
        if(grow > 0){
            grow--;
        }
        // otherwise delete the last entry from the array as we move forward
        else{
            lastPos.style.backgroundColor = "";
            playerArr.pop();
        }
        
    }
}