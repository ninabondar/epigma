import React from "react"
import { Route } from "react-router-dom"
import Editor from "./Editor/Editor"
import Login from "./Login"
import DocumentList from "./DocumentList/DocumentList"

import "../styles/layout.scss"

const App = () => (
  <>
    <Route exact path={"/"} component={DocumentList} />
    <Route exact path={"/login"} component={Login} />
    <Route path={"/edit/:documentId"} component={Editor} />
  </>
)

export default App
