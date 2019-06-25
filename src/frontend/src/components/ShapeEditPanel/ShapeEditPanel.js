import React, { useRef } from "react"
import { useDispatch, useSelector } from "react-redux"
import { clone, head } from "ramda"
import { getActiveDocument, getSelectedShapes } from "../../reducers"
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

  const handleFocus = () => dispatch(setShapePanelInFocus(true))

  const selectedShapes = useSelector(getSelectedShapes)

  const handleBlur = () => {
    dispatch(setShapePanelInFocus(false))
    const { value: colorValue } = colorInput.current

    if (selectedShapes.length === 1) {
      //hex is 6 symbols long
      if (colorValue.length === 6) {
        const newDocument = clone(activeDocument)
        const { shapes } = newDocument

        const shapeToStyle = head(
          shapes.filter(shape => shape.id === selectedShapes[0])
        )

        const { style } = shapeToStyle
        shapeToStyle.style = { ...style, stroke: "#" + colorValue }

        dispatch(updateEditorDocument(newDocument))
        colorInput.current.blur()
      }
    }
  }

  return (
    <aside className={b()}>
      <section className={bF()}>
        <h4 className={bF("feature-name")}>Stroke</h4>
        <div className={bF("feature-block")}>
          <div className={bF("stroke-color")}>
            <span className={bF("stroke-color-preview")} />
            <input
              className={bF("stroke-color-input")}
              type="text"
              ref={colorInput}
              placeholder={"000000"}
              onFocus={handleFocus}
              onBlur={handleBlur}
            />
          </div>
          <div className={bF("stroke-opacity")}>100%</div>
        </div>
      </section>
    </aside>
  )
}

export default ShapeEditPanel
