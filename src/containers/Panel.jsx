import { connect } from "react-redux";
import Panel from "../components/Panel";
import { openSocketConnection, closeSocketConnection } from "../redux/actions";

const mapStateToProps = state => {
  return {
    isConnected: state.isConnected
  };
};

const mapDispatchToProps = dispatch => ({
  openConnection: () => dispatch(openSocketConnection()),
  closeConnection: () => dispatch(closeSocketConnection())
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Panel);
