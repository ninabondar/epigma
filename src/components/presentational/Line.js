import React from 'react';

class Line extends React.Component {
    constructor(props) {
        super(props);
    }

    render () {
      const {x1,y1,x2,y2} = this.props;
      return (
          <line x1={x1} y1={y1} x2={x2} y2={y2} style="stroke:rgb(255,0,0);stroke-width:2" />
      )
  }
}

export default Line;