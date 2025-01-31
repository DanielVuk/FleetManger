import React, { useContext, useEffect, useState } from "react";
import {
  SafeAreaView,
  Image,
  TouchableOpacity,
  StyleSheet,
  View,
  Dimensions,
  Keyboard,
  TouchableWithoutFeedback,
} from "react-native";
import { Text, TextInput, Button, HelperText } from "react-native-paper";
import * as ImagePicker from "expo-image-picker";
import { Formik } from "formik";
import * as Yup from "yup";
import RNDateTimePicker from "@react-native-community/datetimepicker";
import { uploadImage } from "../../services/uploadImage";
import { AppContext } from "../contexts/AppContext";
import { addVehicle, editVehicle } from "../../services/fleetServices";
import { NotificationContext } from "../contexts/NotificationContext";
import { useNavigation } from "@react-navigation/native";

const { width } = Dimensions.get("window");
const validationSchema = Yup.object().shape({
  name: Yup.string().required(),
  year: Yup.number().required().min(1900).max(new Date().getFullYear()),
  mileage: Yup.number().required(),
  purchasePrice: Yup.number().required(),
  registrationNumber: Yup.string().required(),
  registrationDate: Yup.date().required(),
  vin: Yup.string().optional(),
  owner: Yup.string().optional(),
  image: Yup.string().required("Vehicle image is required"),
});

