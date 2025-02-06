import RNDateTimePicker from "@react-native-community/datetimepicker";
import * as ImagePicker from "expo-image-picker";
import { Formik } from "formik";
import React, { useContext, useState } from "react";
import {
  Dimensions,
  Image,
  Keyboard,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { Button, HelperText, Text, TextInput } from "react-native-paper";
import * as Yup from "yup";
import { addVehicle, editVehicle } from "../../services/fleetServices";
import { uploadImage } from "../../services/uploadImage";
import { AppContext } from "../contexts/AppContext";
import { NotificationContext } from "../contexts/NotificationContext";

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

const VehicleDetailsScreen = ({ route, navigation }) => {
  const { vehicle } = route.params || {};
  const [state, setState] = useContext(AppContext);
  const [showPicker, setShowPicker] = useState(false);
  const { showNotification } = useContext(NotificationContext);

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
      }
      navigation.goBack();
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
            registrationDate: vehicle?.registrationDate || new Date(),
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
                  <Text>Tap to add an image of vehicle</Text>
                )}
              </TouchableOpacity>
              {errors.image && touched.image && (
                <HelperText style={styles.helperText} type="error">
                  {errors.image}
                </HelperText>
              )}

              <View style={styles.row}>
                <View style={styles.inputContainer}>
                  <TextInput
                    error={touched.name && errors.name}
                    label="Vehicle Name"
                    mode="outlined"
                    onBlur={() => setFieldTouched("name")}
                    onChangeText={handleChange("name")}
                    style={styles.input}
                    value={values.name}
                  />
                </View>
                <View style={styles.inputContainer}>
                  <TextInput
                    error={touched.year && errors.year}
                    keyboardType="numeric"
                    label="Year"
                    maxLength={4}
                    mode="outlined"
                    onBlur={() => setFieldTouched("year")}
                    onChangeText={handleChange("year")}
                    style={styles.input}
                    value={values.year}
                  />
                </View>
              </View>

              <View style={styles.row}>
                <View style={styles.inputContainer}>
                  <TextInput
                    error={touched.mileage && errors.mileage}
                    keyboardType="numeric"
                    label="Mileage"
                    mode="outlined"
                    onBlur={() => setFieldTouched("mileage")}
                    onChangeText={handleChange("mileage")}
                    style={styles.input}
                    value={values.mileage}
                  />
                </View>
                <View style={styles.inputContainer}>
                  <TextInput
                    error={touched.purchasePrice && errors.purchasePrice}
                    keyboardType="numeric"
                    label="Purchase Price"
                    mode="outlined"
                    onBlur={() => setFieldTouched("purchasePrice")}
                    onChangeText={handleChange("purchasePrice")}
                    style={styles.input}
                    value={values.purchasePrice}
                  />
                </View>
              </View>

              <View style={styles.row}>
                <View style={styles.inputContainer}>
                  <TextInput
                    editable={false}
                    error={touched.registrationDate && errors.registrationDate}
                    label="Registration Date"
                    mode="outlined"
                    style={styles.input}
                    onPressIn={() => {
                      Keyboard.dismiss();
                      setShowPicker(true);
                    }}
                    value={
                      values.registrationDate
                        ? new Date(values.registrationDate).toLocaleDateString()
                        : ""
                    }
                  />
                </View>

                <View style={styles.inputContainer}>
                  <TextInput
                    label="Registration Number"
                    mode="outlined"
                    onBlur={() => setFieldTouched("registrationNumber")}
                    onChangeText={handleChange("registrationNumber")}
                    style={styles.input}
                    error={
                      touched.registrationNumber && errors.registrationNumber
                    }
                    value={values.registrationNumber}
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
                    style={styles.input}
                    value={values.vin}
                  />
                </View>
                <View style={styles.inputContainer}>
                  <TextInput
                    label="Owner (Optional)"
                    mode="outlined"
                    onBlur={() => setFieldTouched("owner")}
                    onChangeText={handleChange("owner")}
                    style={styles.input}
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
    alignItems: "center",
  },

  title: {
    alignSelf: "center",
    marginBottom: 20,
  },
  imageContainer: {
    alignItems: "center",
    backgroundColor: "#ddd",
    borderRadius: 10,
    height: 200,
    justifyContent: "center",
    marginBottom: 20,
    overflow: "hidden",
    width: width * 0.9,
  },
  image: {
    height: "100%",
    resizeMode: "cover",
    width: "100%",
  },
  helperText: {
    marginTop: -20,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  input: {
    backgroundColor: "white",
  },
  inputContainer: {
    flex: 1,
    marginBottom: 10,
    marginHorizontal: 5,
    maxWidth: width / 2 - 20,
  },
  button: {
    marginTop: 20,
  },
});

export default VehicleDetailsScreen;
