import React, { useContext, useEffect } from "react"
import { useActions, useSelector } from "react-redux"
import { getCurrentHistoryPointer } from "../../reducers"
import * as actions from "../../actions"
import { TransformContext } from "../CanvasTransform"
import { createPoint, getBoundingBoxFromShape } from "../../utils/helper"
import Selection from "../Selection/Selection"
import ShapeView from "../Shape/ShapeView"

let SelectedShapes = ({ shapes, offset }) => {
  if (shapes.length === 0) return null

  const selectionId = useSelector(getCurrentHistoryPointer)
  const { setEditedShape, setSelectedShapes } = useActions(actions)

  const transformation = useContext(TransformContext)

  const boundingBox = getBoundingBoxFromShape(shapes[0]) //TODO: fix it. Get boundingBox for all shapes. Not only for first

  const [minY, maxX, maxY, minX] = boundingBox
  const boundingRect = [createPoint(minX, minY), createPoint(maxX, maxY)]

  useEffect(() => {
    const keyHandler = ev => {
      if (ev.key === "Escape") {
        // setSelectedShapes([])
      }
      // TODO handle more use cases of Escape
    }
    document.addEventListener("keydown", keyHandler)

    return () => document.removeEventListener("keypress", keyHandler)
  })

  return (
    <Selection key={selectionId} boundingRect={boundingRect}>
      {shapes.map(shape => (
        <ShapeView
          key={shape.id}
          onSelect={() => setEditedShape(shape.id)}
          offset={offset}
          path={shape}
        />
      ))}
    </Selection>
  )
}

export default SelectedShapes
