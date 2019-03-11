const defaultState = {};

export const setEditIndex = (state = defaultState, action) => {
  return {
    ...state,
    editIndex: action.editIndex
  };
};

export default (state = defaultState, action) => {
  switch (action.type) {
    case "CHANGE_ACTIVE_SHAPE":
      return action.shape;

    default:
      return state;
  }
};
