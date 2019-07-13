import React, { useRef, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { clone } from "ramda"
import { getActiveDocument } from "../../reducers"
import { updateDocument } from "../../actions"
import BEM from "../../utils/BEM"

import "./ShapeEditPanel.scss"
import { stopAllEvents } from "../../utils/helper"

const b = BEM("ShapeEditPanel")

const ShapeEditPanel = ({ shapes }) => {
  const colorInput = useRef()
  const dispatch = useDispatch()
  const activeDocument = useSelector(getActiveDocument)

  const shapeIndeces = shapes.reduce((acc, id) => {
    acc[id] = activeDocument.shapes.findIndex(shape => shape.id === id)
    return acc
  }, {})

  const [color, setColor] = useState(
    shapes.length == 1
      ? activeDocument.shapes[shapeIndeces[shapes[0]]].style.stroke
      : ""
  )

  const handleColorSubmit = e => {
    e.preventDefault()

    const newDoc = clone(activeDocument)
    shapes.map(shapeId => {
      const shapeIndex = newDoc.shapes.findIndex(shape => shape.id === shapeId)
      newDoc.shapes[shapeIndex].style.stroke = color
      dispatch(updateDocument(newDoc))
    })
  }

  return (
    <>
      <section className={b()} {...stopAllEvents}>
        <h4 className={b("feature-name")}>Stroke</h4>
        <div className={b("feature-block")}>
          <form className={b("stroke-color")} onSubmit={handleColorSubmit}>
            <span
              className={b("stroke-color-preview")}
              style={{ backgroundColor: "#" + color }}
            />
            <input
              className={b("stroke-color-input")}
              type="text"
              ref={colorInput}
              placeholder={"000000"}
              value={color}
              onChange={ev => setColor(ev.target.value)}
            />
          </form>
          <div className={b("stroke-opacity")}>100%</div>
        </div>
      </section>
    </>
  )
}

export default ShapeEditPanel
