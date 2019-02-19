import React, { Component } from "react";

import BEM from "../../utils/BEM";
import "./Vertex.scss";

const b = BEM("Vertex");

class Vertex extends Component {
  static defaultProps = {
    onChange: () => console.log("Vertex changed"),
    onSelect: () => console.log("Vertex selected")
  };

  constructor(props) {
    super(props);

    const { draggable } = props;
    if (draggable) {
      document.body.addEventListener("mousemove", this.startDragging, {
        once: true
      });
    }
  }

  componentWillReceiveProps({ draggable }) {
    if (this.props.draggable === draggable) return;
    if (draggable) {
      document.body.addEventListener("mousemove", this.startDragging, {
        once: true
      });
    } else if (this.endDrag) {
      this.endDrag();
    }
  }

  startDragging = ({ pageX: startX, pageY: startY }) => {
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

    this.endDrag = () => {
      document.removeEventListener("mousemove", this.drag);
      document.removeEventListener("mouseup", this.endDrag);
    };

    document.addEventListener("mousemove", this.drag);
    if (!draggable) {
      document.addEventListener("mouseup", this.endDrag);
    }
  };

  componentDidMount() {
    this.refs.root.addEventListener("mousedown", this.handleMouseDown);
  }

  componentWillUnmount() {
    this.refs.root.removeEventListener("mousedown", this.handleMouseDown);

    if (this.endDrag) {
      this.endDrag();
    }
  }

  handleMouseDown = ev => {
    ev.stopPropagation();
    ev.cancelbubble = true;

    this.props.onSelect(ev);

    this.startDragging(ev);
  };

  render() {
    const { selected } = this.props;
    const { x, y } = this.props.point;

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
