import React, { forwardRef } from "react"
import BEM from "../../utils/BEM"

import "./FormInput.scss"

const b = BEM("FormInput")

const FormInput = forwardRef(({ id, type="text", label, children, classes, ...restProps }, ref) => (
  <div className={b("group", classes)}>
    {label && <label htmlFor={id}>{label}</label>}
    {children}
    <input
      id={id}
      ref={ref}
      type={type}
      className={b("control")}
      {...restProps}
    />
  </div>
))

export default FormInput
