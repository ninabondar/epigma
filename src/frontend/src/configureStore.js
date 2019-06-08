import { createStore, applyMiddleware } from "redux"
import thunk from "redux-thunk"
import { composeWithDevTools } from "redux-devtools-extension"
import appReducer from "./reducers"

export default () => {
  const middlewares = [thunk]
  return createStore(
    appReducer,
    composeWithDevTools(applyMiddleware(...middlewares))
  )
}
