/* @flow */
import React, { Component } from "react"

import { createPoint } from "../../utils/helper"

import "./Vertex.scss"
import BEM from "../../utils/BEM"

const b = BEM("Vertex")

class Vertex extends Component {
  static defaultProps = {
    onChange: () => console.log("Vertex changed"),
    onSelect: () => console.log("Vertex selected")
  }

  constructor(props) {
    super(props)

    const { draggable, point } = props
    if (draggable) this.startDragging(point)
  }

  componentWillReceiveProps({ draggable }) {
    const { point } = this.props

    if (this.props.draggable === draggable) return
    if (draggable) {
      this.startDragging(point)
    } else {
      this.endDrag()
    }
  }

  startDragging = ({ x: startX, y: startY }) => {
    const { point, onChange, draggable, activeShape } = this.props
    const { x, y } = point

    console.log(activeShape, "active shape")

    this.drag = ({ pageX, pageY }) => {
      const { point } = this.props
      const dx = startX - pageX
      const dy = pageY - startY

      onChange({
        ...point,
        x: x - dx,
        y: y + dy
      })
    }

    document.addEventListener("mousemove", this.drag)

    if (!draggable) {
      document.addEventListener("mouseup", e => {
        this.endDrag(e)
      })
    }
  }

  endDrag = e => {
    document.removeEventListener("mousemove", this.drag)
    document.removeEventListener("mouseup", e => {
      this.endDrag(e)
    })
  }

  componentWillUnmount() {
    this.endDrag()
  }

  handleMouseDown = ev => {
    ev.stopPropagation()
    ev.cancelbubble = true

    this.props.onSelect(ev)
    this.startDragging(createPoint({ x: ev.pageX, y: ev.pageY }))
  }

  render() {
    const { selected, draggable } = this.props
    const { x, y } = this.props.point

    return (
      <circle
        ref="root"
        className={b({ selected })}
        onMouseDown={!draggable ? this.handleMouseDown : null}
        cx={x}
        cy={y}
        r={selected ? 6 : 4}
      />
    )
  }
}

export default Vertex
