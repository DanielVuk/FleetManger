import { useNavigation } from "@react-navigation/native";
import React, { useContext, useState } from "react";
import {
  FlatList,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { Icon, IconButton, Text, useTheme } from "react-native-paper";
import { deleteActivity } from "../../services/activityServices";
import { deleteCategory } from "../../services/categoryServices";
import Activity from "../components/Activity";
import AppPicker from "../components/AppPicker";
import Category from "../components/Category";
import { AppContext } from "../contexts/AppContext";
import { NotificationContext } from "../contexts/NotificationContext";

const ActivityScreen = () => {
  const [state, setState] = useContext(AppContext);
  const [vehicle, setVehicle] = useState();
  const [selectedCategory, setSelectedCategory] = useState();
  const theme = useTheme();
  const navigation = useNavigation();
  const { showNotification } = useContext(NotificationContext);

  const handleDeleteCategory = async (category) => {
    try {
      setState({ ...state, loading: true });
      await deleteCategory(category.id);

      let newCategories = [...state.categories].filter(
        (c) => c.id !== category.id
      );

      setState((prevState) => ({
        ...prevState,
        categories: newCategories,
        loading: false,
      }));

      showNotification("success", `${category.name} is successfully deleted!`);
    } catch (error) {
      console.log(error);
      showNotification("error", error.message || "Something went wrong.");
      setState((prevState) => ({ ...prevState, loading: false }));
    }
  };

  const handleEditCategory = (category) => {
    navigation.navigate("CategoryDetails", { category });
  };

  const handleSelectCategory = (category) => {
    setSelectedCategory((prev) =>
      prev && prev.id === category.id ? null : category
    );
  };

  const handleDeleteActivity = async (activity) => {
    try {
      setState({ ...state, loading: true });
      await deleteActivity(activity.id);

      let newActivities = [...state.activities].filter(
        (a) => a.id !== activity.id
      );

      setState((prevState) => ({
        ...prevState,
        activities: newActivities,
        loading: false,
      }));

      showNotification("success", `${activity.name} is successfully deleted!`);
    } catch (error) {
      console.log(error);
      showNotification("error", error.message || "Something went wrong.");
      setState((prevState) => ({ ...prevState, loading: false }));
    }
  };

  const handleEditActivity = async (activity) => {
    navigation.navigate("ActivityDetails", { activity });
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ paddingHorizontal: 20 }}>
        <AppPicker
          selectedItem={vehicle}
          onSelectItem={(item) => setVehicle(item)}
          items={state?.fleet.map((v) => ({
            label: `${v.name} - ${v.registrationNumber}`,
            value: v.id,
          }))}
          placeholder="Choose vehicle"
        />

        <Text variant="headlineSmall" style={styles.title}>
          My Categories: {state.categories?.length}
        </Text>

        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <TouchableOpacity
            style={styles.addCategory}
            onPress={() => navigation.navigate("CategoryDetails")}
          >
            <Icon source="plus" size={30} color={theme.colors.primary} />
          </TouchableOpacity>
          {state.categories?.map((category) => {
            return (
              <Category
                key={category.id}
                category={category}
                onDelete={() => handleDeleteCategory(category)}
                onEdit={() => handleEditCategory(category)}
                onSelect={() => handleSelectCategory(category)}
                selected={selectedCategory}
              />
            );
          })}
        </ScrollView>
        <View style={styles.activityHeader}>
          <Text variant="headlineSmall" style={styles.title}>
            My Activities: {state.activities?.length}
          </Text>
          <IconButton
            icon="plus"
            size={30}
            onPress={() => navigation.navigate("ActivityDetails")}
          />
        </View>
      </View>
      <FlatList
        data={state.activities}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Activity
            activity={item}
            onDelete={() => handleDeleteActivity(item)}
            onEdit={() => handleEditActivity(item)}
          />
        )}
        style={{ paddingHorizontal: 20 }}
      />
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  addCategory: {
    width: 120,
    height: 180,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    margin: 10,
    elevation: 3,
    backgroundColor: "white",
  },
  title: {
    marginVertical: 15,
  },
  activityHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
});
export default ActivityScreen;
