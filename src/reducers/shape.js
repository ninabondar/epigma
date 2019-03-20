import undoable from "./historyEnhancer"

const defaultState = [
  {
    id: 1,
    points: [
      {
        x: 139,
        y: 157.3333282470703
      },
      {
        x: 424,
        y: 294.3333282470703
      },
      {
        x: 443,
        y: 42.33332824707031
      },
      {
        x: 186,
        y: 251.3333282470703
      },
      {
        x: 628,
        y: 174.3333282470703
      },
      {
        x: 141,
        y: 155.3333282470703
      }
    ],
    style: null
  }
]

export const setSelectedIndex = (state = defaultState, action) => {
  return {
    ...state,
    selectedIndex: action.selectedIndex
  }
}

export default undoable((state = defaultState, action) => {
  switch (action.type) {
    case "CHANGE_ACTIVE_SHAPE":
      return action.shape

    default:
      return state
  }
});
