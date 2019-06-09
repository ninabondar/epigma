import React from "react"
import { Link } from "react-router-dom"
import { compose, withHandlers, withState } from "recompose"
import { connect } from "react-redux"
import ToolPanel from "../ToolPanel/ToolPanel"

import { getAllExistingDocuments } from "../../reducers"
import { createNewDocument, fetchDocuments } from "../../actions/documents"

import BEM from "../../utils/BEM"
import "./DocumentList.scss"
const b = BEM("DocumentList")

const DocumentList = ({ documentsList, onNameSubmit, fetchDocuments }) => {
  fetchDocuments()
  return (
    <section className={b()}>
      {documentsList.map(({ id, title, createdAt }, i) => (
        <Link to={"/edit/" + id} key={i}>
          <div className={b("document")}>
            <div className={b("doc-title")}> {title}</div>
            <div className={b("doc-side-info")}>{String(createdAt)}</div>
          </div>
        </Link>
      ))}
      <div className={b("document")}>
        <form className={b("create-document-form")} onSubmit={onNameSubmit}>
          <input
            required
            className={b("document-new-name")}
            name={"documentName"}
            autoComplete={"off"}
            placeholder={"new document"}
          />
          <button className={b("create-document")} type={"submit"}>
            new document
          </button>
        </form>
      </div>
    </section>
  )
}

const DocumentListScreen = () => (
  <>
    <ToolPanel isDraftScreen={true} />
    <DocumentList />
  </>
)

const enhancer = compose(
  connect(
    state => ({ documentsList: getAllExistingDocuments(state) }),
    { createNewDocument, fetchDocuments }
  ),
  withState("newDocumentName", "setNewDocumentName", ""),
  withHandlers({
    onNameSubmit: ({ createNewDocument, fetchDocuments }) => ev => {
      ev.preventDefault()
     // fetchDocuments()
      const { value } = ev.target.documentName
      if (value) {
        if (/^\s*$/.test(value)) {
          createNewDocument("new document")
        } else createNewDocument(value)
      }

      ev.target.documentName.value = ""
    }
  })
)

export default enhancer(DocumentList)
