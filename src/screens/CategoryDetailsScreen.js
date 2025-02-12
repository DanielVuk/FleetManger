import { Formik } from "formik";
import React, { useContext, useState } from "react";
import {
  Keyboard,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
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
import * as Yup from "yup";
import { addCategory, editCategory } from "../../services/categoryServices";
import { AppContext } from "../contexts/AppContext";
import { NotificationContext } from "../contexts/NotificationContext";

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
  mileageInterval: Yup.number().min(0).nullable(),
  timeInterval: Yup.number().min(0).nullable(),
});

const CategoryDetailsScreen = ({ route, navigation }) => {
  const { category } = route.params || {};
  const theme = useTheme();
  const [selectedIcon, setSelectedIcon] = useState(
    category ? category.icon : categoryIcons[0]
  );
  const [state, setState] = useContext(AppContext);
  const { showNotification } = useContext(NotificationContext);

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
      }
      navigation.goBack();
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
        <View
          style={{
            flexDirection: "row",
            alignSelf: "flex-start",
            alignItems: "center",
          }}
        >
          <IconButton
            icon="chevron-left"
            size={40}
            onPress={() => navigation.goBack()}
          />
          <Text variant="headlineSmall">
            {isEditMode ? "Edit " : "Add "}Category
          </Text>
        </View>
        <Formik
          initialValues={{
            name: category?.name || "",
            type: category?.type || "income",
            icon: category?.icon || categoryIcons[0],
            mileageInterval: category?.mileageInterval || "",
            timeInterval: category?.timeInterval || "",
          }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ handleChange, handleSubmit, setFieldValue, errors, values }) => (
            <View style={{ paddingHorizontal: 20 }}>
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
              <View style={styles.reminderSection}>
                <Text variant="bodyLarge" style={styles.reminderText}>
                  Set a reminder for activities of this category using
                  intervals:
                </Text>

                <TextInput
                  error={!!errors.mileageInterval}
                  label="Mileage Interval"
                  mode="outlined"
                  keyboardType="numeric"
                  onChangeText={handleChange("mileageInterval")}
                  style={styles.input}
                  value={values.mileageInterval?.toString()}
                />

                <TextInput
                  error={!!errors.timeInterval}
                  label="Time Interval (in days)"
                  mode="outlined"
                  keyboardType="numeric"
                  onChangeText={handleChange("timeInterval")}
                  style={styles.input}
                  value={values.timeInterval?.toString()}
                />
              </View>
              <Button mode="contained" onPress={handleSubmit}>
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
  iconScroll: {
    marginVertical: 15,
  },
  iconCard: {
    alignItems: "center",
    backgroundColor: "white",
    justifyContent: "center",
    margin: 5,
    padding: 10,
  },
  input: {
    backgroundColor: "white",
    marginVertical: 15,
  },
  reminderSection: {
    backgroundColor: "white",
    borderRadius: 15,
    marginVertical: 20,
    padding: 15,
  },
  reminderText: {
    color: "grey",
    marginVertical: 5,
  },
});

export default CategoryDetailsScreen;
