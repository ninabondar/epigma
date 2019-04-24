// @flow
import React from "react"

import { changeMode, editorRedo, editorUndo, undoShape } from "../../actions"
import {
  getCurrentHistoryPointer,
  getEditorMode,
  getHistoryLength
} from "../../reducers"
import { compose, withHandlers } from "recompose"
import { connect } from "react-redux"

import BEM from "../../utils/BEM"
import "./ToolPanel.scss"

const b = BEM("ToolPanel")

const ToolPanel = ({
  isCreateToggledOn,
  toggleCreateMode,
  undo,
  redo,
  isUndo,
  isRedo
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

    <div className={b("doc-name")} />
  </aside>
)

const enhancer = compose(
  connect(
    state => ({
      isCreateToggledOn: getEditorMode(state) === "CREATE",
      isUndo:
        !!getCurrentHistoryPointer(state),
      isRedo:
        getCurrentHistoryPointer(state) !== null &&
        getCurrentHistoryPointer(state) === getHistoryLength(state) - 1
    }),
    { changeMode, undo: editorUndo, redo: editorRedo }
  ),
  withHandlers({
    toggleCreateMode: ({ isCreateToggledOn, changeMode }) => () =>
      isCreateToggledOn ? changeMode("VIEW") : changeMode("CREATE")
  })
)

export default enhancer(ToolPanel)
