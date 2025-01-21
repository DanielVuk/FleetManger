import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import HomeScreen from "../screens/HomeScreen";
import FleetScreen from "../screens/FleetScreen";
const Tab = createBottomTabNavigator();

const AppNavigator = () => (
  <Tab.Navigator>
    <Tab.Screen name="Fleet" component={FleetScreen} />
    <Tab.Screen name="Home" component={HomeScreen} />
  </Tab.Navigator>
);

export default AppNavigator;
