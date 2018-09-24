import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { createStore, applyMiddleware, compose } from "redux";
import reduxThunk from "redux-thunk";
import xstream from "xstream";
import { createMiddleware } from "xstream-redux-observable";

import App from "./App";
import registerServiceWorker from "./registerServiceWorker";
import reducers from "./redux/reducers";
import { createSocket$ } from "./redux/actions";
import "./index.css";

const mw = createMiddleware((actions$) => {

  return actions$
    .filter(action => action.type === "OPEN_SOCKET")
    .map(() => {
      const message$ = createSocket$().endWhen(actions$.filter(action => action.type === "CLOSE_SOCKET"))
      const closed$ = message$.last().mapTo({ type: "SOCKET_CLOSED" });

      return xstream.merge(message$, closed$)
    })
    .flatten()
    .replaceError((e) => {
      return xstream.empty();
    });

});

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const store = createStore(
  reducers,
  composeEnhancers(applyMiddleware(reduxThunk, mw))
);
// store.dispatch(openSocketConnection());

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById("root")
);
registerServiceWorker();
