import { configureStore } from "@reduxjs/toolkit";
import animeReducer from "./anime/animesSlice";

const store = configureStore({
  reducer: {
    anime: animeReducer,
  },
});

export default store;
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
