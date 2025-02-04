import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import HomeScreen from "../screens/HomeScreen";
import ActivityScreen from "../screens/ActivityScreen";
import FleetScreen from "../screens/FleetScreen";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { createStackNavigator } from "@react-navigation/stack";
import VehicleDetailsScreen from "../screens/VehicleDetailsScreen";
import CategoryDetailsScreen from "../screens/CategoryDetailsScreen";
import { useTheme } from "react-native-paper";

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const FleetNavigator = () => {
  const theme = useTheme();

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        cardStyle: { backgroundColor: theme.colors.background },
      }}
    >
      <Stack.Screen name="FleetMain" component={FleetScreen} />
      <Stack.Screen name="VehicleDetails" component={VehicleDetailsScreen} />
    </Stack.Navigator>
  );
};

const ActivityNavigator = () => {
  const theme = useTheme();
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        cardStyle: { backgroundColor: theme.colors.background },
      }}
    >
      <Stack.Screen name="ActivityMain" component={ActivityScreen} />
      <Stack.Screen name="CategoryDetails" component={CategoryDetailsScreen} />
    </Stack.Navigator>
  );
};

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
      component={ActivityNavigator}
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
