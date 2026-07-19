import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  dateFormatted: "",
  time: "",
  nom: "",
  prenom: "",
  motif: "",
};

const RdvSlice = createSlice({
  name: "RDV", //anaran le slice
  initialState,

  reducers: {
    //reducers anl date ary am ChoixDeRdv: dateRDV: "...", heureRDV:"..."
    setDates: (state, action) => {
      state.dateFormatted = action.payload.dateFormatted;
      state.time = action.payload.time;
    },
    //reducers anl date ary am FormulaireDeReservation: nom: "...", prenom:"...", motif:"..."
    setPatient: (state, action) => {
      state.nom = action.payload.nom;
      state.prenom = action.payload.prenom;
      state.motif = action.payload.motif;
    },
    resetRDV: (state) => {
      state.dateFormatted = "";
      state.time = "";
      state.nom = "";
      state.prenom = "";
      state.motif = "";
    },
  },
});

export const { setDates, setPatient, resetRDV } = RdvSlice.actions;
export default RdvSlice.reducer;
