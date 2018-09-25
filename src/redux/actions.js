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

export const createSocket$ = (action$) => {

  return xstream.create({
    start (listener) {

      const ws = new WebSocket("wss://api.bitfinex.com/ws");
      this.ws = ws;
      ws.onopen = () => {

        listener.next({
          type: CONECTION_STATUS_UPDATED,
          payload: true
        });

      };

      ws.onerror = (e) => {

        listener.next({
          type: "SOCKET_ERROR",
          payload: e
        });

      };

      ws.onmessage = (message) => {
        try {
          const { event, ...payload } = JSON.parse(message.data);
          listener.next({
            type: "SOCKET_RECEIVED_MESSAGE",
            data: {
              event,
              payload
            }
          });
        } catch (error) {
          listener.next({
            type: "SOCKET_RECEIVED_MALFORMED_MESSAGE",
            data: {
              message: message.data,
              error
            }
          });
        }

      };

      this.actionsListener = {
        next (action) {
          switch (action.type) {
            case "SOCKET_SEND_MESSAGE": {
              return ws.send(JSON.stringify(action.data));
            }
          }
        },
        error (error) {
          listener.error(error);
        },
        complete () {
          listener.complete();
        }
      };

      action$.addListener(this.actionsListener);
    },
    stop () {
      this.ws.close();
      action$.removeListener(this.actionsListener);
    },
    actionsListener: null,
    ws: null
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
