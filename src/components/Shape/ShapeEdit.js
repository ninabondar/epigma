// @flow
import React, { useContext, useEffect, useState } from "react"

import { removePoint, getBoundingBoxFromShape } from "../../utils/helper"

import Vertex from "../Vertex"
import { TransformContext } from "../CanvasTransform"
import Selection from "../Selection/Selection"
import { ShapeView } from "./ShapeView"

import BEM from "../../utils/BEM"
import "./Shape.scss"
const b = BEM("Shape")

const ShapeEdit = props => {
  const { offset, onChange } = props
  const transformation = useContext(TransformContext)

  const [path, setPath] = useState(props.path)
  const [mode, setMode] = useState("edit")
  const [selectedVertex, setSelectedVertex] = useState(null)

  const boundingBox = getBoundingBoxFromShape(path)
  let points = path.points

  useEffect(() => setPath(props.path), [props.path])

  useEffect(() => {
    const keyHandler = ev => {
      const { key } = ev

      switch (key) {
        case "Backspace":
        case "Delete": {
          ev.preventDefault()

          if (selectedVertex !== null) {
            setPath({
              ...path,
              points: removePoint(path.points, selectedVertex)
            })
          }
          return
        }

        case "Escape":
        case "Enter": {
          ev.preventDefault()
          return onChange({ ...path })
        }

        default:
          return
      }
    }

    const handleDocumentClick = ev => setSelectedVertex(null)

    document.body.addEventListener("mousedown", handleDocumentClick)
    document.addEventListener("keydown", keyHandler)

    return () => {
      document.removeEventListener("keydown", keyHandler)
      document.body.removeEventListener("mousedown", handleDocumentClick)
    }
  }, [path, selectedVertex])

  return (
    <g className={b(["edit"])}>
      {mode === "select" && <Selection boundingRect={boundingBox} />}
      <ShapeView
        onClick={() => setMode("select")}
        path={path}
        className={b(["edit"])}
      />
      {points.map(transformation).map((point, index) => (
        <Vertex
          key={index}
          selected={selectedVertex === index}
          point={point}
          onSelect={() => setSelectedVertex(index)}
          onChange={point =>
            setPath({
              ...path,
              points: [
                ...points.slice(0, index),
                transformation.invert(point),
                ...points.slice(index + 1)
              ]
            })
          }
        />
      ))}
    </g>
  )
}

export default ShapeEdit
