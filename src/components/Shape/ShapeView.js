import React, { useContext } from "react"

import { connect } from "react-redux"
import { withHandlers, compose } from "recompose"

import { changeMode } from "../../actions"
import { TransformContext } from "../CanvasTransform"

import { serializePath } from "../../utils/helper"
import { serializeTransformationMatrix } from "../../utils/matrix"

import BEM from "../../utils/BEM"
import "./Shape.scss"
import { SelectionTransformContext } from "../Selection/Selection"
const b = BEM("Shape")

export const ShapeView = ({ path, onClick, className = b() }) => {
  const tansformation = useContext(TransformContext)
  const selectionTransformation =
    useContext(SelectionTransformContext) || (a => a)

  return (
    <g
      transform={serializeTransformationMatrix(tansformation.matrix)}
      className={className}
      onClick={onClick}
    >
      <path
        className={b("path")}
        d={serializePath(path.points.map(selectionTransformation))}
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
