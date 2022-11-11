import logo from './logo.svg';
import './App.css';
import Cards from "./Cards";

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

function finish(){

  let playercard = Cards.playercard;
  let dealercard = Cards.dealercard;

  while (Cards.calculate(dealercard) < 17) {
    Cards.getCard(Cards.setDealercard, dealercard);
  }
  let dealer = Cards.calculate(dealercard);
  let player = Cards.calculate(playercard);

    if (player > 21) {
      alert("You lost!");
    }
    else if (dealer > 21) {
      alert("You won!");
    }
    else if (player > dealer) {
      alert("You won!");
    }
    else if (player < dealer) {
      alert("You lost!");
    }
    else {
      alert("Draw!");
    }

}

export default App;
