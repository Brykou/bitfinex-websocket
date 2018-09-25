import React from "react";
import { connect } from "react-redux";
import "./App.css";

const Pair = connect(null, {
  onSubmit (pair) {
    return {
      type: "SOCKET_SEND_MESSAGE",
      data: {
        event: "subscribe",
        channel: "ticker",
        pair
      }
    };
  }
})(function Pair ({ onSubmit }) {

  return (
    <form onSubmit={e => {
      e.preventDefault();
      const pair = e.target.elements.pair.value.toUpperCase();
      onSubmit(pair);
    }}>
      <input name="pair" type="text" placeholder="Enter a valid pair here"/> 
      <input type="submit" value="Get this pair"/>
    </form>
  );

})

class App extends React.Component {
  render() {

    return (
      <div className="App">
        <Pair />
      </div>
    );
  }
}

export default App;
