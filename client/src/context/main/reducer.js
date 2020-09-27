export const initialState = {
  testPingCount: 0,
};

export const reducer = (state, action) => {
  switch (action.type) {
    case "incrementTestPingCount":
      return {
        ...state,
        testPingCount: state.testPingCount + 1,
      };
    default:
      return state;
  }
};
