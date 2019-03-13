/* @flow */

import React, { Component } from "react";

import BEM from "../../utils/BEM";
import "./Vertex.scss";
import { createPoint } from "../../utils/helper";

const b = BEM("Vertex");

class Vertex extends Component {
  static defaultProps = {
    onChange: () => console.log("Vertex changed"),
    onSelect: () => console.log("Vertex selected")
  };

  constructor(props) {
    super(props);

    const { draggable, point } = props;
    if (draggable) this.startDragging(point);
  }

  componentWillReceiveProps({ draggable }) {
    const { point } = this.props;

    if (this.props.draggable === draggable) return;
    if (draggable) {
      this.startDragging(point);
    } else {
      this.endDrag();
    }
  }

  startDragging = ({ x: startX, y: startY }) => {
    const { point, onChange, draggable } = this.props;
    const { x, y } = point;

    this.drag = ({ pageX, pageY }) => {
      const { point } = this.props;
      const dx = startX - pageX;
      const dy = pageY - startY;

      onChange({
        ...point,
        x: x - dx,
        y: y + dy
      });
    };

    document.addEventListener("mousemove", this.drag);

    if (!draggable) {
      document.addEventListener("mouseup", this.endDrag);
    }
  };

  endDrag = () => {
    document.removeEventListener("mousemove", this.drag);
    document.removeEventListener("mouseup", this.endDrag);
  };

  componentWillUnmount() {
    this.endDrag();
  }

  handleMouseDown = ev => {
    ev.stopPropagation();
    ev.cancelbubble = true;

    this.props.onSelect(ev);
    this.startDragging(createPoint({ x: ev.pageX, y: ev.pageY }));
  };

  render() {
    const { selected, draggable } = this.props;
    const { x, y } = this.props.point;

    return (
      <circle
        ref="root"
        className={b({ selected })}
        onMouseDown={!draggable ? this.handleMouseDown : null}
        cx={x}
        cy={y}
        r={selected ? 6 : 4}
      />
    );
  }
}

export default Vertex;
