// @flow
import { branch, renderComponent, compose } from "recompose"

import ShapeView from "./ShapeView"
import ShapeEdit from "./ShapeEdit"
import ShapeCreate from "./ShapeCreate"

const Shape = compose(
  branch(({ mode }) => mode === "EDIT", renderComponent(ShapeEdit)),
  branch(({ mode }) => mode === "CREATE", renderComponent(ShapeCreate))
)(ShapeView)

export default Shape
