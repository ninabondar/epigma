import React, { Component } from "react";
import BEM from "../../utils/BEM";

import "./Selection.scss";

const b = BEM("Selection");
const Selection = ({ boundingRect, children, isActive }) => {
  const [minY, maxX, maxY, minX] = boundingRect.map(p => Math.round(p));
  const connerControlSize = 10;

  return (
    <g className={isActive === true ? "Selection_active" : "Selection"}>
      <line className={b("edge")} x1={minX} y1={minY} x2={maxX} y2={minY} />
      <line className={b("edge")} x1={maxX} y1={minY} x2={maxX} y2={maxY} />
      <line className={b("edge")} x1={minX} y1={maxY} x2={maxX} y2={maxY} />
      <line className={b("edge")} x1={minX} y1={minY} x2={minX} y2={maxY} />
      <rect
        className={b("vertex")}
        x={minX - connerControlSize / 2}
        y={minY - connerControlSize / 2}
        width={connerControlSize}
        height={connerControlSize}
      />
      <rect
        className={b("vertex")}
        x={maxX - connerControlSize / 2}
        y={minY - connerControlSize / 2}
        width={connerControlSize}
        height={connerControlSize}
      />
      <rect
        className={b("vertex")}
        x={maxX - connerControlSize / 2}
        y={maxY - connerControlSize / 2}
        width={connerControlSize}
        height={connerControlSize}
      />
      <rect
        className={b("vertex")}
        x={minX - connerControlSize / 2}
        y={maxY - connerControlSize / 2}
        width={connerControlSize}
        height={connerControlSize}
      />
      {children}
    </g>
  );
};

export default Selection;
