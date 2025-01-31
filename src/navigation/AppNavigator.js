import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import HomeScreen from "../screens/HomeScreen";
import LogsScreen from "../screens/LogsScreen";
import FleetScreen from "../screens/FleetScreen";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { createStackNavigator } from "@react-navigation/stack";
import VehicleDetailsScreen from "../screens/VehicleDetailsScreen";

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const FleetNavigator = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="FleetMain" component={FleetScreen} />
    <Stack.Screen name="VehicleDetails" component={VehicleDetailsScreen} />
  </Stack.Navigator>
);

const AppNavigator = () => (
  <Tab.Navigator>
    <Tab.Screen
      name="Fleet"
      component={FleetNavigator}
      options={{
        headerShown: false,
        tabBarIcon: ({ color, size }) => (
          <MaterialCommunityIcons name="car" color={color} size={size} />
        ),
      }}
    />
    <Tab.Screen
      name="Activity"
      component={LogsScreen}
      options={{
        headerShown: false,
        tabBarIcon: ({ color, size }) => (
          <MaterialCommunityIcons
            name="format-list-bulleted"
            color={color}
            size={size}
          />
        ),
      }}
    />
    <Tab.Screen
      name="Home"
      component={HomeScreen}
      options={{
        headerShown: false,
        tabBarIcon: ({ color, size }) => (
          <MaterialCommunityIcons name="account" color={color} size={size} />
        ),
      }}
    />
  </Tab.Navigator>
);

export default AppNavigator;
