import React from "react";
import { NotificationProvider } from "./NotificationContext";
import { AppStateProvider } from "./AppContext";
import { Provider as PaperProvider } from "react-native-paper";
import { theme } from "../styles/theme";

const AppProvider = ({ children }) => (
  <AppStateProvider>
    <NotificationProvider>
      <PaperProvider theme={theme}>{children}</PaperProvider>
    </NotificationProvider>
  </AppStateProvider>
);

export default AppProvider;
