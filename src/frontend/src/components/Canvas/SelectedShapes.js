import React, { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import {
  getCurrentHistoryPointer,
  getShapeEditPanelInFocus
} from "../../reducers"

import Selection from "../Selection/Selection"
import ShapeView from "../Shape/ShapeView"
import { createPoint, getBoundingBoxFromShape } from "../../utils/helper"

import { setEditedShape, setSelectedShapes } from "../../actions"

let SelectedShapes = ({ shapes, offset }) => {
  const dispatch = useDispatch()
  const selectionId = useSelector(getCurrentHistoryPointer)
  const editPanelInFocus = useSelector(getShapeEditPanelInFocus)

  const keyHandler = ev => {
    // TODO handle more use cases of Escape
    if (!editPanelInFocus) {
      if (ev.code === "Enter" || ev.code === "Escape") {
        ev.preventDefault()
        dispatch(setSelectedShapes([]))
      }
    }
  }

  useEffect(() => {
    document.addEventListener("keypress", keyHandler)
    return () => document.removeEventListener("keypress", keyHandler)
  })

  if (shapes.length === 0) return null
  const boundingBox = getBoundingBoxFromShape(shapes[0]) //TODO: fix it. Get boundingBox for all shapes. Not only for first

  const [minY, maxX, maxY, minX] = boundingBox
  const boundingRect = [createPoint(minX, minY), createPoint(maxX, maxY)]

  return (
    <Selection key={selectionId} boundingRect={boundingRect}>
      {shapes.map(shape => (
        <ShapeView
          pathStyle={shape.style}
          key={shape.id}
          onSelect={() => dispatch(setEditedShape(shape.id))}
          offset={offset}
          path={shape}
        />
      ))}
    </Selection>
  )
}

export default SelectedShapes
