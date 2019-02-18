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
  static defaultProps = {
    onChange: () => {}
  };

  constructor(props) {
    super(props);
    this.state = {
      selectedVertex: null,
      path: this.props.path
    };
  }

  componentWillReceiveProps(nextProps, nextContext) {
    this.setState({ path: nextProps.path });
  }

  keyHandler = ev => {
    const { key } = ev;

    switch (key) {
      case "Backspace":
      case "Delete": {
        const { path, selectedVertex: index } = this.state;

        if (index !== null) {
          //TODO: Improve algorithm

          //TODO: if index === 0 or index === path.points.length -1  ==> remove point
          //TODO: if index === 1 ==> remove two first points
          //TODO: index === path.points.length -2 ==> remove two last points

          this.setState({
            path: {
              ...path,
              points: [
                ...path.points.slice(0, index),
                {
                  ...path.points[index],
                  type: "M"
                },
                ...path.points.slice(index + 1)
              ]
            }
          });
        }
        return;
      }

      case "Escape":
      case "Enter": {
        ev.preventDefault();
        return this.endEdit();
      }
    }
  };

  componentDidMount() {
    const { path } = this.state;

    document.body.addEventListener("mousedown", this.handleDocumentClick);

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

    document.body.removeEventListener("mousedown", this.handleDocumentClick);
  }

  handleDocumentClick = ev => {
    this.setState({ selectedVertex: null });
  };

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
    const { path, selectedVertex } = this.state;
    return (
      <g>
        <path className={"canvas__path"} d={serializePath(path.points)} />
        {path.points.map((point, index) => (
          <Vertex
            key={index}
            selected={selectedVertex === index}
            point={point}
            onSelect={() => this.setState({ selectedVertex: index })}
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
          />
        ))}
      </g>
    );
  }
}

export default ({ edit, ...props }) => {
  return edit ? <ShapeEdit {...props} /> : <ShapeView {...props} />;
};
