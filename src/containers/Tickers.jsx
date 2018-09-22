import { connect } from "react-redux";
import Tickers from "../components/Tickers";
import { updateCurrentTicker } from "../redux/actions";

const mapStateToProps = state => {
  return {
    tickerList: state.tickers.map(ticker => {
      const tickerChannel = state.channels.find(channel => {
        return channel[0] === ticker.channelId;
      });
      return {
        pair: ticker.pair,
        lastPrice: tickerChannel[7],
        change: tickerChannel[6],
        volume: tickerChannel[0]
      };
    })
  };
};

const mapDispatchToProps = dispatch => ({
  onClick: ticker => dispatch(updateCurrentTicker(ticker))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Tickers);
