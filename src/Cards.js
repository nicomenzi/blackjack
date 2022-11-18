import './App.css';
import './Cards.css';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import {useEffect, useState} from 'react';
import App from "./App";

export default function Cards() {
    const [playerValue, setPlayerValue] = useState(0);
    const [dealerValue, setDealerValue] = useState(0);

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

    function calculate(cards, setValue) {

        let result = 0;
        //console.log("not for" + cards);
        for (const sum of cards) {
            //console.log("for")
            if (sum.value == "JACK" || sum.value == "QUEEN" || sum.value == "KING") {
                result += 10;
                //console.log(result);
            } else if (sum.value == "ACE" && result <= 10) {
                result += 11;
                //console.log(result);
            } else if (sum.value == "ACE" && result > 10) {
                result += 1;
                //console.log(result);
            } else {
                result += parseInt(sum.value);
                console.log(result);
            }
        }

        console.log(result)

        setValue(result);
    }

    function clearCards() {
        setPlayercard([]);
        setDealercard([]);
        //programm neu laden
    }

    useEffect(() => {
        getDeck()
    }, []);               //Ruft beim starten der Seite die function getDeck () auf

    useEffect(() => {
        if (deckID != undefined) {
            getCard(setPlayercard, playercard);
            getCard(setPlayercard, playercard);
            getCard(setDealercard, dealercard);
        }
    }, [deckID]);

    useEffect(() => {
        console.log(playercard)
        if (playercard != undefined) {
            calculate(playercard, setPlayerValue);
            console.log(playerValue)
            if (playerValue > 21) {
                alert("You lost!");
            }
        }
    }, [playercard]);     //wird erst gemacht, wenn playercard gemacht/abgefüllt wurde

    useEffect(() => {
        console.log(dealercard)
        if (dealercard != undefined) {
            calculate(dealercard, setDealerValue);
        }
    }, [dealercard]);     //wird erst gemacht, wenn playercard gemacht/abgefüllt wurde

    return (<div className="App">
            <header className="App-header">
                {/*{card && <img src={card.image}></img>}      dies hat nur funktioniert als card oben noch kein Array war*/}
                <Grid container rowSpacing={3} alignItems="flex-start" justifyContent="center">
                    <Grid item>
                        <Button variant="contained" onClick={(e) => getCard(setPlayercard, playercard)}>Player</Button>
                    </Grid>
                    <Grid container spacing={5} alignItems="center" justifyContent="center">
                        {playercard.map((c) =>
                            <Grid item>
                                <img src={c.image}></img>
                                <p>{c.value}</p>
                            </Grid>)}
                    </Grid>
                    <Grid>
                        {playerValue}
                    </Grid>

                    <Grid item>
                        <Button variant="contained" onClick={(e) => App.finish()}>Dealer</Button>
                    </Grid>
                    <Grid container spacing={5} alignItems="center" justifyContent="center">
                        {dealercard.map((c) => <Grid item>
                            <img src={c.image}></img>
                            <p>{c.value}</p>
                        </Grid>)}
                    </Grid>
                    <Grid>
                        {dealerValue}
                    </Grid>

                    <Grid item>
                        <Button variant="contained" onClick={clearCards}>Restart</Button>
                    </Grid>

                </Grid>
            </header>
        </div>

    )
}