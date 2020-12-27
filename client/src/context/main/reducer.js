export const initialState = {
  mctDocument: null,
  files: [],
  exportedBlog: null,
  publishedDraft: null,
  isExporting: false,
  isPublishing: false
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
    case "INIT_EXPORT":
      return {
        ...state,
        isExporting: true,
      };
    case "SET_EXPORT":
      return {
        ...state,
        exportedBlog: action.payload.exportedBlog,
        isExporting: false
      };
    case "INIT_PUBLISH":
      return {
        ...state,
        isPublishing: true,
      };
    case "SET_PUBLISH":
      return {
        ...state,
        publishedDraft: action.payload.publishedDraft,
        isPublishing: false
      };
    default:
      return state;
  }
};
