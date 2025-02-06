import { MaterialCommunityIcons } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import React from "react";
import { useTheme } from "react-native-paper";
import ActivityDetailsScreen from "../screens/ActivityDetailsScreen";
import ActivityScreen from "../screens/ActivityScreen";
import CategoryDetailsScreen from "../screens/CategoryDetailsScreen";
import FleetScreen from "../screens/FleetScreen";
import HomeScreen from "../screens/HomeScreen";
import VehicleDetailsScreen from "../screens/VehicleDetailsScreen";

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
      <Stack.Screen name="ActivityDetails" component={ActivityDetailsScreen} />
    </Stack.Navigator>
  );
};

const AppNavigator = () => (
  <Tab.Navigator>
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
      name="Fleet"
      component={FleetNavigator}
      options={{
        headerShown: false,
        tabBarIcon: ({ color, size }) => (
          <MaterialCommunityIcons name="car" color={color} size={size} />
        ),
      }}
    />
  </Tab.Navigator>
);

export default AppNavigator;
