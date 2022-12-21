import './App.css';
import './Cards.css';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import {useEffect, useState} from 'react';
import { setTimeout } from "timers/promises";

export default function Cards() {
    const [playerValue, setPlayerValue] = useState(0);
    const [dealerValue, setDealerValue] = useState(0);

    const [deckID, setDeckID] = useState();
    const [dealercard, setDealercard] = useState([])
    const [playercard, setPlayercard] = useState([])


    //Ruft beim starten der Seite die function getDeck () auf
    useEffect(() => {
        fetch('https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1')
            .then(response => response.json())
            .then(data => setDeckID(data.deck_id))
            .catch((error) => {
                console.error('Error:', error);
            });

        console.log(deckID);
    }, []);

    const getCard = (setCard, currentCards) => {
        fetch('https://deckofcardsapi.com/api/deck/' + deckID + '/draw/?count=1')
            .then(response => response.json())
            .then(data => setCard(currentCards => [...currentCards, data.cards[0]]))
            // .then(data => setCard(data.cards[0]))            //so wird die Karte jeweils überschrieben
            .catch((error) => {
                console.error('Error:', error);
            });

    }

    const calculate = (cards, isPlayer) => {
        const VALUE_10 = ['JACK', 'QUEEN', 'KING']

        let result = 0;
        //console.log("not for" + cards);
        for (const sum of cards) {
            const sumValue = sum.value;
            //console.log("for")
            if (VALUE_10.includes(sumValue)) {
                result += 10;
                //console.log(result);
            } else if (sumValue == "ACE" && result <= 10) {
                result += 11;
                //console.log(result);
            } else if (sumValue == "ACE" && result > 10) {
                result += 1;
                //console.log(result);
            } else {
                result += parseInt(sumValue);
                console.log(result);
            }
        }

        console.log(result)
        isPlayer && setPlayerValue(result) || setDealerValue(result);
    }

    const finish = (player, dealer) => {

        //geht so nicht, da Value zu langsam geupdated wird
        /*while (dealer < 17) {
            getCard(setDealercard, dealercard);
        }*/

        if (player > dealer) {
            alert("You won!");
        } else if (player < dealer) {
            alert("You lost!");
        } else {
            alert("Draw!");
        }
    }

    const clearCards = () => {
        setPlayercard([]);
        setDealercard([]);
        window.location.reload(false);
    }

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
            calculate(playercard, true);
            console.log(playerValue)
            const valueLost = playerValue > 21
            if (valueLost) {
                //geht so nocht nicht ganz, da Value zu langsam geupdated wird
                alert("You lost")
                window.location.reload(false);
            }
        }
    }, [playercard]);     //wird erst gemacht, wenn playercard gemacht/abgefüllt wurde

    useEffect(() => {
        console.log(dealercard)
        dealercard != undefined && calculate(dealercard, false)
    }, [dealercard]);     //wird erst gemacht, wenn playercard gemacht/abgefüllt wurde


    return (<div className="App">
            <header className="App-header">
                {/*{card && <img src={card.image}></img>}      dies hat nur funktioniert als card oben noch kein Array war*/}
                <Grid container rowSpacing={3} alignItems="flex-start" justifyContent="center">
                    <Grid item>
                        <Button variant="contained" onClick={(e) => getCard(setPlayercard, playercard)}>hit</Button>
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
                        <Button variant="contained"
                                onClick={(e) => finish(playerValue, dealerValue)}>stand</Button>
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