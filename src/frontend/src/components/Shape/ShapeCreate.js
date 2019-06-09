// @flow
import React, { useEffect, useState, useContext } from "react"
import { createPoint, createShape } from "../../utils/helper"
import Vertex from "../Vertex"

import BEM from "../../utils/BEM"
import "./Shape.scss"
import { ShapeView } from "./ShapeView"
import { TransformContext } from "../CanvasTransform"
const b = BEM("Shape")

const ShapeCreate = props => {
  const { onChange, offset } = props
  const transformation = useContext(TransformContext)
  const [shape, setShape] = useState(null)
  const [ghostPoint, setGhostPoint] = useState(createPoint({ x: 0, y: 0 }))

  useEffect(() => {
    const documentClickHandler = () =>
      setShape(
        shape === null
          ? createShape(ghostPoint)
          : {
              ...shape,
              points: [...shape.points, transformation.invert(ghostPoint)]
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
            points: [...shape.points, transformation.invert(ghostPoint)]
          }}
          className={b(["create"])}
        />
      ) : null}

      <Vertex
        draggable={true}
        point={ghostPoint}
        onChange={point => {
          setGhostPoint({ x: point.x - offset.x, y: point.y - offset.y })
        }}
      />
    </g>
  )
}

export default ShapeCreate
