// @flow
import React, { useContext, useEffect, useState } from "react"
import { __, assoc, assocPath, pipe } from "ramda"
import { useEvent, useKey } from "react-use"
import { removePoint } from "../../utils/helper"

import Vertex from "../Vertex"
import { TransformContext } from "../CanvasTransform"
import { ShapeView } from "./ShapeView"

import BEM from "../../utils/BEM"
import "./Shape.scss"

const b = BEM("Shape")

const ShapeEdit = ({ onChange, style, path: pathProperty }) => {
  const transformation = useContext(TransformContext)
  const [pathState, setPath] = useState(pathProperty)
  const [selectedVertex, setSelectedVertex] = useState(null)

  const points = pathState.points

  useEffect(() => setPath(pathProperty), [pathProperty])
  useEvent("mousedown", () => setSelectedVertex(null), document.body)

  const deleteHandler = ev => {
    ev.preventDefault()
    if (selectedVertex == null) return

    pipe(
      removePoint(pathState.points),
      assoc("points", __, pathState),
      setPath
    )(selectedVertex)
  }

  const changeHandler = ev => {
    ev.preventDefault()
    return onChange(pathState)
  }

  useKey(({ key }) => ["Backspace", "Delete"].includes(key), deleteHandler, {
    event: "keydown"
  })

  useKey(({ key }) => ["Escape", "Enter"].includes(key), changeHandler, {
    event: "keydown"
  })

  return (
    <g className={b(["edit"])}>
      <ShapeView style={style} path={pathState} className={b(["edit"])} />
      {points.map(transformation).map((point, index) => (
        <Vertex
          key={index}
          selected={selectedVertex === index}
          point={point}
          onSelect={() => setSelectedVertex(index)}
          onChange={point => {
            pipe(
              transformation.invert,
              assocPath(["points", index], __, pathState),
              setPath
            )(point)
          }}
        />
      ))}
    </g>
  )
}

export default ShapeEdit
