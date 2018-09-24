import { connect } from "react-redux";
import Panel from "../components/Panel";

const mapStateToProps = state => {
  return {
    isConnected: state.isConnected
  };
};

const mapDispatchToProps = dispatch => ({
  openConnection: () => dispatch({ type: "OPEN_SOCKET" }),
  closeConnection: () => dispatch({ type: "CLOSE_SOCKET" })
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Panel);
