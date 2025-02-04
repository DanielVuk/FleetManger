import React, { useContext, useState } from "react";
import {
  Keyboard,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  TouchableWithoutFeedback,
} from "react-native";
import {
  Button,
  Card,
  IconButton,
  SegmentedButtons,
  Text,
  TextInput,
  useTheme,
} from "react-native-paper";
import { Formik } from "formik";
import * as Yup from "yup";
import { View } from "react-native";
import { addCategory, editCategory } from "../../services/categoryServices";
import { AppContext } from "../contexts/AppContext";
import { NotificationContext } from "../contexts/NotificationContext";
import { useNavigation } from "@react-navigation/native";

const categoryIcons = [
  "fuel",
  "wrench",
  "car-wrench",
  "card-account-details",
  "shield-car",
  "bridge",
  "alert-circle",
  "parking",
  "car-wash",
  "clipboard-check",
  "car-battery",
  "currency-usd",
  "cash",
  "road",
  "plus",
];

const validationSchema = Yup.object().shape({
  name: Yup.string().max(25).required("Required"),
  type: Yup.string().oneOf(["income", "expense"]).required("Required"),
  icon: Yup.string().required("Required"),
});

const CategoryDetailsScreen = ({ route }) => {
  const { category } = route.params || {};
  const theme = useTheme();
  const [selectedIcon, setSelectedIcon] = useState(
    category ? category.icon : categoryIcons[0]
  );
  const [state, setState] = useContext(AppContext);
  const { showNotification } = useContext(NotificationContext);
  const navigation = useNavigation();

  const isEditMode = !!category;

  const handleSubmit = async (values) => {
    try {
      setState({ ...state, loading: true });

      if (isEditMode) {
        const updatedCategory = {
          id: category.id,
          ...values,
          userId: state.user.id,
        };
        await editCategory(updatedCategory);
        const updatedCategories = state.categories.map((c) =>
          c.id === category.id ? updatedCategory : c
        );
        setState({ ...state, categories: updatedCategories, loading: false });
        showNotification("success", `${values.name} updated successfully.`);
        navigation.reset({ index: 0, routes: [{ name: "ActivityMain" }] });
      } else {
        const res = await addCategory({ ...values, userId: state.user.id });

        setState((prevState) => ({
          ...prevState,
          categories: [...prevState.categories, { ...res }],
          loading: false,
        }));

        showNotification(
          "success",
          `${values.name} has been successfully added.`
        );
        navigation.reset({ index: 0, routes: [{ name: "ActivityMain" }] });
      }
    } catch (error) {
      console.log(error);
      showNotification("error", error.message || "Something went wrong.");
      setState({
        ...state,
        loading: false,
      });
    }
  };

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <SafeAreaView>
        <Formik
          initialValues={{
            name: category?.name || "",
            type: category?.type || "income",
            icon: category?.icon || categoryIcons[0],
          }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ handleChange, handleSubmit, setFieldValue, errors, values }) => (
            <View style={{ padding: 20 }}>
              <Text variant="headlineMedium">
                {isEditMode ? `Edit Category` : "Add Category"}
              </Text>
              <TextInput
                error={!!errors.name}
                label="Category Name"
                mode="outlined"
                onChangeText={handleChange("name")}
                style={styles.input}
                value={values.name}
              />

              <SegmentedButtons
                value={values.type}
                onValueChange={(value) => setFieldValue("type", value)}
                buttons={[
                  {
                    value: "income",
                    label: "Income",
                    checkedColor: theme.colors.success,
                    style: { backgroundColor: "#FFF" },
                  },
                  {
                    value: "expense",
                    label: "Expense",
                    checkedColor: theme.colors.error,
                    style: { backgroundColor: "#FFF" },
                  },
                ]}
              />

              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.iconScroll}
              >
                {categoryIcons.map((icon, index) => (
                  <Card
                    key={index}
                    style={[
                      styles.iconCard,
                      selectedIcon === icon && {
                        borderWidth: 1,
                        borderColor: theme.colors.secondary,
                        transform: [{ scale: 1.1 }],
                      },
                    ]}
                    onPress={() => {
                      setSelectedIcon(icon);
                      setFieldValue("icon", icon);
                    }}
                  >
                    <IconButton
                      icon={icon}
                      size={30}
                      iconColor={theme.colors.primary}
                    />
                  </Card>
                ))}
              </ScrollView>
              <Button
                mode="contained"
                onPress={handleSubmit}
                style={styles.button}
              >
                {isEditMode ? "Update Category" : "Add Category"}
              </Button>
            </View>
          )}
        </Formik>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  iconScroll: { marginVertical: 15 },

  iconCard: {
    margin: 5,
    padding: 10,
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
  },

  input: { marginVertical: 15, backgroundColor: "white" },
  button: { marginTop: 15 },
});

export default CategoryDetailsScreen;
