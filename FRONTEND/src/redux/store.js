import { configureStore } from "@reduxjs/toolkit";
import rdvReducer from "../features/DateRendezVousSlice";

const store = configureStore({
  reducer: {
    rdv: rdvReducer, // nom du "state global" dans Redux
  },
});

export default store;
