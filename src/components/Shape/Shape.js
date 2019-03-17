// @flow

import { branch, renderComponent, compose, withProps } from "recompose"

import ShapeView from "./ShapeView"
import ShapeEdit from "./ShapeEdit"
import ShapeCreate from "./ShapeCreate"

const Shape = compose(
  withProps( ({mode}) => console.log("==>",mode)),
  branch(({ mode }) => mode === "EDIT", renderComponent(ShapeEdit)),
  branch(({ mode }) => mode === "CREATE", renderComponent(ShapeCreate))
)(ShapeView)

export default Shape
