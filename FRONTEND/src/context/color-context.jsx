import { createContext, useState } from "react";

export const ColorContext = createContext();

const ColorContextProvider = ({ children }) => {
  const [theme, setTheme] = useState("light");
  return (
    <ColorContext.Provider value={{ theme, setTheme }}>
      {children}
    </ColorContext.Provider>
  );
};

export default ColorContextProvider;
