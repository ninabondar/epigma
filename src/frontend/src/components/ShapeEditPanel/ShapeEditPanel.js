import React, { useRef } from "react"
import { useDispatch, useSelector } from "react-redux"
import { clone, head } from "ramda"
import { getActiveDocument, getSelectedShapes } from "../../reducers"
import {
  changeEditorDocumentSuccess,
  setShapePanelInFocus
} from "../../actions"
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

  const handleBlur = e => {
    dispatch(setShapePanelInFocus(false))
    const { value: colorValue } = colorInput.current

    if (selectedShapes.length === 1) {
      //hex is 6 symbols long
      if (colorValue.length === 6) {
        const newDocument = clone(activeDocument)
        const shapeToStyle = head(
          newDocument.shapes.filter(shape => shape.id === selectedShapes[0])
        )

        newDocument.shapes[newDocument.shapes.indexOf(shapeToStyle)].style
          ? (newDocument.shapes[0].style = {})
          : (newDocument.shapes.color = "#" + colorValue)

        changeEditorDocumentSuccess(newDocument)
      }
    }
  }

  const handleFocus = () => dispatch(setShapePanelInFocus(true))

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
              onBlur={e => handleBlur(e)}
            />
          </div>
          <div className={bF("stroke-opacity")}>100%</div>
        </div>
      </section>
    </aside>
  )
}

export default ShapeEditPanel
