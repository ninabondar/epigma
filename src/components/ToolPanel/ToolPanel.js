// @flow
import React from "react"

import { changeMode, editorRedo, editorUndo, undoShape } from "../../actions"
import { getEditorMode } from "../../reducers"
import { compose, withHandlers } from "recompose"
import { connect } from "react-redux"

import BEM from "../../utils/BEM"
import "./ToolPanel.scss"

const b = BEM("ToolPanel")

const ToolPanel = ({ isCreateToggledOn, toggleCreateMode, undo, redo }) => (
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
    <button className={b("control", ["undo"])} onClick={undo}>
      UNDO
    </button>
    <button className={b("control", ["redo"])} onClick={redo}>
      REDO
    </button>

    <div className={b("doc-name")} />
  </aside>
)

const enhancer = compose(
  connect(
    state => ({
      isCreateToggledOn: getEditorMode(state) === "CREATE"
    }),
    { changeMode, undo: editorUndo, redo: editorRedo }
  ),
  withHandlers({
    toggleCreateMode: ({ isCreateToggledOn, changeMode }) => () =>
      isCreateToggledOn ? changeMode("VIEW") : changeMode("CREATE")
  })
)

export default enhancer(ToolPanel)
