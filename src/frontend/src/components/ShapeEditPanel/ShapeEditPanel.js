import React, { useRef, useState, createRef } from "react"
import { useDispatch, useSelector } from "react-redux"
import { assocPath, pathOr, pipe } from "ramda"
import { getActiveDocument } from "../../reducers"
import { updateDocument } from "../../actions"
import BEM from "../../utils/BEM"

import FormInput from '../FormInput'

import "./ShapeEditPanel.scss"
import { stopAllEvents } from "../../utils/helper"

const b = BEM("ShapeEditPanel")

const ShapeEditPanel = ({ shapes }) => {
  const colorInput = useRef()
  const opacityRef = createRef()

  const dispatch = useDispatch()
  const activeDocument = useSelector(getActiveDocument)

  const shapeIndices = shapes.reduce((acc, id) => {
    acc[id] = activeDocument.shapes.findIndex(shape => shape.id === id)
    return acc
  }, {})

  const [opacity, setOpacity] = useState(100)
  const [color, setColor] = useState(
    shapes.length === 1
      ? pathOr(
          "",
          ["shapes", shapeIndices[shapes[0]], "style", "stroke"],
          activeDocument
        )
      : ""
  )

  const handleColorSubmit = e => {
    e.preventDefault()

    shapes.forEach(shapeId => {
      pipe(
        assocPath(["shapes", shapeIndices[shapeId], "style", "stroke"], color),
        updateDocument,
        dispatch
      )(activeDocument)
    })
  }

  return (
    <section className={b()} {...stopAllEvents}>
      <form className={b("form")} onSubmit={handleColorSubmit}>
        <h4 className={b("feature-name")}>Stroke</h4>
        <div className={b("stroke")}>
          <FormInput
            type="text"
              ref={colorInput}
              placeholder={"000000"}
              value={color}
              style={{
                width: '50%',
                'max-width': '50%'
              }}
              onChange={ev => setColor(ev.target.value)}
          >
            <span
              className={b("stroke-color-preview")}
              style={{ backgroundColor: "#" + color }}
            />
          </FormInput>
          <FormInput
            ref={opacityRef}
            value={opacity}
            style={{
              width: '46px'
            }}
            onChange={ev => setOpacity(ev.target.value)}
          />
        </div>
      </form>
    </section>
  )
}

export default ShapeEditPanel
