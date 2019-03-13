import React, { Component } from "react";
import BEM from "../../utils/BEM";

import "./Selection.scss";

const b = BEM("Selection");
class Selection extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { boundingRect, children, isActive } = this.props;
    const [minY, maxX, maxY, minX] = boundingRect.map(p => Math.round(p));
    const connerSizeCntrlSize = 10;
    console.log(isActive);
    return (
      <g className={isActive===true ? "Selection_active" : "Selection"} >
        <line className={b("edge")} x1={minX} y1={minY} x2={maxX} y2={minY} />
        <line className={b("edge")} x1={maxX} y1={minY} x2={maxX} y2={maxY} />
        <line className={b("edge")} x1={minX} y1={maxY} x2={maxX} y2={maxY} />
        <line className={b("edge")} x1={minX} y1={minY} x2={minX} y2={maxY} />
        <rect
          className={b("vertex")}
          x={minX - connerSizeCntrlSize / 2}
          y={minY - connerSizeCntrlSize / 2}
          width={connerSizeCntrlSize}
          height={connerSizeCntrlSize}
        />
        <rect
          className={b("vertex")}
          x={maxX - (connerSizeCntrlSize / 2)}
          y={minY - (connerSizeCntrlSize / 2)}
          width={connerSizeCntrlSize}
          height={connerSizeCntrlSize}
        />
        <rect
          className={b("vertex")}
          x={maxX - (connerSizeCntrlSize / 2)}
          y={maxY - (connerSizeCntrlSize / 2)}
          width={connerSizeCntrlSize}
          height={connerSizeCntrlSize}
        />
        <rect
          className={b("vertex")}
          x={minX - (connerSizeCntrlSize / 2)}
          y={maxY - (connerSizeCntrlSize / 2)}
          width={connerSizeCntrlSize}
          height={connerSizeCntrlSize}
        />
        {children}
      </g>
    );
  }
}

export default Selection;
