import React from "react";

import ShapeView from "./ShapeView";
import ShapeEdit from "./ShapeEdit";

const Shape = ({ edit, ...props }) =>
  edit ? <ShapeEdit {...props} /> : <ShapeView {...props} />;

export default Shape;
