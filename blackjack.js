const deck = new Array();
let player;
let dealer;
let chips = 1000;
let currBet = 0;

function buildDeck() {
    const cardVals = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K", "A"];
    const suits = ['spades', 'clubs', 'hearts', 'diams'];

    for (let i = 0; i < cardVals.length; i++) {
        for (let j = 0; j < suits.length; j++) {
            let currCard = { val: cardVals[i], suit: suits[j] };
            deck.push(currCard);
        }
    }
}

function shuffle() {
    for (let i = 0; i < deck.length; i++) {
        let j = Math.floor(Math.random() * deck.length);
        let temp = deck[i];
        deck[i] = deck[j];
        deck[j] = temp;
    }
}

function addPlayerDealer() {
    let playerHand = new Array();
    player = { name: 'Player', cards: playerHand, busted: 0 }
    let dealerHand = new Array();
    dealer = { name: 'Dealer', cards: dealerHand, busted: 0 }
}

function deal() {
    for (let i = 0; i < 2; i++) {
        let currCard = deck.pop();
        player.cards.push(currCard);
        updateHand(player, currCard);
    }
    currCard = deck.pop();
    dealer.cards.push(currCard);
    updateHand(dealer, currCard);

    updateScore(player);
    updateScore(dealer);
    checkBust(player);
}

function updateHand(person, card) {
    let hand = document.getElementById(person.name + 'Hand');

    let newCard = document.createElement('div');
    let suit = '&' + card.suit + ';';
    newCard.innerHTML = suit + '<br/>' + card.val + '<br/>' + suit;
    newCard.className = 'card';

    hand.appendChild(newCard);
}

function updateScore(person) {
    document.getElementById(person.name + 'Val').innerHTML = calcHandVal(person);
}

function calcHandVal(person) {
    let currVal = 0;
    let aces = 0;
    for (let i = 0; i < person.cards.length; i++) {
        if (person.cards[i].val == 'J' || person.cards[i].val == 'Q' || person.cards[i].val == 'K') {
            currVal += 10;
        } else if (person.cards[i].val == 'A') {
            currVal += 11;
            aces++;
        } else {
            currVal += parseInt(person.cards[i].val)
        }
    }

    while (currVal > 21 && aces > 0) {
        currVal -= 10;
        aces--;
    }

    return currVal;
}

function hit(person) {
    let currCard = deck.pop();
    person.cards.push(currCard);
    updateHand(person, currCard);
    updateScore(person);
    checkBust(person);
}

function checkBust(person) {
    if (calcHandVal(person) > 21) {
        person.busted = 1;
        finish();
    } else if (calcHandVal(person) == 21) {
        stay(person);
    }
}

function stay(person) {
    if (person.name == 'Player') {
        dealerTurn();
    } else {
        finish();
    }
}

function dealerTurn() {
    while (calcHandVal(dealer) < 17) {
        hit(dealer);
    }
    stay(dealer);
}

function finish() {
    if (player.busted == 1 || (calcHandVal(player) < calcHandVal(dealer) && !dealer.busted)) {
        document.getElementById('results').innerHTML = 'Dealer Wins!'
        // lose chips
    } else if (dealer.busted == 1 || (calcHandVal(player) > calcHandVal(dealer) && !player.busted)) {
        document.getElementById('results').innerHTML = 'Player Wins!'
        chips += (2 * parseInt(currBet));
        // gain chips
    } else {
        document.getElementById('results').innerHTML = 'Push'
        chips += parseInt(currBet);
        // push
    }
    document.getElementById('hit').disabled = true;
    document.getElementById('stay').disabled = true;
    document.getElementById('newHand').disabled = false;
    document.getElementById('betAmnt').style.display = 'inline-block';
    document.getElementById('betLabel').innerHTML = 'Bet Amount: ';
    updateChips();
}

function clearCards() {
    while (player.cards.length > 0) {
        player.cards.pop();
    }
    while (dealer.cards.length > 0) {
        dealer.cards.pop();
    }
    document.getElementById('PlayerHand').innerHTML = '';
    document.getElementById('DealerHand').innerHTML = '';
    document.getElementById('results').innerHTML = '';
    updateScore(player);
    updateScore(dealer);
}

function placeBet() {
    currBet = document.getElementById('betAmnt').value;
    if (!currBet) {
        currBet = 0;
    }
    if (currBet > chips) {
        currBet = chips;
    }
    document.getElementById('betLabel').innerHTML += currBet;

    chips -= parseInt(currBet);
    updateChips();
}

function updateChips() {
    document.getElementById('chips').innerHTML = '$' + chips;
    if (chips < 0) {
        alert('Not feeling very lucky, are you? You ran out of chips, but don\'t worry, i\ll fill you back up.');
        chips = 1000;
    }
    document.getElementById('betAmnt').setAttribute('max', chips);
}

function start() {
    document.getElementById('newHand').disabled = true;
    document.getElementById('betAmnt').style.display = 'none';
    placeBet();
    buildDeck();
    shuffle();
    addPlayerDealer();
    clearCards();
    deal();
    document.getElementById('hit').disabled = false;
    document.getElementById('stay').disabled = false;
}
