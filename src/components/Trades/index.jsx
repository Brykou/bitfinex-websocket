import React from "react";
import PropTypes from "prop-types";
import "./Trades.css";

export default class Trades extends React.Component {
  static propTypes = {
    tradeList: PropTypes.arrayOf(
      PropTypes.shape({
        time: PropTypes.string.isRequired,
        price: PropTypes.number.isRequired,
        amount: PropTypes.number.isRequired
      })
    )
  };
  render() {
    const { tradeList } = this.props;
    if (tradeList.length === 0) {
      return null;
    }
    return <div className="tradesContainer">{"Trades"}</div>;
  }
}
