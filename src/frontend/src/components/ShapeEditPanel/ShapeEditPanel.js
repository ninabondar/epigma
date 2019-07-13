import React, { useRef } from "react"
import { useDispatch, useSelector } from "react-redux"
import { clone, head } from "ramda"
import {
  getActiveDocument,
  getSelectedShapes,
  getShapeEditPanelInFocus
} from "../../reducers"
import { setShapePanelInFocus, updateEditorDocument } from "../../actions"
import BEM from "../../utils/BEM"

import "./ShapeEditPanel.scss"



const b = BEM("ShapeEditPanel")

const ShapeEditPanel = () => {
  const colorInput = useRef()
  const dispatch = useDispatch()
  const activeDocument = useSelector(getActiveDocument)
  const selectedShapes = useSelector(getSelectedShapes)
  const panelIsInFocus = useSelector(getShapeEditPanelInFocus)

  const handleFocus = () => {
    if (selectedShapes.length === 1) {
      dispatch(setShapePanelInFocus(true))
    }
  }

  const handleBlur = () => {
    dispatch(setShapePanelInFocus(false))
  }

  const handleColorSubmit = e => {
    e.preventDefault()
    const { value: colorValue } = colorInput.current

    //hex is 6 symbols long
    if (panelIsInFocus && selectedShapes.length === 1) {
      const newDocument = clone(activeDocument)
      const { shapes } = newDocument
      const shapeToStyle = head(
        shapes.filter(shape => shape.id === selectedShapes[0])
      )

      const { style } = shapeToStyle

      shapeToStyle.style = { ...style, stroke: "#" + colorValue }
      dispatch(updateEditorDocument(newDocument))
    }
  }

  return (
    <>
      <section className={b()}>
        <h4 className={b("feature-name")}>Stroke</h4>
        <div className={b("feature-block")}>
          <form className={b("stroke-color")} onSubmit={handleColorSubmit}>
            <span className={b("stroke-color-preview")} />
            <input
              className={b("stroke-color-input")}
              type="text"
              ref={colorInput}
              placeholder={"000000"}
              onFocus={handleFocus}
              onBlur={handleBlur}
            />
          </form>
          <div className={b("stroke-opacity")}>100%</div>
          <input type="color" />
        </div>
      </section>
    </>
  )
}

export default ShapeEditPanel