const VehicleDetailsScreen = ({ route }) => {
  const { vehicle } = route.params || {};
  const [state, setState] = useContext(AppContext);
  const [showPicker, setShowPicker] = useState(false);
  const { showNotification } = useContext(NotificationContext);
  const navigation = useNavigation();

  const isEditMode = !!vehicle;

  const pickImage = async (setFieldValue) => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) setFieldValue("image", result.assets[0].uri);
  };

  const handleSubmit = async (values) => {
    try {
      setState({ ...state, loading: true });

      if (isEditMode) {
        const uploadedImageUrl = values.image.startsWith("http")
          ? values.image
          : await uploadImage(values.image);

        const updatedVehicle = {
          id: vehicle.id,
          ...values,
          image: uploadedImageUrl,
          userId: state.user.id,
        };

        await editVehicle(updatedVehicle);

        const updatedFleet = state.fleet.map((v) =>
          v.id === vehicle.id ? updatedVehicle : v
        );

        setState({ ...state, fleet: updatedFleet, loading: false });
        showNotification("success", `${values.name} updated successfully.`);
        navigation.reset({ index: 0, routes: [{ name: "FleetMain" }] });
      } else {
        const uploadedImageUrl = await uploadImage(values.image);

        const newVehicle = {
          ...values,
          image: uploadedImageUrl,
          userId: state.user.id,
        };
        const res = await addVehicle(newVehicle);

        setState((prevState) => ({
          ...prevState,
          fleet: [...prevState.fleet, { ...res }],
          loading: false,
        }));

        showNotification(
          "success",
          `${values.name} has been added to your fleet.`
        );
        navigation.reset({ index: 0, routes: [{ name: "FleetMain" }] });
      }
    } catch (error) {
      console.log(error);
      setState({
        ...state,
        loading: false,
      });
    }
  };

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <SafeAreaView style={styles.container}>
        <Text variant="headlineSmall" style={styles.title}>
          Adding a vehicle to the fleet
        </Text>
        <Formik
          initialValues={{
            name: vehicle?.name || "",
            year: vehicle?.year || "",
            mileage: vehicle?.mileage || "",
            vin: vehicle?.vin || "",
            purchasePrice: vehicle?.purchasePrice || "",
            registrationNumber: vehicle?.registrationNumber || "",
            registrationDate: vehicle?.registrationDate || "",
            owner: vehicle?.owner || "",
            image: vehicle?.image || "",
          }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({
            handleChange,
            handleSubmit,
            setFieldValue,
            errors,
            touched,
            setFieldTouched,
            values,
          }) => (
            <>
              <TouchableOpacity
                onPress={() => pickImage(setFieldValue)}
                style={styles.imageContainer}
              >
                {values.image ? (
                  <Image source={{ uri: values.image }} style={styles.image} />
                ) : (
                  <Text style={styles.placeholderText}>
                    Tap to add an image of vehicle
                  </Text>
                )}
              </TouchableOpacity>
              {errors.image && touched.image && (
                <HelperText style={{ marginTop: -20 }} type="error">
                  {errors.image}
                </HelperText>
              )}

              <View style={styles.row}>
                <View style={styles.inputContainer}>
                  <TextInput
                    label="Vehicle Name"
                    mode="outlined"
                    onBlur={() => setFieldTouched("name")}
                    onChangeText={handleChange("name")}
                    value={values.name}
                    error={touched.name && errors.name}
                  />
                </View>
                <View style={styles.inputContainer}>
                  <TextInput
                    label="Year"
                    mode="outlined"
                    maxLength={4}
                    keyboardType="numeric"
                    onBlur={() => setFieldTouched("year")}
                    onChangeText={handleChange("year")}
                    value={values.year}
                    error={touched.year && errors.year}
                  />
                </View>
              </View>

              <View style={styles.row}>
                <View style={styles.inputContainer}>
                  <TextInput
                    label="Mileage"
                    mode="outlined"
                    keyboardType="numeric"
                    onBlur={() => setFieldTouched("mileage")}
                    onChangeText={handleChange("mileage")}
                    value={values.mileage}
                    error={touched.mileage && errors.mileage}
                  />
                </View>
                <View style={styles.inputContainer}>
                  <TextInput
                    label="Purchase Price"
                    mode="outlined"
                    keyboardType="numeric"
                    onBlur={() => setFieldTouched("purchasePrice")}
                    onChangeText={handleChange("purchasePrice")}
                    value={values.purchasePrice}
                    error={touched.purchasePrice && errors.purchasePrice}
                  />
                </View>
              </View>

              <View style={styles.row}>
                <View style={styles.inputContainer}>
                  <TextInput
                    label="Registration Date"
                    mode="outlined"
                    value={
                      values.registrationDate
                        ? new Date(values.registrationDate).toLocaleDateString()
                        : ""
                    }
                    editable={false}
                    error={touched.registrationDate && errors.registrationDate}
                    onPressIn={() => {
                      Keyboard.dismiss();
                      setShowPicker(true);
                    }}
                  />
                </View>

                <View style={styles.inputContainer}>
                  <TextInput
                    label="Registration Number"
                    mode="outlined"
                    onBlur={() => setFieldTouched("registrationNumber")}
                    onChangeText={handleChange("registrationNumber")}
                    value={values.registrationNumber}
                    error={
                      touched.registrationNumber && errors.registrationNumber
                    }
                  />
                </View>
              </View>

              <View style={styles.row}>
                <View style={styles.inputContainer}>
                  <TextInput
                    label="VIN (Optional)"
                    mode="outlined"
                    onBlur={() => setFieldTouched("vin")}
                    onChangeText={handleChange("vin")}
                    value={values.vin}
                  />
                </View>
                <View style={styles.inputContainer}>
                  <TextInput
                    label="Owner (Optional)"
                    mode="outlined"
                    onBlur={() => setFieldTouched("owner")}
                    onChangeText={handleChange("owner")}
                    value={values.owner}
                  />
                </View>
              </View>

              {showPicker && (
                <RNDateTimePicker
                  value={
                    values.registrationDate
                      ? new Date(values.registrationDate)
                      : new Date()
                  }
                  mode="date"
                  display="spinner"
                  onChange={(event, selectedDate) => {
                    if (selectedDate) {
                      setFieldValue(
                        "registrationDate",
                        selectedDate.toISOString()
                      );
                    }
                  }}
                />
              )}
              {showPicker && (
                <Button onPress={() => setShowPicker(false)}>Confirm</Button>
              )}
              <Button
                mode="contained"
                onPress={handleSubmit}
                style={styles.button}
              >
                {isEditMode ? "Update Vehicle" : "Add Vehicle"}
              </Button>
            </>
          )}
        </Formik>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1,
    alignItems: "center",
  },
  title: {
    alignSelf: "center",
    marginBottom: 20,
  },
  imageContainer: {
    width: width * 0.9,
    height: 200,
    backgroundColor: "#ddd",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    overflow: "hidden",
    marginBottom: 20,
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  placeholderText: {
    color: "gray",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  inputContainer: {
    flex: 1,
    maxWidth: width / 2 - 20,
    marginHorizontal: 5,
    marginBottom: 10,
  },
  button: {
    marginTop: 20,
  },
});

export default VehicleDetailsScreen;
