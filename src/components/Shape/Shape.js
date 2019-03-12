import React from "react";

import ShapeView from "./ShapeView";
import ShapeEdit from "./ShapeEdit";
import { branch, renderComponent } from "recompose";

const Shape = branch(
  ({ edit }) => edit,
  renderComponent(ShapeEdit),
  renderComponent(ShapeView)
)();

export default Shape;
