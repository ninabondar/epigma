import React, { useContext } from "react";
import { TransformContext } from "../Canvas";

import { serializePath } from "../../utils/helper";
import BEM from "../../utils/BEM";
import "./Shape.scss";
const b = BEM("Shape");

const ShapeView = ({ path, onSelect }) => {
  const tansformation = useContext(TransformContext);

  return (
    <g
      className={b()}
      onClick={ev => {
        ev.preventDefault();
        ev.stopPropagation();
        return onSelect();
      }}
    >
      <path
        className={b("path")}
        d={serializePath(path.points.map(tansformation))}
      />
    </g>
  );
};

export default ShapeView;
