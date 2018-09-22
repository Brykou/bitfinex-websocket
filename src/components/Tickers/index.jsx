import React from "react";
import PropTypes from "prop-types";
import "./Tickers.css";

export default class Tickers extends React.Component {
  static propTypes = {
    tickerList: PropTypes.arrayOf(
      PropTypes.shape({
        pair: PropTypes.string,
        lastPrice: PropTypes.number,
        change: PropTypes.number,
        volume: PropTypes.number
      })
    ).isRequired,
    onClick: PropTypes.func.isRequired
  };
  render() {
    const { tickerList, onClick } = this.props;

    if (tickerList.length === 0) {
      return null;
    }

    return (
      <div className="tickersContainer">
        <div className="header">
          <div>Name</div>
          <div>Last</div>
          <div>24HR</div>
          <div>VOL USD</div>
        </div>
        <ul className="body">
          {tickerList.map(ticker => (
            <li key={ticker.pair} onClick={() => onClick(ticker.pair)}>
              <div>{ticker.pair}</div>
              <div>{ticker.lastPrice}</div>
              <div>{ticker.change}</div>
              <div>{ticker.volume}</div>
            </li>
          ))}
        </ul>
      </div>
    );
  }
}
