class Card
{
    constructor(isFlipped, hasDuck)
    {
        this.isFlipped = isFlipped;
        this.hasDuck = hasDuck;
    }

    flip()
    {
        this.isFlipped = !this.isFlipped;
    }

    duckify(aflag)
    {
       this.hasDuck = aflag;
    }
    
    //reset all flipped cards
    reset()
    {
        this.duckify(false)
        this.isFlipped = false
    }
}


let grid = document.getElementsByClassName("gameBoard")

const ROW = 6;
const COLUMN = 6;
const MAX_GUESS = 9;
const randLimit = 4;
const POINTS = 1;
const DUCK_LIMIT = 6;

var score = 0;
var guess = 0;
let cardList = []
let cardObjList = []
let isGameOn = true;

function createCards()
{
    let count = 0;
    let board = document.getElementById("gameBoard").children[0].children;
    for(let x = 0; x < ROW; x++){
        for(let y = 0; y < COLUMN; y++){

            // Creates card
            const card = document.createElement("td")
            
            // saves HTML elment for tracking
            cardList.push(card);
            
            //Add click listener
            let func = "flipCard(" + count + ")"
            card.setAttribute("onclick", func)
    
            cardObj = new Card(false, false)
            
            //cardObj is in sync with Card element
            cardObjList.push(cardObj)

            updateVisuals(count)
    
            board[x + 1].appendChild(card)
            count++
        }
        
        // game starts
    }
    startGame();
}



function startGame()
{
    numList = []
    while(numList.length < DUCK_LIMIT)
    {
         // generates random duck cards
         random = Math.floor(Math.random() *ROW * COLUMN)

         if(!numList.includes(random))
         {
            cardObjList[random].duckify(true)
            numList.push(random)
         }
    }

    isGameOn = true
}

function resetGame()
{
    // removes ducks and flips back all cards then starts the game
    for(let i = 0; i < cardObjList.length; i++)
    {
        cardObjList[i].reset()
        updateVisuals(i)
    }
    
    score = 0
    guess = 0
    isGameOn = true
    updateStats()
    startGame()
}

function flipCard(e)
{
    // will only flip card if game is active
    if(isGameOn)
    {
        cardObj = cardObjList[e]

        if(cardObj.isFlipped)
        {
            return
        }

        // if the card has a duck give it points
        if(cardObj.hasDuck)
        {
            score += POINTS;
            var audio = new Audio('quack.mp3')
            audio.play()
            if(score == DUCK_LIMIT){
                alert("You got them all!");
                endGame()
            }
        }

        // endgame if guess has passed its limit
        guess++;
        if(guess > MAX_GUESS)
        {
            endGame()
            alert("You have used up all of your shots!");
        }

        //flip card
        cardObj.flip()
        updateVisuals(e)
        updateStats();
    }
}

const updateStats = () => {
    let scoreBoard = document.getElementById("scoreTracker");
    scoreBoard.innerHTML = (score + "/" + DUCK_LIMIT);
    let guessBoard = document.getElementById("tryTracker");
    guessBoard.innerHTML = (guess + "/" + (MAX_GUESS + 1));
}

/*
* 1 = hidden
* 2 = duck
* 3 = nothing
*/
const updateVisuals = (index) => {
    comp = cardList[index]
    comp.classList.remove("defaultSprite")
    comp.classList.remove("duckSprite")
    comp.classList.remove("revealedSprite")
    let reveal = cardObjList[index].isFlipped;
    let duck = cardObjList[index].hasDuck;
    if(reveal){
        if(duck){
            comp.classList.add("duckSprite")
        }else{
            comp.classList.add("revealedSprite")
        }
    }else{
        comp.classList.add("defaultSprite")
    }
}

function endGame()
{
    isGameOn = false;
}

// init UI
window.onload = () => {
    createCards()
    updateStats()
}


document.getElementById("resetBtn").addEventListener("click", function(){resetGame()})