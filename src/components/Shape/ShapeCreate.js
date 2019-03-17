// @flow
import React, { useContext, useEffect, useState } from "react"

import { append, last } from "ramda"
import {
  createPoint,
  removePoint,
  getBoundingBoxFromShape,
  createShape
} from "../../utils/helper"
import Vertex from "../Vertex"

import { TransformContext } from "../CanvasTransform"
import Selection from "../Selection/Selection"

import BEM from "../../utils/BEM"
import "./Shape.scss"
import { ShapeView } from "./ShapeView"
const b = BEM("Shape")

const ShapeCreate = props => {
  const { offset, onChange } = props
  // const transformation = useContext(TransformContext)

  const [shape, setShape] = useState(null)
  const [ghostPoint, setGhostPoint] = useState(createPoint({ x: 0, y: 0 }))

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

  // let points = [...path.points, ghostPoint]

  useEffect(() => {
    const keyHandler = ev => {
      const { key } = ev

      switch (key) {
        case "Escape":
        case "Enter": {
          ev.preventDefault()
          return onChange({ ...shape })
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

      {/*{points.map(transformation).map((point, index) => (*/}
      {/*<Vertex*/}
      {/*key={index}*/}
      {/*selected={selectedVertex === index}*/}
      {/*point={point}*/}
      {/*onSelect={() => setSelectedVertex(index)}*/}
      {/*onChange={point =>*/}
      {/*setPath({*/}
      {/*...path,*/}
      {/*points: [*/}
      {/*...points.slice(0, index),*/}
      {/*transformation.invert(point),*/}
      {/*...points.slice(index + 1)*/}
      {/*]*/}
      {/*})*/}
      {/*}*/}
      {/*/>*/}
      {/*))}*/}

      <Vertex
        draggable={true}
        point={ghostPoint}
        onChange={point => setGhostPoint(point)}
      />
    </g>
  )
}

export default ShapeCreate
