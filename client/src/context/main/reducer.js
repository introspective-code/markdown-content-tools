export const initialState = {
  mctDocument: null,
  files: []
};

export const reducer = (state, action) => {
  switch (action.type) {
    case "SET_MCT_DOCUMENT":
      return {
        ...state,
        mctDocument: action.payload.mctDocument,
      };
    case "SET_LISTED_FILES":
      return {
        ...state,
        files: action.payload.files,
      };
    default:
      return state;
  }
};
