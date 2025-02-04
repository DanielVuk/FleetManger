import React, { useContext } from "react";
import {
  SafeAreaView,
  View,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { Text, useTheme, Icon } from "react-native-paper";
import Category from "../components/Category";
import { useState } from "react";
import { AppContext } from "../contexts/AppContext";
import AppPicker from "../components/AppPicker";
import { useNavigation } from "@react-navigation/native";
import { deleteCategory } from "../../services/categoryServices";
import { NotificationContext } from "../contexts/NotificationContext";

const ActivityScreen = () => {
  const [state, setState] = useContext(AppContext);
  const [vehicle, setVehicle] = useState();
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

  return (
    <SafeAreaView>
      <View style={{ padding: 20 }}>
        <AppPicker
          selectedItem={vehicle}
          onSelectItem={(item) => setVehicle(item)}
          items={state?.fleet.map((v) => ({
            label: `${v.name} - ${v.registrationNumber}`,
            value: v.id,
          }))}
          placeholder="Choose vehicle"
        />

        <Text style={{ marginVertical: 20 }} variant="headlineMedium">
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
              />
            );
          })}
        </ScrollView>
        <Text variant="headlineMedium">Prikaz aktivnosti</Text>
        <ScrollView></ScrollView>
      </View>
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
});
export default ActivityScreen;
