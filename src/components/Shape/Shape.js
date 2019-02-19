import React from "react";

import ShapeView from "./ShapeView";
import ShapeEdit from "./ShapeEdit";

const Shape = ({ edit, ...props }) => {
    console.log(edit);
    return edit ? <ShapeEdit {...props} /> : <ShapeView {...props} />;
};

export default Shape;
