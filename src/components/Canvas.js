import React, { Component } from "react";
import "../styles/canvas.scss";
import Path from "./Path";

class Canvas extends Component {
  constructor(props) {
    super(props);
    this.state = {
      editIndex: null,
      objects: []
    };
  }

  componentDidMount() {
    const { x, y } = this.refs.svgRoot.getBoundingClientRect();
    this.setState({ offset: { x, y } });
  }

  addPath = ({ pageX: x, pageY: y }) => {
    const { objects, offset } = this.state;
    const point = { x: x - offset.x, y: y - offset.y };

    this.setState({
      objects: [...objects, [point, point]],
      editIndex: objects.length
    });
  };

  render() {
    const { objects, offset, editIndex } = this.state;
    return (
      <>
        <svg
          ref={"svgRoot"}
          className="canvas"
          onClick={editIndex === null ? this.addPath : null}
        >
          {objects.length >= 1 &&
            objects.map((path, index) => (
              <Path
                onSelect={() => this.setState({ editIndex: index })}
                key={index}
                edit={editIndex === index}
                onChange={path =>
                  this.setState({
                    objects: [
                      ...objects.slice(0, editIndex),
                      path,
                      ...objects.slice(editIndex + 1)
                    ],
                    editIndex: null
                  })
                }
                offset={offset}
                path={path}
              />
            ))}

          {objects.length < 0 && <text dy={20}>Click to start drawing.</text>}
        </svg>
      </>
    );
  }
}

export default Canvas;
