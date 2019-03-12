import React, { Component } from "react";
import BEM from "../../utils/BEM";

import "./Selection.scss";

const b = BEM("Selection");
class Selection extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { boundingRect, children } = this.props;
    const [minY, maxX, maxY, minX] = boundingRect.map(p => Math.round(p));
    const conerSizeCntrlSize = 10;
    console.log(boundingRect);
    return (
      <g className={b()}>
        <line className={b("edge")} x1={minX} y1={minY} x2={maxX} y2={minY} />
        <line className={b("edge")} x1={maxX} y1={minY} x2={maxX} y2={maxY} />
        <line className={b("edge")} x1={minX} y1={maxY} x2={maxX} y2={maxY} />
        <line className={b("edge")} x1={minX} y1={minY} x2={minX} y2={maxY} />
        <rect
          className={b("vertex")}
          x={minX - conerSizeCntrlSize / 2}
          y={minY - conerSizeCntrlSize / 2}
          width={conerSizeCntrlSize}
          height={conerSizeCntrlSize}
        />
        <rect
          className={b("vertex")}
          x={maxX - (conerSizeCntrlSize / 2)}
          y={minY - (conerSizeCntrlSize / 2)}
          width={conerSizeCntrlSize}
          height={conerSizeCntrlSize}
        />
        <rect
          className={b("vertex")}
          x={maxX - (conerSizeCntrlSize / 2)}
          y={maxY - (conerSizeCntrlSize / 2)}
          width={conerSizeCntrlSize}
          height={conerSizeCntrlSize}
        />
        <rect
          className={b("vertex")}
          x={minX - (conerSizeCntrlSize / 2)}
          y={maxY - (conerSizeCntrlSize / 2)}
          width={conerSizeCntrlSize}
          height={conerSizeCntrlSize}
        />
        {children}
      </g>
    );
  }
}

export default Selection;
