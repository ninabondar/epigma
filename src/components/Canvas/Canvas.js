// @flow
import React, { useContext } from "react"
import { connect } from "react-redux"
import {
  branch,
  compose,
  renderNothing,
  withHandlers,
  withState
} from "recompose"
import uuid from "uuid"

import Selection from "../Selection/Selection"
import {
  createPoint,
  createShape,
  getBoundingBoxFromShape
} from "../../utils/helper"

import { changeActiveShape, changeMode, setSelectedShapes } from "../../actions"

import {
  getActiveShapes,
  getEditorMode,
  getSelectedShapes
} from "../../reducers"

import Shape from "../Shape"
import CanvasTransform, { TransformContext } from "../CanvasTransform"

import BEM from "../../utils/BEM"
import "./Canvas.scss"
const b = BEM("Canvas")

const getId = uuid

let SelectedShapes = ({
  shapes,
  setSelectedIndex,
  setShapes,
  offset,
  selectedIndex
}) => {
  const transformation = useContext(TransformContext)

  const boundingBox = getBoundingBoxFromShape(shapes[0]) //TODO: fix it. Get boundingBox for all shapes. Not only for first

  const [minY, maxX, maxY, minX] = boundingBox
  const boundingRect = [createPoint(minX, minY), createPoint(maxX, maxY)].map(
    transformation
  )

  return (
    <Selection boundingRect={boundingRect}>
      {shapes.map((shape, index) => (
        <Shape
          key={index}
          mode={"VIEW"}
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
    </Selection>
  )
}

SelectedShapes = branch(({ shapes }) => shapes.length === 0, renderNothing)(
  SelectedShapes
)

const Canvas = ({
  shapes,
  offset,
  selectedShapes: selectedShapesId,
  selectedIndex,
  setSelectedIndex,
  setShapes,
  changeMode,
  mode,
  selectShape
}) => {
  const viewShapes = shapes.filter(({ id }) => !selectedShapesId.includes(id))
  const selectedShapes = shapes.filter(({ id }) =>
    selectedShapesId.includes(id)
  )

  return (
    <CanvasTransform>
      <svg className={b()}>
        {viewShapes.map((shape, index) => (
          <Shape
            key={index}
            mode={index === selectedIndex ? mode : "VIEW"}
            onSelect={e => {
              setSelectedIndex(index)
              selectShape(e, shape.id)
            }}
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

        <SelectedShapes
          offset={offset}
          shapes={selectedShapes}
          setSelectedIndex={setSelectedIndex}
          setShapes={setShapes}
          selectedIndex={selectedIndex}
        />

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
}

const enhancer = compose(
  connect(
    state => ({
      shapes: getActiveShapes(state),
      mode: getEditorMode(state),
      selectedShapes: getSelectedShapes(state)
    }),
    {
      setShapes: changeActiveShape,
      changeMode,
      setSelectedShapes
    }
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
    },
    selectShape: ({ selectedShapes, setSelectedShapes }) => (e, id) => {
      console.log(id, "ID")
      selectedShapes
        ? setSelectedShapes([...selectedShapes, id])
        : setSelectedShapes([id])
    }
  })
)

export default enhancer(Canvas)
