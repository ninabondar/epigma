/* @flow */
import React, { Component } from "react";


import { append, last } from "ramda";
import { createPoint, removePoint, serializePath, getBoundingBoxFromShape } from "../../utils/helper";
import Vertex from "../Vertex";

import BEM from "../../utils/BEM";
import "./Shape.scss";
import Selection from "../Selection/Selection";

const b = BEM("Shape");

class ShapeEdit extends Component {
  static defaultProps = {
    onChange: () => {}
  };

  constructor(props) {
    super(props);
    const { path } = props;
    const mode = path.id === undefined ? "create" : "edit";

    this.state = {
      mode,
      ghostPoint: mode === "create" ? last(path.points) : null,

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
          this.setState({
            path: {
              ...path,
              points: removePoint(path.points, index)
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
      document.addEventListener("click", this.drawPoint);
    }
  }

  componentWillUnmount() {
    document.removeEventListener("keydown", this.keyHandler);
    document.removeEventListener("click", this.drawPoint);
    document.body.removeEventListener("mousedown", this.handleDocumentClick);
  }

  handleDocumentClick = ev => {
    this.setState({ selectedVertex: null });
  };

  getBoundingBox = path => {
    const box = getBoundingBoxFromShape(path);
    return box;
  };

  drawPoint = ({ pageX: x, pageY: y }) => {
    const { path } = this.state;
    const { offset } = this.props;

    const point = createPoint({ x: x - offset.x, y: y - offset.y });

    this.setState({
      path: {
        ...path,
        points: append(point, path.points)
      }
    });
  };

  endEdit = () => {
    const { path } = this.state;

    this.props.onChange({ ...path });
  };

  handleDoubleClick = (e) => {
    this.setState({
      mode: "select",
    })
  };

  render() {
    const { path, selectedVertex, mode, ghostPoint } = this.state;
    const boundingBox = this.getBoundingBox(path);
    let points = mode === "create" ? [...path.points, ghostPoint] : path.points;

    console.log(points);
    console.log(mode);
    return (
        <Selection boundingRect={boundingBox} isActive={mode === "select"}>

          <g className={b(["edit"])}>
            <path onDoubleClick={this.handleDoubleClick} className={b("path")} d={serializePath(points)} />
            {points.map((point, index) => (
                <Vertex
                    key={index}
                    selected={selectedVertex === index}
                    point={point}
                    onSelect={() => this.setState({ selectedVertex: index })}
                    onChange={point =>
                        this.setState({
                          path: {
                            ...path,
                            points: [
                              ...points.slice(0, index),
                              point,
                              ...points.slice(index + 1)
                            ]
                          }
                        })
                    }
                />
            ))}

            {mode === "create" ? (
                <Vertex
                    draggable={true}
                    point={ghostPoint}
                    onChange={point => this.setState({ ghostPoint: point })}
                />
            ) : null}
          </g>

        </Selection>

    );
  }
}

export default ShapeEdit;
