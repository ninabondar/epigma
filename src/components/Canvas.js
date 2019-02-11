import React, { Component } from "react";
import { init } from "ramda";
import "../styles/canvas.scss";
import { serializePath } from "../utils/helper";
import Path from "./Path";

class Canvas extends Component {
  constructor(props) {
    super(props);
    this.state = {
      mode: "view",
      objects: []
    };
  }

  componentDidMount() {
    const { x, y } = this.refs.svgRoot.getBoundingClientRect();

    document.addEventListener("keydown", ev => {
      const { key } = ev;
      switch (key) {
        case "Escape":
        case "Enter": {
          ev.preventDefault();
          return this.endEdit();
        }
      }
    });

    this.setState({
      offset: { x, y }
    });
  }

  drawPoint = ({ pageX: x, pageY: y }) => {
    const { objects, offset } = this.state;
    const point = { x: x - offset.x, y: y - offset.y };
    this.setState({
      objects: objects.length === 0 ? [point, point] : [...objects, point]
    });
  };

  editPoint = ({ pageX: x, pageY: y }) => {
    const { objects, offset } = this.state;
    const point = { x: x - offset.x, y: y - offset.y };
    this.setState({
      objects: [...init(objects), point]
    });
  };

  endEdit = () => {
    const { objects } = this.state;
    this.setState({ mode: "view", objects: init(objects) });
  };

  startEdit = ({ pageX: x, pageY: y }) => {
    const { offset } = this.state;
    const point = { x: x - offset.x, y: y - offset.y };

    this.setState({
      mode: "edit",
      objects: [point, point]
    });
  };

  render() {
    const { objects, mode } = this.state;
    return (
      <>
        <svg
          ref={"svgRoot"}
          className="canvas"
          onMouseMove={
            mode === "edit" && objects.length > 1 ? this.editPoint : null
          }
          onClick={mode === "edit" ? this.drawPoint : this.startEdit}
        >
          {objects.length >= 2 ? (
            <path className={"canvas__path"} d={serializePath(objects)} />
          ) : (
            "Click to start drawing."
          )}
        </svg>
      </>
    );
  }
}

export default Canvas;
