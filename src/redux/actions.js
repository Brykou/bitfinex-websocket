// Sync actions
import axios from "axios";

let socket = null;

export const CONECTION_STATUS_UPDATED = "connection_status";
export const TICKER_SUBSCRIPTION = "ticker_subscription";
export const TRADE_SUBSCRIPTION = "trade_subscription";
export const ORDER_BOOK_SUBSCRIPTION = "ob_subscription";
export const CHANNEL_UPDATE = "channel_update";
export const CURRENT_TICKER_UPDATE = "current_ticker_update";

export function updateConnectionStatus(data) {
  return {
    type: CONECTION_STATUS_UPDATED,
    payload: data
  };
}

export function subscribedToTicker(data) {
  return {
    type: TICKER_SUBSCRIPTION,
    payload: {
      channelId: data.chanId,
      pair: data.pair
    }
  };
}

export function subscribedToTrade(data) {
  return {
    type: TRADE_SUBSCRIPTION,
    payload: {
      channelId: data.chanId,
      pair: data.pair
    }
  };
}

export function updateChannel(data) {
  return {
    type: CHANNEL_UPDATE,
    payload: data
  };
}

//Async

export function openSocketConnection() {
  return function(dispatch) {
    socket = new WebSocket("wss://api.bitfinex.com/ws");

    socket.onerror = function(event) {
      console.error("WebSocket error observed:", event);
    };

    socket.onopen = function() {
      // return axios.get("https://api.bitfinex.com/v1/symbols");
      return new Promise(resolve => {
        resolve(["btcusd", "ltcusd", "ltcbtc", "ethusd"]);
      }).then(response => {
        response.forEach(ticker => {
          socket.send(
            JSON.stringify({
              event: "subscribe",
              channel: "ticker",
              pair: ticker
            })
          );
        });
      });
    };

    socket.onclose = function(event) {
      dispatch(updateConnectionStatus(false));
    };

    socket.onmessage = function(message) {
      const data = JSON.parse(message.data);
      switch (data.event) {
        case "info":
          if (data.platform && data.platform.status === 1) {
            dispatch(updateConnectionStatus(true));
          }
          console.log(`Info from socket API: ${JSON.stringify(data)}`);
          break;
        case "subscribed":
          if (data.channel === "ticker") {
            dispatch(subscribedToTicker(data));
          } else if (data.channel === "trades") {
            dispatch(subscribedToTrade(data));
          }
          break;
        case "error":
          console.error(`Error from socket API: ${data.msg}`);
          break;
        default:
          console.log(data);
          if (data[1] !== "hb") {
            dispatch(updateChannel(data));
          }
          break;
      }
    };
  };
}

export function closeSocketConnection() {
  return function() {
    socket.close();
  };
}

export function updateCurrentTicker(data) {
  return function() {
    socket.send(
      JSON.stringify({
        event: "subscribe",
        channel: "trades",
        pair: data
      })
    );
    socket.send(
      JSON.stringify({
        event: "subscribe",
        channel: "book",
        pair: data
      })
    );
  };
}
