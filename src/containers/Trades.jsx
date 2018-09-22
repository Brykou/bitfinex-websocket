import { connect } from "react-redux";
import Trades from "../components/Trades";

const mapStateToProps = state => {
  return {
    tradeList: []
  };
};

export default connect(
  mapStateToProps,
  null
)(Trades);
