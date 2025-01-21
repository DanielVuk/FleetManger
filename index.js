import { registerRootComponent } from "expo";
import * as React from "react";
import { Provider as PaperProvider } from "react-native-paper";
import { theme } from "./src/styles/theme";
import App from "./App";

function Main() {
  return (
    <PaperProvider theme={theme}>
      <App />
    </PaperProvider>
  );
}

registerRootComponent(Main);
