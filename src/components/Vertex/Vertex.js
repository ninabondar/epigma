import React, { Component } from "react";

import BEM from "../../utils/BEM";
import "./Vertex.scss";

const b = BEM("Vertex");

class Vertex extends Component {
  static defaultProps = {
    onChange: () => console.log("Vertex changed"),
    onSelect: () => console.log("Vertex selected")
  };

  startDragging = ({ pageX: startX, pageY: startY }) => {
    const { point, onChange } = this.props;
    const { x, y } = point;

    const drag = ({ pageX, pageY }) => {
      const dx = startX - pageX;
      const dy = pageY - startY;

      onChange({
        x: x - dx,
        y: y + dy
      });
    };

    const endDrag = () => {
      document.removeEventListener("mousemove", drag);
      document.removeEventListener("mouseup", endDrag);
    };

    document.addEventListener("mousemove", drag);
    document.addEventListener("mouseup", endDrag);
  };

  componentDidMount() {
    this.refs.root.addEventListener("mousedown", this.handleMouseDown);
  }

  componentWillUnmount() {
    this.refs.root.removeEventListener("mousedown", this.handleMouseDown);
  }

  handleMouseDown = ev => {
    ev.stopPropagation();
    ev.cancelbubble = true;

    this.props.onSelect(ev);
    this.startDragging(ev);
  };

  render() {
    const { selected } = this.props;
    const { x, y, type } = this.props.point;

    if (type === "M") return null;

    return (
      <circle
        ref="root"
        className={b({ selected })}
        onMouseDown={this.handleMouseDown}
        cx={x}
        cy={y}
        r={selected ? 6 : 4}
      />
    );
  }
}

export default Vertex;
