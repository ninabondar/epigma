import React, { Component } from "react";
import { serializePath } from "../utils/helper";
import { init } from "ramda";

const PathView = ({ path, onSelect }) => (
  <g
    onClick={ev => {
      ev.preventDefault();
      ev.stopPropagation();
      return onSelect();
    }}
  >
    <path className={"canvas__path"} d={serializePath(path)} />
  </g>
);

class PathEdit extends Component {
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
    document.addEventListener("keydown", this.keyHandler);
    document.addEventListener("mousemove", this.editPoint);
    document.addEventListener("click", this.drawPoint);
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
      path: path.length === 0 ? [point, point] : [...path, point]
    });
  };

  editPoint = ({ pageX: x, pageY: y }) => {
    const { path } = this.state;
    const { offset } = this.props;

    const point = { x: x - offset.x, y: y - offset.y };

    this.setState({
      path: [...init(path), point]
    });
  };

  endEdit = () => {
    const { path } = this.state;
    this.props.onChange(init(path));
  };

  render() {
    const { path } = this.state;
    return (
      <g>
        <path className={"canvas__path"} d={serializePath(path)} />
        {path.map(({ x, y }, index) => (
          <circle key={index} cx={x} cy={y} r={4} />
        ))}
      </g>
    );
  }
}

export default ({ edit, ...props }) => {
  return edit ? <PathEdit {...props} /> : <PathView {...props} />;
};
