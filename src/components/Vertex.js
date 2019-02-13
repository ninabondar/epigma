import React, { Component } from "react";
class Vertex extends Component {
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

  render() {
    const { x, y } = this.props.point;
    return <circle onMouseDown={this.startDragging} cx={x} cy={y} r={4} />;
  }
}

export default Vertex;
