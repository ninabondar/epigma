import React from "react"
import { Link } from "react-router-dom"
import { compose, withHandlers, withState } from "recompose"
import { connect } from "react-redux"
import ToolPanel from "../ToolPanel/ToolPanel"

import { getAllExistingDocuments } from "../../reducers"
import {
  createDocument,
  receiveDocumentsSuccess,
  fetchDocuments
} from "../../actions/documents"

import BEM from "../../utils/BEM"
import "./DocumentList.scss"
const b = BEM("DocumentList")

const DocumentList = ({ documentsList, onNameSubmit }) => (
  <>
    <section className={b()}>
      {documentsList.map(({ id, title, createdAt }) => (
        <Link to={"/edit/" + id} key={id}>
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
    { createDocument, fetchDocuments }
  ),
  withState("newDocumentName", "setNewDocumentName", ""),
  withHandlers({
    onNameSubmit: ({ createDocument, fetchDocuments }) => ev => {
      ev.preventDefault()
      const { value } = ev.target.documentName
      const a = fetchDocuments()
      console.log(a)
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
