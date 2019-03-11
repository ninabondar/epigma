import { combineReducers } from "redux";
import shapes from "./shape";

export default combineReducers({ shapes });

export const getActiveShapes = state => state.shapes;
