// src/redux/eventSlice.js
import { createSlice } from "@reduxjs/toolkit";

const eventSlice = createSlice({
  name: "events",
  initialState: {
    byId: {},        // { [eventId]: eventObject }
  },
  reducers: {
    setEvent: (state, action) => {
      const event = action.payload;
      if (!event?._id) return;
      state.byId[event._id] = event;
    },
    removeEvent: (state, action) => {
      const eventId = action.payload;
      delete state.byId[eventId];
    },
    clearEvents: (state) => {
      state.byId = {};
    },
  },
});

export const { setEvent, removeEvent, clearEvents } = eventSlice.actions;
export default eventSlice.reducer;
