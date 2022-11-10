import './App.css';
import {useEffect, useState} from 'react';

export default function Cards() {
    const [deck, setDeck] = useState([]);
    const [deckID, setDeckID] = useState();
    const [dealercard, setDealercard] = useState([])
    const [playercard, setPlayercard] = useState([])

    function getDeck() {
        fetch('https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1')
            .then(response => response.json())
            .then(data => setDeckID(data.deck_id))
            .catch((error) => {
                console.error('Error:', error);
            });
        console.log(deckID);
    }


    function getCard(setCard, currentCards) {
        fetch('https://deckofcardsapi.com/api/deck/' + deckID + '/draw/?count=1')
            .then(response => response.json())
            .then(data => setCard(currentCards => [...currentCards, data.cards[0]]))
            // .then(data => setCard(data.cards[0]))            //so wird die Karte jeweils überschrieben
            .catch((error) => {
                console.error('Error:', error);
            });
    }

    function clearCards() {
        setPlayercard([]);
        setDealercard([]);
    }

    useEffect(() => {
        getDeck()
    }, []);               //Ruft beim starten der Seite die function getDeck () auf
    useEffect(() => {
        console.log(playercard)
        console.log(dealercard)
    }, [playercard]);

    return (<div className="App">
            <header className="App-header">
                {/*{card && <img src={card.image}></img>}      dies hat nur funktioniert als card oben noch kein Array war*/}
                <button onClick={(e) => getCard(setPlayercard, playercard)}>Player</button>
                {playercard.map((c) => <img src={c.image}></img>)}

                <button onClick={(e) => getCard(setDealercard, dealercard)}>Dealer</button>
                {dealercard.map((c) => <img src={c.image}></img>)}

                <button onClick={clearCards}>clear Cards</button>
            </header>
        </div>

    )
}

/*
export default function Cards() {

    /!*const [deck, setDeck] = useState("");
    const [cards, setCard] = useState([])

    const btHandler = () =>
        fetch('https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1')*!/

    return (
        <div className="App">
            <header className="App-header">

                <p>Blackjack</p>

                {/!*<div>
                    <button>draw next card</button>
                </div>*!/}

            </header>
        </div>
    );
}*/