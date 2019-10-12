import React from 'react'
import BEM from "../../utils/BEM"

import './FormInput.scss'

const b = BEM("FormInput")

const FormInput = ({ id, ref, type = 'text', value, label, placeholder, children, changeHandler }) => (
  <div className={b("group")}>
    <label htmlFor={id}>{label}</label>
    {children}
    <input
      id={id}
      ref={ref}
      value={value}
      type={type}
      placeholder={placeholder}
      onChange={changeHandler}
      className={b("control")}
    />
  </div>
)

export default FormInput