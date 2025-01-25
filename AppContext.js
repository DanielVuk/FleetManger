import React, { createContext, useState } from "react";

const initialState = {
  loading: false,
  user: null,
};

const Context = createContext();

const AppProvider = ({ children }) => {
  const [state, setState] = useState(initialState);

  return (
    <Context.Provider value={[state, setState]}>{children}</Context.Provider>
  );
};

export { AppProvider, Context, initialState };
