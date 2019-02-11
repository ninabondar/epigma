import React, { Component } from "react";
import { serializePath } from "../utils/helper";

class Path extends Component {
  render() {
    const { path } = this.props;
    return <path d={serializePath(path)} />;
  }
}

export default Path;
