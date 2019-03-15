/* @flow */

import React, { createContext, useState } from "react";
import { connect } from "react-redux";
import { compose, withHandlers, withState } from "recompose";
import uuid from "uuid";

import { createPoint, createShape } from "../../utils/helper";
import Shape from "../Shape";
import "./Canvas.scss";
import BEM from "../../utils/BEM";
import { changeActiveShape } from "../../actions";
import { getActiveShapes } from "../../reducers";
import { getTransformMatrix, transformPoint } from "../../utils/matrix";
const b = BEM("Canvas");

const getId = () => uuid();

export const TransformContext = createContext();
const CanvasTransform = ({children}) => {
  const [matrix, setMatrix] = useState(getTransformMatrix(1, 0, 0));
  return (
    <TransformContext.Provider value={transformPoint(matrix)}>
      {children}
    </TransformContext.Provider>
  );
};

const Canvas = ({
  shapes,
  offset,
  editIndex,
  setEditIndex,
  setShapes,
  addPath
}) => (
  <svg className={b()} onClick={addPath}>
    <CanvasTransform>
      {shapes.map((shape, index) => (
        <Shape
          onSelect={() => setEditIndex(index)}
          onChange={path => {
            const id = path.id || getId();

            setEditIndex(null);

            setShapes([
              ...shapes.slice(0, editIndex),
              { id, ...path },
              ...shapes.slice(editIndex + 1)
            ]);
          }}
          key={index}
          edit={editIndex === index}
          offset={offset}
          path={shape}
        />
      ))}
    </CanvasTransform>

    {shapes.length < 0 && <text dy={20}>Click to start drawing.</text>}
  </svg>
);

const enhancer = compose(
  connect(
    state => ({ shapes: getActiveShapes(state) }),
    { setShapes: changeActiveShape }
  ),

  withState("offset", "setOffset", { x: 0, y: 0 }),
  withState("editIndex", "setEditIndex", null),

  withHandlers({
    addPath: ({ shapes, offset, setEditIndex, setShapes, editIndex }) => ({
      pageX: x,
      pageY: y
    }) => {
      if (editIndex !== null) return;

      const point = createPoint({ x: x - offset.x, y: y - offset.y });

      setEditIndex(shapes.length);
      setShapes([...shapes, createShape(point)]);
    }
  })
);

export default enhancer(Canvas);
