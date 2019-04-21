import React from "react"
import { BrowserRouter as Router} from "react-router-dom";
import ReactDOM from "react-dom"
import { Provider } from "react-redux"
import initStore from "./configureStore"
import App from "./components/App"

ReactDOM.render(
  <Provider store={initStore()}>
    <Router>
      <App />
    </Router>
  </Provider>,
  document.querySelector("#root")
)
