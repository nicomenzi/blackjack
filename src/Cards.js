import './Cards.css';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import {useEffect, useState} from 'react';

export default function Cards() {
    const [playerValue, setPlayerValue] = useState(0);
    const [dealerValue, setDealerValue] = useState(0);
    const [winValue, setWinValue] = useState(0);
    const [lostValue, setLostValue] = useState(0);
    const [drawValue, setDrawValue] = useState(0);

    const [deckID, setDeckID] = useState();
    const [dealercard, setDealercard] = useState([])
    const [playercard, setPlayercard] = useState([])

    useEffect(() => {
        getDeck();
    }, []);

    const getDeck = () => {
        fetch('https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1')
            .then(response => response.json())
            .then(data => setDeckID(data.deck_id))
            .catch((error) => {
                console.error('Error:', error);
            });
    }

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

    const clear = () => {
        setPlayercard([]);
        setDealercard([]);
        getDeck();
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

        /*while (dealerValue < 17) {
            getCard(setDealercard, dealercard, false);
            await delay(250)
            console.log(dealerValue)
        }*/

        if (player > dealerValue) {
            alert("You won!");
            setWinValue(winValue + 1);
            clear();
            //neue DeckId
        } else if (player < dealerValue) {
            alert("You lost!");
            setLostValue(lostValue + 1);
            clear();
            //neue DeckId
        } else {
            alert("Draw!");
            setDrawValue(drawValue + 1);
            clear();
            //neue DeckId
        }
    }

    const restart = () => {
        window.location.reload(false);
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
                alert("You lost");
                setLostValue(lostValue + 1);
                clear();
            }, 100);
        }
    }, [playerValue]);

//Ruft beim starten der Seite die function getDeck () auf
    return (<Grid className="maincon" container direction="row" justifyContent="center" alignItems="center">
            <Grid item xs={12}>
                <h1 className="title" id="title">Blackjack</h1>
            </Grid>

            <Grid className="buttoncon"
                  container
                  direction="row"
                  justifyContent="center"
                  alignItems="center">
                <Grid xs={5}>
                    <Button variant="contained" onClick={(e) => getCard(setPlayercard, playercard)}>hit</Button>
                </Grid>

                <Grid xs={2}>
                    <Button variant="contained" onClick={restart}>Restart</Button>
                </Grid>

                <Grid xs={5}>
                    <Button variant="contained"
                            onClick={(e) => finish(playerValue)}>stand</Button>
                </Grid>
            </Grid>

            <Grid className="cardcon"
                  container
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center">
                <Grid className="player" item xs={5}>
                    <Grid container
                          direction="row"
                          justifyContent="center"
                          alignItems="center">
                        {playercard.map((c) => <Grid item>
                            <img src={c.image} alt="PlayerCard"></img>
                            <p>{c.value}</p>
                        </Grid>)}
                    </Grid>

                    Score: {playerValue}
                </Grid>

                <Grid item xs={2}></Grid>

                <Grid className="dealer" item xs={5}>
                    <Grid container
                          direction="row"
                          justifyContent="center"
                          alignItems="center">
                        {dealercard.map((c) => <Grid item>
                            <img src={c.image} alt="DealerCard"></img>
                            <p>{c.value}</p>
                        </Grid>)}
                    </Grid>

                    Score: {dealerValue}
                </Grid>
            </Grid>


            <Grid className="gamescon"
                  container
                  direction="row"
                  justifyContent="center"
                  alignItems="center">
                <Grid xs={5}>
                    won games {winValue}
                </Grid>

                <Grid xs={2}>
                    draw games {drawValue}
                </Grid>

                <Grid xs={5}>
                    lost games {lostValue}
                </Grid>
            </Grid>

        </Grid>)
}