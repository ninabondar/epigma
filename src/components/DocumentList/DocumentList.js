import React from "react"
import { Link } from "react-router-dom"
import { compose } from "recompose"
import { connect } from "react-redux"
import BEM from "../../utils/BEM"

import "./DocumentList.scss"
import { getAllExistingDocuments } from "../../reducers"

const b = BEM("DocumentList")

const DocumentList = ({ documentsList }) => {
  return (
    <ul className={b()}>
      {documentsList.map(({ id, title }) => (
        <li className={b("document")} key={id}>
          <Link to={"/edit/" + id}>{title}</Link>
    </li>
      ))}
    </ul>
  )
}

const enhancer = compose(
  connect(state => ({ documentsList: getAllExistingDocuments(state) }))
)

export default enhancer(DocumentList)
