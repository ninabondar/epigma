import { createStore, applyMiddleware } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import appReducer from "./reducers";

export default () => {
  return createStore(
    appReducer,

    composeWithDevTools(applyMiddleware())
  );
};
