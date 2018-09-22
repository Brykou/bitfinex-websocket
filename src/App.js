import React from "react";
import Panel from "./containers/Panel";
import Tickers from "./containers/Tickers";
import Trades from "./containers/Trades";
import "./App.css";

class App extends React.Component {
  render() {
    return (
      <div className="App">
        <Panel />
        <Tickers />
        <Trades />
      </div>
    );
  }
}

export default App;
