import React, { Component } from "react";
import { serializePath } from "../utils/helper";
import { init } from "ramda";
import Vertex from "./Vertex";

const ShapeView = ({ path, onSelect }) => (
  <g
    onClick={ev => {
      ev.preventDefault();
      ev.stopPropagation();
      return onSelect();
    }}
  >
    <path className={"canvas__path"} d={serializePath(path.points)} />
  </g>
);

class ShapeEdit extends Component {
  constructor(props) {
    super(props);
    this.state = {
      path: this.props.path
    };
  }

  componentWillReceiveProps(nextProps, nextContext) {
    this.setState({ path: nextProps.path });
  }

  keyHandler = ev => {
    const { key } = ev;
    switch (key) {
      case "Escape":
      case "Enter": {
        ev.preventDefault();
        return this.endEdit();
      }
    }
  };

  componentDidMount() {
    const { path } = this.state;

    document.addEventListener("keydown", this.keyHandler);

    if (path.id === undefined) {
      document.addEventListener("mousemove", this.editPoint);
      document.addEventListener("click", this.drawPoint);
    }
  }

  componentWillUnmount() {
    document.removeEventListener("keydown", this.keyHandler);
    document.removeEventListener("mousemove", this.editPoint);
    document.removeEventListener("click", this.drawPoint);
  }

  drawPoint = ({ pageX: x, pageY: y }) => {
    const { path } = this.state;
    const { offset } = this.props;

    const point = { x: x - offset.x, y: y - offset.y };

    this.setState({
      path: {
        ...path,
        points: [...path.points, point]
      }
    });
  };

  editPoint = ({ pageX: x, pageY: y }) => {
    const { path } = this.state;
    const { offset } = this.props;

    const point = { x: x - offset.x, y: y - offset.y };

    this.setState({
      path: {
        ...path,
        points: [...init(path.points), point]
      }
    });
  };

  endEdit = () => {
    const { path } = this.state;
    const { id, points } = path;

    this.props.onChange({
      ...path,
      points: id ? points : init(points)
    });
  };

  render() {
    const { path } = this.state;
    return (
      <g>
        <path className={"canvas__path"} d={serializePath(path.points)} />
        {path.points.map((point, index) => (
          <Vertex
            onChange={point => {
              return this.setState({
                path: {
                  ...path,
                  points: [
                    ...path.points.slice(0, index),
                    point,
                    ...path.points.slice(index + 1)
                  ]
                }
              });
            }}
            key={index}
            point={point}
          />
        ))}
      </g>
    );
  }
}

export default ({ edit, ...props }) => {
  return edit ? <ShapeEdit {...props} /> : <ShapeView {...props} />;
};
