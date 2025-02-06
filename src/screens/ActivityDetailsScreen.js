import { Formik } from "formik";
import React, { useContext, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
} from "react-native";
import { Button, HelperText, TextInput } from "react-native-paper";
import * as Yup from "yup";
import { addActivity, editActivity } from "../../services/activityServices";
import AppPicker from "../components/AppPicker";
import { AppContext } from "../contexts/AppContext";
import { NotificationContext } from "../contexts/NotificationContext";
import { getLastMileage } from "../utils/getLastMileage";

const ActivityDetailsScreen = ({ route, navigation }) => {
  const { activity } = route.params || {};
  const [state, setState] = useContext(AppContext);
  const { showNotification } = useContext(NotificationContext);
  const isEditMode = !!activity;

  const validationSchema = Yup.object().shape({
    vehicle: Yup.object().required(),
    category: Yup.object().required(),
    name: Yup.string().required(),
    date: Yup.date().required(),
    mileage: Yup.number()
      .required("Mileage is required")
      .min(0, "Mileage cannot be negative")
      .integer("Mileage must be an integer")
      .test(
        "mileage-valid",
        "Mileage cannot be less than the last recorded mileage",
        (value, context) => {
          const { vehicle } = context.parent;
          if (vehicle && vehicle.value) {
            const lastMileage = getLastMileage(vehicle.value, state);
            if (value < lastMileage) return false;
          }
          return true;
        }
      ),
    amount: Yup.number().nullable().min(0),
    location: Yup.string(),
    notes: Yup.string(),
  });

  const handleSubmit = async (values) => {
    try {
      setState({ ...state, loading: true });

      if (isEditMode) {
        const updatedActivity = {
          id: activity.id,
          userId: state.user.id,
          vehicleId: values.vehicle.value,
          categoryId: values.category.value,
          name: values.name,
          date: values.date,
          amount: values.amount ? parseFloat(values.amount) : null,
          mileage: values.mileage ? parseInt(values.mileage) : null,
          location: values.location,
          notes: values.notes,
        };
        await editActivity(updatedActivity);
        const updatedActivities = state.activities.map((a) =>
          a.id === activity.id ? updatedActivity : a
        );
        setState((prevState) => ({
          ...prevState,
          activities: updatedActivities,
          loading: false,
        }));
        showNotification("success", `${values.name} updated successfully.`);
      } else {
        const newActivity = {
          userId: state.user.id,
          vehicleId: values.vehicle.value,
          categoryId: values.category.value,
          name: values.name,
          date: values.date,
          amount: values.amount ? parseFloat(values.amount) : null,
          mileage: values.mileage ? parseInt(values.mileage) : null,
          location: values.location,
          notes: values.notes,
        };

        const result = await addActivity(newActivity);

        setState((prevState) => ({
          ...prevState,
          activities: [...prevState.activities, { ...result }],
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

  const getInitialValue = (list, key, labelKey) => {
    const item = list.find((i) => i.id === activity?.[key]);
    return item ? { label: item[labelKey], value: item.id } : null;
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          contentContainerStyle={{ padding: 20 }}
          keyboardShouldPersistTaps="handled"
        >
          <Formik
            initialValues={{
              vehicle: getInitialValue(state.fleet, "vehicleId", "name"),
              category: getInitialValue(state.categories, "categoryId", "name"),
              name: activity?.name || "",
              date: activity?.date ? new Date(activity.date) : new Date(),
              mileage: activity?.mileage?.toString() || "",
              amount: activity?.amount?.toString() || "",
              location: activity?.location || "",
              notes: activity?.notes || "",
            }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({
              handleChange,
              handleSubmit,
              setFieldValue,
              values,
              errors,
              touched,
            }) => (
              <>
                <AppPicker
                  selectedItem={values.vehicle}
                  onSelectItem={(item) => setFieldValue("vehicle", item)}
                  items={state?.fleet.map((v) => ({
                    label: `${v.name} - ${v.registrationNumber}`,
                    value: v.id,
                  }))}
                  placeholder="Choose vehicle"
                />
                {errors.vehicle && touched.vehicle && (
                  <HelperText type="error" style={styles.helperText}>
                    {errors.vehicle}
                  </HelperText>
                )}

                <AppPicker
                  selectedItem={values.category}
                  onSelectItem={(item) => setFieldValue("category", item)}
                  items={state?.categories.map((c) => ({
                    label: `${c.name}`,
                    value: c.id,
                  }))}
                  placeholder="Choose category"
                />
                {errors.category && touched.category && (
                  <HelperText type="error" style={styles.helperText}>
                    {errors.category}
                  </HelperText>
                )}
                <TextInput
                  label="Name"
                  mode="outlined"
                  value={values.name}
                  onChangeText={handleChange("name")}
                  style={styles.input}
                  error={errors.name && touched.name}
                />
                {errors.name && touched.name && (
                  <HelperText type="error" style={styles.helperText}>
                    {errors.name}
                  </HelperText>
                )}
                <TextInput
                  label="Mileage"
                  mode="outlined"
                  keyboardType="numeric"
                  value={values.mileage}
                  onChangeText={handleChange("mileage")}
                  style={styles.input}
                  error={errors.mileage && touched.mileage}
                  helperText={
                    errors.mileage && touched.mileage ? errors.mileage : ""
                  }
                  editable={!isEditMode}
                />
                {errors.mileage && touched.mileage && (
                  <HelperText type="error" style={styles.helperText}>
                    {errors.mileage}
                  </HelperText>
                )}

                <TextInput
                  label="Amount"
                  mode="outlined"
                  keyboardType="numeric"
                  value={values.amount}
                  onChangeText={handleChange("amount")}
                  style={styles.input}
                />
                <TextInput
                  label="Location"
                  mode="outlined"
                  value={values.location}
                  onChangeText={handleChange("location")}
                  style={styles.input}
                />
                <TextInput
                  editable={false}
                  label="Date"
                  mode="outlined"
                  style={styles.input}
                  value={
                    values.date
                      ? new Date(values.date).toLocaleDateString()
                      : ""
                  }
                />
                <TextInput
                  label="Note"
                  mode="outlined"
                  multiline
                  value={values.notes}
                  onChangeText={handleChange("notes")}
                  style={styles.input}
                />
                <Button
                  mode="contained"
                  onPress={handleSubmit}
                  style={styles.button}
                >
                  {isEditMode ? "Update Activity" : " Add Activity"}
                </Button>
              </>
            )}
          </Formik>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  input: {
    marginVertical: 10,
    backgroundColor: "white",
  },
  helperText: {
    marginTop: -15,
  },
  button: {
    marginTop: 20,
  },
});

export default ActivityDetailsScreen;
