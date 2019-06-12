import React, { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { getCurrentHistoryPointer } from "../../reducers"
import * as actions from "../../actions"
import Selection from "../Selection/Selection"
import ShapeView from "../Shape/ShapeView"
import { createPoint, getBoundingBoxFromShape } from "../../utils/helper"

let SelectedShapes = ({ shapes, offset }) => {
  if (shapes.length === 0) return null

  const dispatch = useDispatch()
  const selectionId = useSelector(getCurrentHistoryPointer)
  const { setEditedShape } = actions

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
