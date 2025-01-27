import { registerRootComponent } from "expo";
import * as React from "react";
import App from "./App";
import AppProvider from "./src/contexts/AppProvider";

function Main() {
  return (
    <AppProvider>
      <App />
    </AppProvider>
  );
}

registerRootComponent(Main);
