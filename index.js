import { registerRootComponent } from "expo";
import * as React from "react";
import { DefaultTheme, Provider as PaperProvider } from "react-native-paper";
import App from "./App";

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: "#5DA5CD",
    secondary: "#81AC52",
  },
};

function Main() {
  return (
    <PaperProvider theme={theme}>
      <App />
    </PaperProvider>
  );
}

registerRootComponent(Main);
