// @flow
import React from "react"

import { changeMode, editorRedo, editorUndo } from "../../actions"
import {
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

const b = BEM("ToolPanel")

const ToolPanel = ({
  isCreateToggledOn,
  toggleCreateMode,
  undo,
  redo,
  isUndo,
  isRedo,
  documentTitle
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

    <div className={b("doc-name")}>{documentTitle}</div>
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
      documentTitle: getOpenDocumentTitle(state)
    }),
    { changeMode, undo: editorUndo, redo: editorRedo }
  ),
  withHandlers({
    toggleCreateMode: ({ isCreateToggledOn, changeMode }) => () =>
      isCreateToggledOn ? changeMode("VIEW") : changeMode("CREATE")
  })
)

export default enhancer(ToolPanel)
