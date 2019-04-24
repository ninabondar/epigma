import React from "react"
import { Link } from "react-router-dom"
import { compose, withHandlers, withState } from "recompose"
import { connect } from "react-redux"
import BEM from "../../utils/BEM"

import "./DocumentList.scss"
import { getAllExistingDocuments } from "../../reducers"
import { createDocument } from "../../actions/documents"

const b = BEM("DocumentList")

const DocumentList = ({
  documentsList,
  onNameChange,
  onNameSubmit,
  newDocumentName
}) => {
  return (
    <>
      <ul className={b()}>
        {documentsList.map(
          ({ id, title }) =>
            console.log(id, title) || (
              <li className={b("document")} key={id}>
                <Link to={"/edit/" + id}>{title}</Link>
              </li>
            )
        )}
      </ul>
      <form className={b("create-document-form")} onSubmit={onNameSubmit}>
        <input
          required
          className={b("document-new-name")}
          name={"documentName"}
        />
        <button className={b("create-document")} type={"submit"}>
          CREATE DOCUMENT
        </button>
      </form>
    </>
  )
}

const enhancer = compose(
  connect(
    state => ({ documentsList: getAllExistingDocuments(state) }),
    { createDocument }
  ),
  withState("newDocumentName", "setNewDocumentName", ""),
  withHandlers({
    onNameSubmit: ({ createDocument }) => ev => {
      ev.preventDefault()
      const { value } = ev.target.documentName
      if (value) {
        createDocument(value)
      }

      ev.target.documentName.value = ""
    }
  })
)

export default enhancer(DocumentList)
