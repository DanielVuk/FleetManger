import { registerRootComponent } from "expo";
import * as React from "react";
import { Provider as PaperProvider } from "react-native-paper";
import { theme } from "./src/styles/theme";
import App from "./App";
import { AppProvider } from "./AppContext";

function Main() {
  return (
    <AppProvider>
      <PaperProvider theme={theme}>
        <App />
      </PaperProvider>
    </AppProvider>
  );
}

registerRootComponent(Main);
