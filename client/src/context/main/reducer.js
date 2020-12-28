export const initialState = {
  mctDocument: null,
  files: [],
  exportedBlog: null,
  publishedDraft: null,
  publishedBlog: null,
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
    case "INIT_PUBLISH_MEDIUM_DRAFT":
      return {
        ...state,
        isPublishing: true,
      };
    case "SET_PUBLISH_MEDIUM_DRAFT":
      return {
        ...state,
        publishedDraft: action.payload.publishedDraft,
        isPublishing: false
      };
    case "INIT_PUBLISH_JEKYLL_BLOG":
      return {
        ...state,
        isPublishing: true,
      };
    case "SET_PUBLISH_JEKYLL_BLOG":
      return {
        ...state,
        publishedBlog: action.payload.publishedBlog,
        isPublishing: false
      };
    default:
      return state;
  }
};
