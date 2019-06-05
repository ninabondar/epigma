import React from "react"
import { connect } from "react-redux"
import { compose, withHandlers } from "recompose"
import { clone } from "ramda"

import "./ShapeEditPanel.scss"
import "./ShapeFeatureTuningPanel.scss"
import BEM from "../../utils/BEM"
import { getActiveDocument, getSelectedShapes } from "../../reducers"
import { changeEditorDocument } from "../../actions"

const b = BEM("ShapeEditPanel")
const bF = BEM("ShapeFeatureTuningPanel")

const ShapeEditPanel = ({ changeColor }) => {
  return (
    <aside className={b()}>
      <section className={bF()}>
        <h4 className={bF("feature-name")}>Stroke</h4>
        <div className={bF("feature-block")}>
          <div className={bF("stroke-color")}>
            <span className={bF("stroke-color-preview")} />
            <small
              className={bF("stroke-color-code")}
              onClick={console.log("changing color")}
            >
              000000
            </small>
            <input
              className={bF("stroke-color-input")}
              type="text"
              placeholder={""}
              onSubmit={changeColor}
            />
          </div>
          <div className={bF("stroke-opacity")}>100%</div>
        </div>
      </section>
    </aside>
  )
}

const enhancer = compose(
  connect(
    state => ({
      selectedShapes: getSelectedShapes(state),
      activeDocument: getActiveDocument(state)
    }),
    { changeEditorDocument }
  ),
  // TODO make a prop of current color(calculate from current styles of picked shape),..
  // TODO ..and change color via input field

  withHandlers({
    changeColor: ({
      selectedShapes,
      activeDocument,
      changeEditorDocument
    }) => e => {
      if (selectedShapes.length === 1) {
        const newDocument = clone(activeDocument)
        newDocument.style.color = "#" + e.target.value
        changeEditorDocument(newDocument)
      }
    }
  })
)

export default ShapeEditPanel
