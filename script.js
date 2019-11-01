// Card Variables 
let cards = ['Spades', 'Hearts', 'Diamonds', 'Clubs'];
let values = ['Ace', 'Jack', 'King', 'Queen', 'Ten', 'Nine', 'Eight', 'Seven', 'Six', 'Five', 'Four', 'Three', 'Two'];

// DOM Variables
let textArea = document.getElementById('text-area');
let newGameButton = document.getElementById('new-game-button');
let hitButton = document.getElementById('hit-button');
let stayButton = document.getElementById('stay-button');

// Game Variables
let gameStarted = false,
    gameOver = false,
    playerWon = false,
    draw = false,
    dealerCards = [],
    playerCards = [],
    dealerScore = 0,
    playerScore = 0,
    deck = [];

hitButton.style.display = 'none';
stayButton.style.display = 'none';
showStatus();

newGameButton.addEventListener('click', function() {
    gameStarted = true;
    gameOver = false;
    playerWon = false;
    draw = false;

    deck = createDeck();
    shuffleDeck(deck);
    dealerCards = [getNextCard(), getNextCard()];
    playerCards = [getNextCard(), getNextCard()];

    //textArea.innerText = 'Started...';
    newGameButton.style.display = 'none';
    hitButton.style.display = 'inline';
    stayButton.style.display = 'inline';
    textArea.style.color = '';
    showStatus();
});

hitButton.addEventListener('click', function() {
    playerCards.push(getNextCard());
    checkForEndOfGame();
    showStatus();
});

stayButton.addEventListener('click', function() {
    gameOver = true;
    checkForEndOfGame();
    showStatus();
});

function createDeck() {
    let deck = [];
    for (let cardId = 0; cardId < cards.length; cardId++) {

        for (let valueId = 0; valueId < values.length; valueId++) {
            let card = {
                suit: cards[cardId],
                value: values[valueId]
            };
            deck.push(card);

        }
    }
    return deck;
}

function shuffleDeck(deck) {
    for (let i = 0; i < deck.length; i++) {
        let swapId = Math.trunc(Math.random() * deck.length);
        let tmp = deck[swapId];
        deck[swapId] = deck[i];
        deck[i] = tmp;
    }
}

function getCardString(card) {
    return card.value + ' of ' + card.suit;
}

function getCardNumericValue(card) {
    switch (card.value) {
        case 'Ace':
            return 1;
        case 'Two':
            return 2;
        case 'Three':
            return 3;
        case 'Four':
            return 4;
        case 'Five':
            return 5;
        case 'Six':
            return 6;
        case 'Seven':
            return 7;
        case 'Eight':
            return 8;
        case 'Nine':
            return 9;
        default:
            return 10;

    }
}

function getScore(cardArray) {
    let score = 0;
    let hasAce = false;
    for (let i = 0; i < cardArray.length; i++) {
        let card = cardArray[i];
        score += getCardNumericValue(card);
        if (card.value === 'Ace') {
            hasAce = true;
        }
    }
    if (hasAce && score + 10 <= 21) {
        return score + 10;
    }
    return score;
}

function updateScores() {
    dealerScore = getScore(dealerCards);
    playerScore = getScore(playerCards);
}

function checkForEndOfGame() {

    updateScores();

    if (gameOver) {
        while (dealerScore < playerScore &&
            playerScore <= 21 &&
            dealerScore < 17) {
            dealerCards.push(getNextCard());
            updateScores();
        }
    }

    if (playerScore > 21) {
        playerWon = false;
        gameOver = true;
    } else if (playerScore === 21) {
        playerWon = true;
        gameOver = true;
    } else if (dealerScore > 21) {
        playerWon = true;
        gameOver = true;
    } else if (gameOver) {

        if (playerScore === dealerScore) {
            draw = true;
        } else if (playerScore > dealerScore) {
            playerWon = true;
        } else {
            playerWon = false;
        }

        newGameButton.style.display = 'inline';
        hitButton.style.display = 'none';
        stayButton.style.display = 'none';
    }

}

function showStatus() {
    if (!gameStarted) {
        textArea.innerText = 'Welcome to Blackjack!';
        return;
    }

    let dealerCardString = '';
    for (let i = 0; i < dealerCards.length; i++) {
        dealerCardString += getCardString(dealerCards[i]) + '\n';
    }

    let playerCardString = '';
    for (let i = 0; i < playerCards.length; i++) {
        playerCardString += getCardString(playerCards[i]) + '\n';
    }

    /*   for (var i = 0; i < deck.length; i++) {
           textArea.innerText += '\n' + getCardString(deck[i]);
       }*/

    updateScores();

    textArea.innerText =
        'Dealer has:\n' +
        dealerCardString +
        '(score: ' + dealerScore + ')\n\n' +

        'Player has:\n' +
        playerCardString +
        '(score: ' + playerScore + ')\n\n';

    if (gameOver) {
        if (playerWon) {
            textArea.innerText += "YOU WIN!";
            textArea.style.color = 'green';
        } else if (draw) {
            textArea.innerText += "IT'S A DRAW";
            textArea.style.color = 'grey';
        } else {
            textArea.innerText += "DEALER WINS";
            textArea.style.color = 'red';
        }
        newGameButton.style.display = 'inline';
        hitButton.style.display = 'none';
        stayButton.style.display = 'none';
    }

}

function getNextCard() {
    return deck.shift();
}