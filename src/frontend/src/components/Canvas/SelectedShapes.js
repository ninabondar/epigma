import React, { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import {
  getCurrentHistoryPointer,
  getShapeEditPanelInFocus
} from "../../reducers"
import * as actions from "../../actions"
import Selection from "../Selection/Selection"
import ShapeView from "../Shape/ShapeView"
import { createPoint, getBoundingBoxFromShape } from "../../utils/helper"
import { setSelectedShapes } from "../../actions"

let SelectedShapes = ({ shapes, offset }) => {
  if (shapes.length === 0) return null

  const dispatch = useDispatch()
  const selectionId = useSelector(getCurrentHistoryPointer)
  const editPanelInFocus = useSelector(getShapeEditPanelInFocus)
  const { setEditedShape } = actions

  const keyHandler = ev => {
    // TODO handle more use cases of Escape
    if (!editPanelInFocus) {
      if (ev.code === "Enter" || ev.code === "Escape") {
        dispatch(setSelectedShapes([]))
      }
    }
  }

  useEffect(() => {
    document.addEventListener("keypress", keyHandler)
    return () => document.removeEventListener("keypress", keyHandler)
  })

  const boundingBox = getBoundingBoxFromShape(shapes[0]) //TODO: fix it. Get boundingBox for all shapes. Not only for first

  const [minY, maxX, maxY, minX] = boundingBox
  const boundingRect = [createPoint(minX, minY), createPoint(maxX, maxY)]

  return (
    <Selection key={selectionId} boundingRect={boundingRect}>
      {shapes.map(shape => (
        <ShapeView
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
