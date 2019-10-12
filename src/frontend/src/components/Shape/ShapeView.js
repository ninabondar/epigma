import React, { useContext } from "react"

import { connect } from "react-redux"
import { withHandlers, compose } from "recompose"

import { changeMode } from "../../actions"
import { TransformContext } from "../CanvasTransform"
import { SelectionTransformContext } from "../Selection/Selection"

import { serializePath } from "../../utils/helper"
import { serializeTransformationMatrix } from "../../utils/matrix"

import BEM from "../../utils/BEM"
import "./Shape.scss"
const b = BEM("Shape")

export const ShapeView = ({
  path,
  pathStyle = {},
  onClick,
  className = b()
}) => {
  let { stroke } = pathStyle
  stroke = stroke ? stroke : "000000"
  const transformation = useContext(TransformContext)
  const selectionTransformation = useContext(SelectionTransformContext)

  return (
    <g
      transform={serializeTransformationMatrix(transformation.matrix)}
      className={className}
      onClick={onClick}
    >
      <path
        style={{ ...pathStyle, stroke: "#" + stroke }}
        className={b("path")}
        d={serializePath(
          path.points.map(selectionTransformation || (point => point))
        )}
      />
    </g>
  )
}

const enhancer = compose(
  connect(
    null,
    { changeMode }
  ),

  withHandlers({
    onClick: ({ onSelect, changeMode }) => ev => {
      ev.preventDefault()
      ev.stopPropagation()
      changeMode("EDIT")
      return onSelect()
    }
  })
)

export default enhancer(ShapeView)
