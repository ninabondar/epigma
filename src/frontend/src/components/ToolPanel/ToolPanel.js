// @flow
import React from "react"
import { Link } from "react-router-dom"
import { withRouter } from "react-router"
import { connect } from "react-redux"
import { compose, withHandlers, withProps, withState } from "recompose"
import { clone } from "ramda"

import {
  changeMode,
  editorRedo,
  editorUndo,
  updateDocument
} from "../../actions"
import {
  getActiveDocument,
  getActiveDocumentId,
  getCurrentHistoryPointer,
  getEditorMode,
  getHistoryLength,
  getOpenDocumentTitle
} from "../../reducers"

import BEM from "../../utils/BEM"

import "./ToolPanel.scss"
import "./RenameDoc.scss"

const b = BEM("ToolPanel")
const bRename = BEM("RenameDoc")

const ToolPanel = ({
  isDraftScreen,
  isCreateToggledOn,
  toggleCreateMode,
  undo,
  redo,
  isUndo,
  isRedo,
  documentTitle,
  changeActiveDocTitle,
  isRenamed,
  toggleIsRenamed,
  setIsOptionsOpened,
  isOptionsOpened,
  changeEditorDocument,
  activeDocument
}) => (
  <aside className={b({ "draft-screen": isDraftScreen })}>
    <button
      className={b("control", {
        "options-menu": true,
        "toggled-on": isOptionsOpened
      })}
      onClick={() => setIsOptionsOpened(!isOptionsOpened)}
    />
    <button
      className={b("control", {
        "create-shape": true,
        "toggled-on": isCreateToggledOn
      })}
      onClick={toggleCreateMode}
    />
    <button
      disabled={!isUndo}
      className={b("control", { undo: true, disabled: !isUndo })}
      onClick={undo}
    />
    <button
      disabled={isRedo}
      className={b("control", { redo: true, disabled: isRedo })}
      onClick={redo}
    />
    <div className={b("options", { opened: isOptionsOpened })}>
      <Link
        className={b("options-item")}
        to={"/"}
        onClick={() => {
          changeEditorDocument(activeDocument)
        }}
      >
        Back to documents
      </Link>
    </div>

    <div className={bRename({ active: isRenamed })}>
      <form className={bRename("rename-form")} onSubmit={changeActiveDocTitle}>
        <input
          className={bRename("name-input")}
          name="newTitle"
          type="text"
          placeholder="new name"
          autoComplete="off"
        />
      </form>
      <span className={bRename("name")} onClick={toggleIsRenamed}>
        {documentTitle}
      </span>
    </div>
  </aside>
)

const enhancer = compose(
  withRouter,
  withProps(({ match }) => ({ documentId: match.params.documentId })),
  withState("isRenamed", "setIsRenamed", false),
  withState("isOptionsOpened", "setIsOptionsOpened", false),
  connect(
    state => ({
      isCreateToggledOn: getEditorMode(state) === "CREATE",
      isUndo: !!getCurrentHistoryPointer(state),
      isRedo:
        getCurrentHistoryPointer(state) !== null &&
        getCurrentHistoryPointer(state) === getHistoryLength(state) - 1,
      documentTitle: getOpenDocumentTitle(state),
      activeDocumentID: getActiveDocumentId(state),
      activeDocument: getActiveDocument(state)
    }),
    {
      changeMode,
      undo: editorUndo,
      redo: editorRedo,
      changeEditorDocument: updateDocument
    }
  ),
  withHandlers({
    toggleCreateMode: ({ isCreateToggledOn, changeMode }) => () =>
      isCreateToggledOn ? changeMode("VIEW") : changeMode("CREATE"),

    changeActiveDocTitle: ({
      activeDocument,
      changeEditorDocument,
      isRenamed,
      setIsRenamed
    }) => e => {
      e.preventDefault()
      const newDocument = clone(activeDocument)
      const { newTitle } = e.target
      const { title } = newDocument

      newDocument.title = /^\s*$/.test(newTitle.value) ? title : newTitle.value

      changeEditorDocument(newDocument)

      newTitle.value = ""
      setIsRenamed(!isRenamed)
    },

    toggleIsRenamed: ({ isRenamed, setIsRenamed }) => {
      setIsRenamed(!isRenamed)
    }
  })
)

export default enhancer(ToolPanel)
