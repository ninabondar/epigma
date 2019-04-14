import React, { useState, createContext } from "react"
import {
  getTransformMatrix,
  multiplyManyMatrices,
  multiplyMatrix,
  transformPoint
} from "../../utils/matrix"
import { createPoint, getZoomMatrix } from "../../utils/helper"

export const TransformContext = createContext()

const CanvasTransform = ({ children }) => {
  const [matrix, setMatrix] = useState(getTransformMatrix(1, 0, 0))
  const [isDragging, setDragging] = useState(false)

  const startDrag = ({ pageX, pageY }, matrix) => {
    setDragging(true)

    const startX = pageX - matrix[2][0]
    const startY = pageY - matrix[2][1]

    const handleMouseMove = ({ pageX: endX, pageY: endY }) => {
      const x = endX - startX
      const y = endY - startY
      const newMatrix = [matrix[0], matrix[1], [x, y, 1]]
      setMatrix(newMatrix)
    }

    const handleMouseUp = () => {
      setDragging(false)
      document.removeEventListener("mousemove", handleMouseMove)
      document.removeEventListener("mouseup", handleMouseUp)
    }

    document.addEventListener("mousemove", handleMouseMove)
    document.addEventListener("mouseup", handleMouseUp)
  }

  const handleScroll = ev => zoom(ev, matrix)

  const zoom = (ev, matrix) => {
    ev.preventDefault()
    const zoomMatrix = getZoomMatrix(
      createPoint(ev.pageX, ev.pageY),
      ev.deltaY < 0 ? 0.9 : 1.1
    )
    setMatrix(multiplyMatrix(matrix, zoomMatrix))
  }

  const handleMouseDown = ev => {
    if (!isDragging) {
      startDrag(ev, matrix)
    }
  }

  return (
    <div onMouseDown={handleMouseDown} onWheel={handleScroll}>
      <TransformContext.Provider value={transformPoint(matrix)}>
        {children}
      </TransformContext.Provider>
    </div>
  )
}

export default CanvasTransform
