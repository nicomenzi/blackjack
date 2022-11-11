import './App.css';
import './Cards.css';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import {useEffect, useState} from 'react';

export default function Cards() {
    //const [deck, setDeck] = useState([]);
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

    function calculate(cards) {
        let value;

        for (const sum of cards) {
            if (sum.value == "JACK" || sum.value == "QUEEN" || sum.value == "KING") {
                value = value + 10;
            } else if (sum.value == "ACE" && value <= 10) {
                value = value + 11;
            } else if (sum.value == "ACE" && value > 10) {
                value = value + 1;
            } else {
                value = value + sum.value;
            }
        }

        return value;

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
    }, [playercard]);     //wird erst gemacht, wenn playercard gemacht/abgefüllt wurde

    useEffect(() => {
        console.log(dealercard)
    }, [dealercard]);     //wird erst gemacht, wenn playercard gemacht/abgefüllt wurde

    return (<div className="App">
            <header className="App-header">
                {/*{card && <img src={card.image}></img>}      dies hat nur funktioniert als card oben noch kein Array war*/}
                <Grid container rowSpacing={3} alignItems="flex-start" justifyContent="center">
                    <Grid item>
                        <Button variant="contained" onClick={(e) => getCard(setPlayercard, playercard)}>Player</Button>
                    </Grid>
                    <Grid container spacing={5} alignItems="center" justifyContent="center">
                        {playercard.map((c) => <Grid item>
                            <img src={c.image}></img>
                            <p>{c.value}</p>
                        </Grid>)}
                    </Grid>

                    <Grid item>
                        <Button variant="contained" onClick={(e) => getCard(setDealercard, dealercard)}>Dealer</Button>
                    </Grid>
                    <Grid container spacing={5} alignItems="center" justifyContent="center">
                        {dealercard.map((c) => <Grid item>
                            <img src={c.image}></img>
                            <p>{c.value}</p>
                        </Grid>)}
                    </Grid>

                    <Grid item>
                        <Button variant="contained" onClick={clearCards}>Restart</Button>
                    </Grid>

                </Grid>
            </header>
        </div>

    )
}