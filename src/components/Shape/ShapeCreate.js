// @flow
import React, { useEffect, useState } from "react"
import { createPoint, createShape } from "../../utils/helper"
import Vertex from "../Vertex"

import BEM from "../../utils/BEM"
import "./Shape.scss"
import { ShapeView } from "./ShapeView"
const b = BEM("Shape")

const ShapeCreate = props => {
  const { onChange, offset } = props
  // const transformation = useContext(TransformContext)

  const [shape, setShape] = useState(null)
  const [ghostPoint, setGhostPoint] = useState(createPoint({ x: 0 - offset.x, y: 0 }))

  useEffect(() => {
    const documentClickHandler = () =>
      setShape(
        shape === null
          ? createShape(ghostPoint)
          : {
              ...shape,
              points: [...shape.points, ghostPoint]
            }
      )

    document.addEventListener("click", documentClickHandler)
    return () => document.removeEventListener("click", documentClickHandler)
  }, [ghostPoint])

  useEffect(() => {
    const keyHandler = ev => {
      const { key } = ev

      switch (key) {
        case "Escape":
        case "Enter": {
          ev.preventDefault()
          onChange({ ...shape })
          break
        }
        default:
          return
      }
    }

    document.addEventListener("keydown", keyHandler)

    return () => {
      document.removeEventListener("keydown", keyHandler)
    }
  }, [shape])

  return (
    <g className={b(["edit"])}>
      {shape !== null ? (
        <ShapeView
          path={{
            ...shape,
            points: [...shape.points, ghostPoint]
          }}
          className={b(["create"])}
        />
      ) : null}

      <Vertex
        draggable={true}
        point={ghostPoint}
        onChange={point => setGhostPoint(point)}
      />
    </g>
  )
}

export default ShapeCreate
