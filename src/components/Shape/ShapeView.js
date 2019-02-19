import React from "react";

import { serializePath } from "../../utils/helper";
import BEM from "../../utils/BEM";
import "./Shape.scss";
const b = BEM("Shape");

const ShapeView = ({ path, onSelect }) => (
  <g
    className={b()}
    onClick={ev => {
      ev.preventDefault();
      ev.stopPropagation();
      return onSelect();
    }}
  >
    <path className={b("path")} d={serializePath(path.points)} />
  </g>
);

export default ShapeView;
