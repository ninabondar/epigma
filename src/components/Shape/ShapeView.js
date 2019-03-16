import React, { useContext } from "react";
import { TransformContext } from "../Canvas";

import { serializePath } from "../../utils/helper";
import { serializeTransformationMatrix } from "../../utils/matrix";

import BEM from "../../utils/BEM";
import "./Shape.scss";
const b = BEM("Shape");

const ShapeView = ({ path, onSelect }) => {
  const tansformation = useContext(TransformContext);
  return (
    <g
      transform={serializeTransformationMatrix(tansformation.matrix)}
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
};

export default ShapeView;
