import {
  CONECTION_STATUS_UPDATED,
  TICKER_SUBSCRIPTION,
  CHANNEL_UPDATE,
  TRADE_SUBSCRIPTION
} from "./actions";

const initialState = {
  isConnected: false,
  tickers: [],
  trade: {},
  channels: []
};

export default (state = initialState, action) => {
  switch (action.type) {
    case CONECTION_STATUS_UPDATED: {
      return Object.assign({}, initialState, {
        isConnected: action.payload
      });
    }
    case TICKER_SUBSCRIPTION:
      return Object.assign({}, state, {
        tickers: state.tickers.concat(action.payload),
        channels: state.channels.concat([[action.payload.channelId]])
      });
    case TRADE_SUBSCRIPTION:
      return Object.assign({}, state, {
        trade: Object.assign({}, state.trade, action.payload),
        channels: state.channels.concat([[action.payload.channelId]])
      });
    case CHANNEL_UPDATE:
      return Object.assign({}, state, {
        channels: state.channels.map(channel => {
          return channel[0] === action.payload[0] ? action.payload : channel;
        })
      });
    case "SOCKET_CLOSED":{
      return {
        ...state,
        isConnected: false
      };
    }
    default:
      return state;
  }
};
