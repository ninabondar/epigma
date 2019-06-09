import React from "react"
import { connect } from "react-redux"
import { Link } from "react-router-dom"
import {
  compose,
  branch,
  withHandlers,
  withProps,
  withState,
  renderComponent
} from "recompose"
import LoadingDocumentList from "./LoadingDocumentList"
import { getAllExistingDocuments, getIsFetching } from "../../reducers"
import {
  createNewDocument,
  fetchDocuments,
  removeDocumentById
} from "../../actions/documents"

import BEM from "../../utils/BEM"
import "./DocumentList.scss"
const b = BEM("DocumentList")

const DocumentsListFetched = ({
  documentsList,
  onNameSubmit,
  handleMoreClick
}) => (
  <section className={b()}>
    {documentsList.map(({ id, title, createdAt, _id }, i) => {
      if (title && _id) {
        return (
          <Link to={"/edit/" + id} key={i}>
            <div className={b("document")}>
              <div className={b("doc-title")}>{title}</div>
              <div className={b("doc-side-info")}>
                <small>{createdAt}</small>
                <button
                  className={b("doc-more")}
                  onClick={ev => {
                    handleMoreClick(ev, _id)
                  }}
                />
              </div>
            </div>
          </Link>
        )
      }
    })}
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

const DocumentList = compose(
  branch(({ isFetching }) => isFetching, renderComponent(LoadingDocumentList)),
  branch(({ isFetching }) => !isFetching, renderComponent(DocumentsListFetched))
)(DocumentsListFetched)

const enhancer = compose(
  connect(
    state => ({
      documentsList: getAllExistingDocuments(state),
      isFetching: getIsFetching(state)
    }),
    { createNewDocument, fetchDocuments, removeDocumentById }
  ),
  withProps(({ documentsList, isFetching, fetchDocuments }) => {
    if (!isFetching && !(documentsList.length > 2)) {
      fetchDocuments()
    }
  }),
  withState("newDocumentName", "setNewDocumentName", ""),
  withHandlers({
    onNameSubmit: ({ createNewDocument }) => ev => {
      ev.preventDefault()
      const { value } = ev.target.documentName
      if (value) {
        if (/^\s*$/.test(value)) {
          createNewDocument("new document")
        } else createNewDocument(value)
      }

      ev.target.documentName.value = ""
    },
    handleMoreClick: ({ removeDocumentById }) => (ev, id) => {
      ev.nativeEvent.cancelBubble = true
      ev.preventDefault()
      removeDocumentById(id)
    }
  })
)

export default enhancer(DocumentList)
