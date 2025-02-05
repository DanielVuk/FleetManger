import React from "react";
import { Provider as PaperProvider } from "react-native-paper";
import { theme } from "../styles/theme";
import { AppStateProvider } from "./AppContext";
import { NotificationProvider } from "./NotificationContext";

const AppProvider = ({ children }) => (
  <AppStateProvider>
    <NotificationProvider>
      <PaperProvider theme={theme}>{children}</PaperProvider>
    </NotificationProvider>
  </AppStateProvider>
);

export default AppProvider;
