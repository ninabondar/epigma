import React from "react"
import BEM from "../../utils/BEM"

import "./Document.scss"
const b = BEM("Document")

const Document = ({ createdAt, title, clickHandler }) => (
  <div className={b()}>
    <div className={b("title")}>{title}</div>
    <div className={b("side-info")}>
      <small>{createdAt}</small>
      <div className={b("more-btn")} onClick={clickHandler} />
    </div>
  </div>
)

export default Document
