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

const CanvasTransform = ({ children }) => {
  const [matrix, setMatrix] = useState(getTransformMatrix(1, 0, 0));
  const [isDragging, setDragging] = useState(false);

  const startDrag = ({ pageX, pageY }, matrix) => {
    setDragging(true);

    const startX = pageX - matrix[2][0];
    const startY = pageY - matrix[2][1];
    const handleMouseMove = ({ pageX: endX, pageY: endY }) => {
      const x = endX - startX;
      const y = endY - startY;
      const newMatrix = [matrix[0], matrix[1], [x, y, 1]];
      setMatrix(newMatrix);
    };

    const handleMouseUp = () => {
      setDragging(false);
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  const handleMouseDown = ev => {
    if (!isDragging) {
      startDrag(ev, matrix);
    }
  };

  return (
    <div onMouseDown={handleMouseDown}>
      <TransformContext.Provider value={transformPoint(matrix)}>
        {children}
      </TransformContext.Provider>
    </div>
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
  <CanvasTransform>
    <svg
      className={b()}
      // onClick={addPath}
    >
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

      {shapes.length < 0 && <text dy={20}>Click to start drawing.</text>}
    </svg>
  </CanvasTransform>
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
