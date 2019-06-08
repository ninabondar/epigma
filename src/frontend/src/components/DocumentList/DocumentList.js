import React from "react"
import { Link } from "react-router-dom"
import { compose, withHandlers, withState } from "recompose"
import { connect } from "react-redux"
import BEM from "../../utils/BEM"

import "./DocumentList.scss"
import { getAllExistingDocuments } from "../../reducers"
import { createDocument } from "../../actions/documents"
import ToolPanel from "../ToolPanel/ToolPanel"

const b = BEM("DocumentList")

const DocumentList = ({ documentsList, onNameSubmit }) => (
  <>
    <section className={b()}>
      {documentsList.map(({ id, title, createdAt }) => (
        <Link key={id} to={"/edit/" + id}>
          <div className={b("document")}>
            <div className={b("doc-title")}> {title}</div>
            <div className={b("doc-side-info")}>{String(createdAt)}</div>
          </div>
        </Link>
      ))}
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
    </section>
  </>
)

const DocumentListScreen = () => (
  <>
    <ToolPanel isDraftScreen={true} />
    <DocumentList />
  </>
)

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
        if (/^\s*$/.test(value)) {
          createDocument("new document")
        } else createDocument(value)
      }

      ev.target.documentName.value = ""
    }
  })
)

export default enhancer(DocumentList)
