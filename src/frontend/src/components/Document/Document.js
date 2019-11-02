import React from "react"
import BEM from "../../utils/BEM"
import { formatDistanceToNow } from "date-fns"

import "./Document.scss"
const b = BEM("Document")

const Document = ({ createdAt, title, clickHandler }) => (
  <div className={b()}>
    <div className={b("title")}>{title}</div>
    <div className={b("side-info")}>
      <small>{formatDistanceToNow(createdAt)} ago</small>
      <div className={b("more-btn")} onClick={clickHandler} />
    </div>
  </div>
)

Document.defaultProps = {
  clickHandler: () => {}
}

export default Document
