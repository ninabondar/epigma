// @flow
import React from "react"
import { withRouter } from "react-router"
import { connect } from "react-redux"
import { compose, withHandlers, withProps, withState } from "recompose"
import { clone } from "ramda"

import {
  changeEditorDocument,
  changeMode,
  editorRedo,
  editorUndo
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
  isCreateToggledOn,
  toggleCreateMode,
  undo,
  redo,
  isUndo,
  isRedo,
  documentTitle,
  changeActiveDocTitle,
  isRenamed,
  toggleIsRenamed
}) => (
  <aside className={b()}>
    <button
      className={b("control", {
        "create-shape": true,
        "toggled-on": isCreateToggledOn
      })}
      onClick={toggleCreateMode}
    >
      DRAW
    </button>
    <button
      disabled={!isUndo}
      className={b("control", { undo: true, disabled: !isUndo })}
      onClick={undo}
    >
      UNDO
    </button>
    <button
      disabled={isRedo}
      className={b("control", { redo: true, disabled: isRedo })}
      onClick={redo}
    >
      REDO
    </button>

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
    { changeMode, undo: editorUndo, redo: editorRedo, changeEditorDocument }
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
      newDocument.title = newTitle.value === "" ? title : newTitle.value
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
