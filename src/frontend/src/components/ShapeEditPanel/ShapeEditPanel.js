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
import "./ShapeFeatureTuningPanel.scss"

const b = BEM("ShapeEditPanel")
const bF = BEM("ShapeFeatureTuningPanel")

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
    <aside className={b()}>
      <section className={bF()}>
        <h4 className={bF("feature-name")}>Stroke</h4>
        <div className={bF("feature-block")}>
          <form className={bF("stroke-color")} onSubmit={handleColorSubmit}>
            <span className={bF("stroke-color-preview")} />
            <input
              className={bF("stroke-color-input")}
              type="text"
              ref={colorInput}
              placeholder={"000000"}
              onFocus={handleFocus}
              onBlur={handleBlur}
            />
          </form>
          <div className={bF("stroke-opacity")}>100%</div>
          <input type="color" />
        </div>
      </section>
    </aside>
  )
}

export default ShapeEditPanel
