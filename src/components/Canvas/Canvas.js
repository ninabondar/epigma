// @flow
import React from "react"
import { connect } from "react-redux"
import { compose, withHandlers, withState } from "recompose"
import uuid from "uuid"

import { createPoint, createShape } from "../../utils/helper"

import { changeActiveShape, changeMode } from "../../actions"

import { getActiveShapes, getEditorMode } from "../../reducers"

import Shape from "../Shape"
import CanvasTransform from "../CanvasTransform/CanvasTransform"

import BEM from "../../utils/BEM"
import "./Canvas.scss"
const b = BEM("Canvas")

const getId = uuid

const Canvas = ({
  shapes,
  offset,
  selectedIndex,
  setSelectedIndex,
  setShapes,
  changeMode,
  mode
}) => (
  <CanvasTransform>
    {console.log(shapes, "shapes")}
    <svg className={b()}>
      {shapes.map((shape, index) => (
        <Shape
          key={index}
          mode={index === selectedIndex ? mode : "VIEW"}
          onSelect={() => setSelectedIndex(index)}
          onChange={path => {
            const id = path.id || getId()

            setSelectedIndex(null)

            setShapes([
              ...shapes.slice(0, selectedIndex),
              { id, ...path },
              ...shapes.slice(selectedIndex + 1)
            ])
          }}
          offset={offset}
          path={shape}
        />
      ))}

      {mode === "CREATE" ? (
        <Shape
          mode="CREATE"
          onChange={newShape => {
            changeMode("VIEW")

            if (newShape.points && newShape.points.length > 1) {
              setShapes([...shapes, newShape])
            }
          }}
        />
      ) : null}
      {shapes.length < 0 && <text dy={20}>Click to start drawing.</text>}
    </svg>
  </CanvasTransform>
)

const enhancer = compose(
  connect(
    state => ({ shapes: getActiveShapes(state), mode: getEditorMode(state) }),
    { setShapes: changeActiveShape, changeMode }
  ),

  withState("offset", "setOffset", { x: 0, y: 0 }),
  withState("selectedIndex", "setSelectedIndex", null),

  withHandlers({
    addPath: ({
      shapes,
      offset,
      setSelectedIndex,
      setShapes,
      selectedIndex
    }) => ({ pageX: x, pageY: y }) => {
      if (selectedIndex !== null) return

      const point = createPoint({ x: x - offset.x, y: y - offset.y })

      setSelectedIndex(shapes.length)
      setShapes([...shapes, createShape(point)])
    }
  })
)

export default enhancer(Canvas)
