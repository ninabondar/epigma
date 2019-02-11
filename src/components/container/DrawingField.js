import React, {Component} from 'react';
import Dot from '../presentational/Dot';
import Line from '../presentational/Line';


class DrawingField extends Component {
    constructor(props) {
        super(props);

        this.state = {
            dots: []
        };
    }

    drawPoint(event){
        console.log(event, event.pageX, 'screenX');
        const x = event.pageX;
        const y = event.pageY;
        this.setState({
            dots: [
                {
                    x: x,
                    y: y
                }
            ]
        })
    };

    render() {
        const {dots} = this.state;
        return (
            <svg onClick={this.drawPoint} className="field">
                {console.info(dots)}
            </svg>
        )
    }

}

export default DrawingField;