// Sync actions
import xstream from "xstream";
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

export const createSocket$ = () => {

  return xstream.create({
    start (listener) {
      const tickers = ["btcusd", "ltcusd", "ltcbtc", "ethusd"];
      this.socket = new WebSocket("wss://api.bitfinex.com/ws");
      this.socket.onerror = (e) => listener.error(e);
      this.socket.onopen = () => tickers.forEach(ticker => {
        this.socket.send(JSON.stringify({
          event: "subscribe",
          channel: "ticker",
          pair: ticker
        }));
      });
      this.socket.onclose = (e) => {
        listener.complete();
      };
      this.socket.onmessage = (message) => {
        const data = JSON.parse(message.data);
        console.log(data.event);
        switch (data.event) {
          case "info":
            if (data.platform && data.platform.status === 1) {
              console.log(`Info from socket API: ${JSON.stringify(data)}`);
              return listener.next(updateConnectionStatus(true));
            }
          case "subscribed":
            if (data.channel === "ticker") {
              return listener.next(subscribedToTicker(data));
            } else if (data.channel === "trades") {
              return listener.next(subscribedToTrade(data));
            }
          case "error":
            console.error(`Error from socket API: ${data.msg}`);
            return {
              type: "SOCKET_ERROR",
              payload: data
            };
          default:
            console.log(data);
            if (data[1] !== "hb") {
              return listener.next(updateChannel(data));
            }
        }
      };
    },
    stop () {
      console.log("closing");
      this.socket.close();
      this.socket = null;
    },
    socket: null
  }); 

};

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
