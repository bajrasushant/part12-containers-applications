import { createSlice } from "@reduxjs/toolkit";

const initialState = "";

const notificationSlice = createSlice({
  name: "notification",
  initialState,
  reducers: {
    newNotification(state, action) {
      return action.payload;
    },
    clearNotification() {
      return "";
    },
  },
});

export const setNotification = (content) => {
  return (dispatch) => {
    dispatch(newNotification(content));
    setTimeout(() => {
      dispatch(clearNotification());
    }, 5000);
  };
};

export const { newNotification, clearNotification } = notificationSlice.actions;
export default notificationSlice.reducer;
