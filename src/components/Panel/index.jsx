import React from "react";
import PropTypes from "prop-types";

export default function Panel({
  isConnected,
  openConnection,
  closeConnection
}) {
  return (
    <div>
      <button disabled={isConnected} onClick={() => openConnection()}>
        Connect
      </button>
      <button disabled={!isConnected} onClick={() => closeConnection()}>
        Disconnect
      </button>
    </div>
  );
}

Panel.propTypes = {
  isConnected: PropTypes.bool.isRequired,
  openConnection: PropTypes.func.isRequired,
  closeConnection: PropTypes.func.isRequired
};
