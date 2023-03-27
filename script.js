const moves = document.getElementById("moves-count");
const timeValue = document.getElementById("time");
const startButton = document.getElementById("start");
const stopButton = document.getElementById("stop");
const gameContainer= document.querySelector(".game-container");
const result = document.getElementById("result")
const controls = document.querySelector(".controls-container");
let canClick = true; 
let cards;
let interval;
let firstCard =false;
let secondCard = false;
const isGameOver = () => {
    return document.querySelectorAll('.matched').length === cards.length;
  };
//ITEMS ARRAY
const items=[
    {name:"dog", image:"dog.jpg"},
    {name:"cat", image:"cat.jpg"},
    {name:"panda", image:"panda.jpg"},
    {name:"croc", image:"croc.jpg"},
    {name:"peng", image:"peng.jpg"},
    {name:"rabit", image:"rabit.jpg"},
    {name:"tiger", image:"tiger.jpg"},
    {name:"lizard", image:"lizard.jpg"}
];

let second =0,
    minutes=0;

let movesCount= 0,
    winCount =0;
const timeGenerator=()=>{
    second+=1;
    if(second>=60){
        minutes+=1;
        second=0;


    }
    //format time before displaying
    let secondValue=second<10?`0${second}`:second;
    let minuteValue=minutes<10?`0${minutes}`:minutes;

    timeValue.innerHTML=`<span>Time:</span>${minuteValue}:${secondValue}`;
};

//for caluculating moves
const movesCounter=()=>{
    movesCount+=1;
    moves.innerHTML=`<span>Moves: </span>${movesCount}`;
};

//pick random object from the items array
const generateRandom =(size=4)=>{
    //temp array
    let tempArray=[...items];
    //initializes cardvalue
    let cardValues=[];
    //size should be double(4*4)/2
    size=(size*size)/2;
    //random object selection
    for(let i=0;i<size;i++){
        const randomIndex = Math.floor(Math.random()* tempArray.length);
        cardValues.push(tempArray[randomIndex]);
        tempArray.splice(randomIndex,1);
    }
    return cardValues;
};

const matrixGenerator=(cardValues, size=4)=>{
    gameContainer.innerHTML="";
    cardValues=[...cardValues, ...cardValues];
    cardValues.sort(()=>Math.random()-0.5);
    for(let i=0;i<size*size;i++){
        gameContainer.innerHTML+=`
        <div class="card-container" data-card-value="${cardValues[i].name}">
            <div class="card-before">?</div>
            <div class="card-after"><img src="${cardValues[i].image}" class="image" /></div>
        </div>`
    }

    gameContainer.style.gridTemplateColumns=`repeat(${size},auto)`;
    cards= document.querySelectorAll(".card-container");
    cards.forEach((card) => {
        card.addEventListener("click", () => {
          if (canClick && !card.classList.contains("matched") && !card.classList.contains("flipped")) {
            card.classList.add("flipped");
            if (!firstCard) {
              firstCard = card;
              firstCardValue = card.getAttribute("data-card-value");
            } else {
              movesCounter();
              secondCard = card;
              let secondCardValue = card.getAttribute("data-card-value");
              if (firstCardValue == secondCardValue) {
                firstCard.classList.add("matched");
                secondCard.classList.add("matched");
                firstCard = false;
                winCount += 1;
                if (winCount == Math.floor(cardValues.length / 2)) {
                  result.innerHTML = `<h2>You Won</h2><h4>Moves:${movesCount}</h4>`;
                  
                  stopGame();
                }
              } else {
                let [tempFirst, tempSecond] = [firstCard, secondCard];
                firstCard = false;
                secondCard = false;
                canClick = false; // prevent clicking on other cards while two cards are already flipped
                let delay = setTimeout(() => {
                  tempFirst.classList.remove("flipped");
                  tempSecond.classList.remove("flipped");
                  canClick = true; // allow clicking on cards again
                }, 900);
              }
            }
          }
        });
      });
};

//start game 
startButton.addEventListener("click",()=>{
    movesCount=0;
    time=0;
    controls.classList.add("hide");
    stopButton.classList.remove("hide");
    startButton.classList.add("hide");
    interval=setInterval(timeGenerator,1000);

    moves.innerHTML=`<span>Moves:</span>${movesCount}`;
    initializer();

});
stopButton.addEventListener("click",(stopeGame=()=>{
    
    controls.classList.remove("hide");
    stopButton.classList.add("hide");
    startButton.classList.remove("hide");
    second=0;
    minutes=0;
    clearInterval(interval);
}))

const initializer =()=>{
    result.innerText="";
    winCount=0;
    let cardValues=generateRandom();
    matrixGenerator(cardValues);
};


