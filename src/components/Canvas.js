import React, { Component } from "react";
import "../styles/canvas.scss";
import Shape from "./Shape";

let counter = 2;
const getId = () => counter++;

const createShape = point => ({
  points: [point, point],
  style: null
});

class Canvas extends Component {
  constructor(props) {
    super(props);
    this.state = {
      editIndex: null,
      shapes: [
        {
          id: 1,
          points: [
            {
              x: 139,
              y: 157.3333282470703
            },
            {
              x: 424,
              y: 294.3333282470703
            },
            {
              x: 443,
              y: 42.33332824707031
            },
            {
              x: 186,
              y: 251.3333282470703
            },
            {
              x: 628,
              y: 174.3333282470703
            },
            {
              x: 141,
              y: 155.3333282470703
            }
          ],
          style: null
        }
      ]
    };
  }

  componentDidMount() {
    const { x, y } = this.refs.svgRoot.getBoundingClientRect();
    this.setState({ offset: { x, y } });
  }

  addPath = ({ pageX: x, pageY: y }) => {
    const { shapes, offset } = this.state;
    const point = { x: x - offset.x, y: y - offset.y };

    this.setState({
      shapes: [...shapes, createShape(point)],
      editIndex: shapes.length
    });
  };

  render() {
    const { shapes, offset, editIndex } = this.state;
    return (
      <>
        <svg
          ref={"svgRoot"}
          className="canvas"
          onClick={editIndex === null ? this.addPath : null}
        >
          {shapes.map((shape, index) => (
            <Shape
              onSelect={() => this.setState({ editIndex: index })}
              onChange={path => {
                console.log(path);
                const id = path.id || getId();
                return this.setState({
                  shapes: [
                    ...shapes.slice(0, editIndex),
                    { id, ...path },
                    ...shapes.slice(editIndex + 1)
                  ],
                  editIndex: null
                });
              }}
              key={index}
              edit={editIndex === index}
              offset={offset}
              path={shape}
            />
          ))}

          {shapes.length < 0 && <text dy={20}>Click to start drawing.</text>}
        </svg>
      </>
    );
  }
}

export default Canvas;
