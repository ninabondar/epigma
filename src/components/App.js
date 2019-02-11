import React from "react";
import Canvas from "./Canvas";
import "../styles/layout.scss";
class App extends React.Component {
  render() {
    return (
      <>
        <h1>Hello. This is Epigma. Super-puper drawing tool.</h1>
        <Canvas />
      </>
    );
  }
}

export default App;
