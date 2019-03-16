import React, { useContext } from "react";
import { TransformContext } from "../Canvas";
import { withHandlers } from "recompose";

import { serializePath } from "../../utils/helper";
import { serializeTransformationMatrix } from "../../utils/matrix";

import BEM from "../../utils/BEM";
import "./Shape.scss";
const b = BEM("Shape");

export const ShapeView = ({ path, onClick, className = b()}) => {
  const tansformation = useContext(TransformContext);
  return (
    <g
      transform={serializeTransformationMatrix(tansformation.matrix)}
      className={className}
      onClick={onClick}
    >
      <path className={b("path")} d={serializePath(path.points)} />
    </g>
  );
};

const enhancer = withHandlers({
  onClick: ({ onSelect }) => ev => {
    ev.preventDefault();
    ev.stopPropagation();
    return onSelect();
  }
});

export default enhancer(ShapeView);
