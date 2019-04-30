// @flow
import React from "react"

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
import { compose, withHandlers, withProps } from "recompose"
import { connect } from "react-redux"

import BEM from "../../utils/BEM"
import { withRouter } from "react-router"

import "./ToolPanel.scss"
import { clone } from "ramda"

const b = BEM("ToolPanel")

const ToolPanel = ({
  isCreateToggledOn,
  toggleCreateMode,
  undo,
  redo,
  isUndo,
  isRedo,
  documentTitle,
  changeActiveDocTitle
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

    <div className={b("doc-name")}>
      <form  className={b("change-name-form")} onSubmit={changeActiveDocTitle}>
        <input
          className={b("change-name")}
          name="newTitle"
          type="text"
          placeholder="new name"
        />
      </form>
      {documentTitle}
    </div>
  </aside>
)

const enhancer = compose(
  withRouter,
  withProps(({ match }) => ({ documentId: match.params.documentId })),
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
    changeActiveDocTitle: ({ activeDocument, changeEditorDocument }) => e => {
      e.preventDefault()
      const newDocument = clone(activeDocument)
      const { newTitle } = e.target

      newDocument.title = newTitle.value
      changeEditorDocument(newDocument)

      newTitle.value = ""
    }
  })
)

export default enhancer(ToolPanel)
