// src/main.jsx
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css"; // Ceci est pour les styles globaux de base
import { BrowserRouter } from "react-router-dom";
import ColorContextProvider from "./context/color-context.jsx";
import { Provider } from "react-redux";
 import store from "./redux/store.js";

ReactDOM.createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <BrowserRouter>
      <React.StrictMode>
        <ColorContextProvider>
          <App />
        </ColorContextProvider>
      </React.StrictMode>
    </BrowserRouter>
  </Provider>
);
