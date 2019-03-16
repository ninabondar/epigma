/* @flow */
import React, { useContext, useEffect, useState } from "react";

import { append, last } from "ramda";
import {
  createPoint,
  removePoint,
  serializePath,
  getBoundingBoxFromShape
} from "../../utils/helper";
import Vertex from "../Vertex";

import { TransformContext } from "../Canvas";
import Selection from "../Selection/Selection";

import BEM from "../../utils/BEM";
import "./Shape.scss";
import { ShapeView } from "./ShapeView";
const b = BEM("Shape");

const ShapeEdit = props => {
  const { offset, onChange } = props;
  const tansformation = useContext(TransformContext);

  const [path, setPath] = useState(props.path);
  const [mode, setMode] = useState(path.id === undefined ? "create" : "edit");
  const [selectedVertex, setSelectedVertex] = useState(null);
  const [ghostPoint, setGhostPoint] = useState(
    mode === "create" ? last(path.points) : null
  );

  const boundingBox = getBoundingBoxFromShape(path);
  let points = mode === "create" ? [...path.points, ghostPoint] : path.points;

  useEffect(() => setPath(props.path), [props.path]);

  useEffect(
    () => {
      const keyHandler = ev => {
        const { key } = ev;

        switch (key) {
          case "Backspace":
          case "Delete": {
            ev.preventDefault();

            if (selectedVertex !== null) {
              setPath({
                ...path,
                points: removePoint(path.points, selectedVertex)
              });
            }
            return;
          }

          case "Escape":
          case "Enter": {
            ev.preventDefault();
            return onChange({ ...path });
          }
        }
      };

      const handleDocumentClick = ev => setSelectedVertex(null);

      const drawPoint = ({ pageX: x, pageY: y }) => {
        const point = createPoint({ x: x - offset.x, y: y - offset.y });
        setPath({
          ...path,
          points: append(point, path.points)
        });
      };

      document.body.addEventListener("mousedown", handleDocumentClick);
      document.addEventListener("keydown", keyHandler);

      if (path.id === undefined) {
        document.addEventListener("click", drawPoint);
      }

      return () => {
        document.removeEventListener("keydown", keyHandler);
        document.removeEventListener("click", drawPoint);
        document.body.removeEventListener("mousedown", handleDocumentClick);
      };
    },
    [path, selectedVertex]
  );

  return (
      <g className={b(["edit"])}>

        {mode === "select" && <Selection boundingRect={boundingBox} />}
        <ShapeView
          onClick={() => setMode("select")}
          path={path}
          className={b(["edit"])}
        />
        {points.map(tansformation).map((point, index) => (
          <Vertex
            key={index}
            selected={selectedVertex === index}
            point={point}
            onSelect={() => setSelectedVertex(index)}
            onChange={point =>
              setPath({
                ...path,
                points: [
                  ...points.slice(0, index),
                  tansformation.invert(point),
                  ...points.slice(index + 1)
                ]
              })
            }
          />
        ))}

        {mode === "create" ? (
          <Vertex
            draggable={true}
            point={ghostPoint}
            onChange={point => setGhostPoint(point)}
          />
        ) : null}
      </g>

  );
};

export default ShapeEdit;
