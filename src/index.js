import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import initStore from "./configureStore";
import App from "./components/App";

ReactDOM.render(
  <Provider store={initStore()}>
    <App />
  </Provider>,
  document.querySelector("#root")
);
