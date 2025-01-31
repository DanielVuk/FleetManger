import React, { createContext, useState } from "react";

const initialState = {
  loading: false,
  user: null,
  fleet: [],
};

const AppContext = createContext();

const AppStateProvider = ({ children }) => {
  const [state, setState] = useState(initialState);

  return (
    <AppContext.Provider value={[state, setState]}>
      {children}
    </AppContext.Provider>
  );
};

export { AppContext, AppStateProvider };
