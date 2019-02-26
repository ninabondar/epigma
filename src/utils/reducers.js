import {createPoint, createShape} from "./helper";

export const editPath = (state={}, action) => {
    switch(action.type) {
        case "ADD_PATH":
            const {x ,y} = action;
            const { shapes, offset } = state;
            const point = createPoint({ x: x - offset.x, y: y - offset.y });
            return {
                ...state,
                shapes: [...shapes, createShape(point)],
                editIndex: shapes.length,
            };

        default:
            return state;
    }
};

