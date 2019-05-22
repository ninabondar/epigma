import React from "react"
import { compose } from "recompose"

import "./ShapeEditPanel.scss"
import "./ShapeFeatureTuningPanel.scss"
import BEM from "../../utils/BEM"

const b = BEM("ShapeEditPanel")
const bF = BEM("ShapeFeatureTuningPanel")

const ShapeEditPanel = () => {
  return (
    <aside className={b()}>
      <section className={bF()}>
        <h4 className={bF("feature-name")}>Stroke</h4>
        <div className={bF("feature-block")}>
          <div className={bF("stroke-color")}>
            <span className={bF("stroke-color-preview")} />
            <small className={bF("stroke-color-code")}>000000</small>
          </div>
          <div className={bF("stroke-opacity")}>100%</div>
        </div>
      </section>
    </aside>
  )
}

export default ShapeEditPanel
