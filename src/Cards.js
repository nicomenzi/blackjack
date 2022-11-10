import './App.css';
import {useEffect, useState} from 'react';

export default function Cards() {
    const [deck, setDeck] = useState([]);
    const [deckID, setDeckID] = useState();
    const [card, setCard] = useState([]);

    function getDeck() {
        fetch('https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1')
            .then(response => response.json())
            .then(data => setDeckID(data.deck_id))
            .catch((error) => {
                console.error('Error:', error);
            });
        console.log(deckID);
    }


    function getCard() {
        fetch('https://deckofcardsapi.com/api/deck/' + deckID + '/draw/?count=1')
            .then(response => response.json())
            .then(data => setCard(card => [...card, data.cards[0]]))
            // .then(data => setCard(data.cards[0]))            //so wird die Karte jeweils überschrieben
            .catch((error) => {
                console.error('Error:', error);
            });
    }

    function clearCards() {
        setCard([]);
    }

    useEffect(() => {
        getDeck()
    }, []);               //Ruft beim starten der Seite die function getDeck () auf
    useEffect(() => {
        console.log(card)
    }, [card]);

    return (<div className="App">
            <header className="App-header">
                <button onClick={getCard}>get Card</button>
                {card.map((c) => <img src={c.image}></img>)}
                {/*{card && <img src={card.image}></img>}      dies hat nur funktioniert als card oben noch kein Array war*/}
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