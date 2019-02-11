import React from 'react';

class Line extends React.Component {
    constructor(props) {
        super(props);
    }

    render () {
      const {x1,y1,x2,y2} = this.props;
      return (
          <line x1={x1} y1={y1} x2={x2} y2={y2} />
      )
  }
}

export default Line;