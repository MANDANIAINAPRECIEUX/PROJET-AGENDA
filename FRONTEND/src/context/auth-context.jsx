import { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

const AuthContextProvider = ({ children }) => {
  const [theme, setTheme] = useState("light");
  
  return (
    <AuthContext.Provider value={{ theme, setTheme }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContextProvider;
