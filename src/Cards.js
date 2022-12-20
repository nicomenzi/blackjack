import './App.css';
import './Cards.css';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import {useEffect, useState} from 'react';

export default function Cards() {
    const [playerValue, setPlayerValue] = useState(0);
    const [dealerValue, setDealerValue] = useState(0);

    const [deckID, setDeckID] = useState();
    const [dealercard, setDealercard] = useState([])
    const [playercard, setPlayercard] = useState([])

    useEffect(() => {
        fetch('https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1')
            .then(response => response.json())
            .then(data => setDeckID(data.deck_id))
            .catch((error) => {
                console.error('Error:', error);
            });

        console.log(deckID);
    }, []);

    const getCard = (setCard, currentCards, isPlayer) => {
        fetch('https://deckofcardsapi.com/api/deck/' + deckID + '/draw/?count=1')
            .then(response => response.json())
            .then(data => setCard(currentCards => [...currentCards, data.cards[0]]))
            // .then(data => setCard(data.cards[0]))            //so wird die Karte jeweils überschrieben
            .catch((error) => {
                console.error('Error:', error);
            });
        calculate(currentCards, isPlayer);
    }

    const clearCards = () => {
        setPlayercard([]);
        setDealercard([]);
        window.location.reload(false);
    }

    const calculate = async (cards, isPlayer) => {
        const VALUE_10 = ['JACK', 'QUEEN', 'KING']

        let result = 0;
        //console.log("not for" + cards);
        for (const sum of cards) {
            const sumValue = sum.value;
            if (VALUE_10.includes(sumValue)) {
                result += 10;
            } else if (sumValue === "ACE" && result <= 10) {
                result += 11;
            } else if (sumValue === "ACE" && result > 10) {
                result += 1;
            } else {
                result += parseInt(sumValue);
            }
        }

        isPlayer ? setPlayerValue(result) : setDealerValue(result);
        await delay(500);

    }

    const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

    const finish = async (player) => {

        while (dealerValue < 17) {
            getCard(setDealercard, dealercard, false);
            await delay(250)
            console.log(dealerValue)
        }

        if (player > dealerValue) {
            alert("You won!");
            window.location.reload(false);
        } else if (player < dealerValue) {
            alert("You lost!");
            window.location.reload(false);
        } else {
            alert("Draw!");
            window.location.reload(false);
        }
    }

    useEffect(() => {
        if (deckID !== undefined) {
            getCard(setPlayercard, playercard);
            getCard(setPlayercard, playercard);
            getCard(setDealercard, dealercard);
        }
    }, [deckID]);

    useEffect(() => {
        if (playercard !== undefined) {
            calculate(playercard, true);
        }
    }, [playercard]);     //wird erst gemacht, wenn playercard gemacht/abgefüllt wurde

    useEffect(() => {
        if (dealercard !== undefined) {
            calculate(dealercard, false);
        }
    }, [dealercard]);

    useEffect(() => {
        console.log(playerValue);
        const valueLost = playerValue > 21;
        if (valueLost) {
            //geht so nocht nicht ganz, da Value zu langsam geupdated wird
            setTimeout(() => {
                alert("You lost")
                window.location.reload(false);
            }, 100);
        }
    }, [playerValue]);

//Ruft beim starten der Seite die function getDeck () auf
    return (<div className="App">

        <header className="App-header">
            <container rowSpacing={3} alignItems="flex-start" justifyContent="center">

                <Grid item>
                    <Button variant="contained" onClick={(e) => getCard(setPlayercard, playercard)}>hit</Button>
                </Grid>

                <Grid container spacing={5} alignItems="center" justifyContent="center">
                    {playercard.map((c) => <Grid item>
                        <img src={c.image} alt="PlayerCard"></img>
                        <p>{c.value}</p>
                    </Grid>)}
                </Grid>

                <Grid>
                    {playerValue}
                </Grid>

                <Grid item>
                    <Button variant="contained"
                            onClick={(e) => finish(playerValue)}>stand</Button>
                </Grid>
                <Grid container spacing={5} alignItems="center" justifyContent="center">
                    {dealercard.map((c) => <Grid item>
                        <img src={c.image} alt="DealerCard"></img>
                        <p>{c.value}</p>
                    </Grid>)}
                </Grid>
                <Grid>
                    {dealerValue}
                </Grid>

                <Grid item>
                    <Button variant="contained" onClick={clearCards}>Restart</Button>
                </Grid>
            </container>

        </header>

    </div>)
}