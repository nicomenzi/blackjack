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

  let player = Cards.playerValue;
  let dealer = Cards.dealerValue;
    if (player > dealer) {
      return("You won!");
    }
    else if (player < dealer) {
      return("You lost!");
    }
    else {
      return("Draw!");
    }

}

export default App;
