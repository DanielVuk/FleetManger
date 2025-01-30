import React, { useState } from "react";
import {
  SafeAreaView,
  Image,
  TouchableOpacity,
  StyleSheet,
  View,
  Dimensions,
  Keyboard,
} from "react-native";
import { Text, TextInput, Button, HelperText } from "react-native-paper";
import * as ImagePicker from "expo-image-picker";
import { Formik } from "formik";
import * as Yup from "yup";
import RNDateTimePicker from "@react-native-community/datetimepicker";

const { width } = Dimensions.get("window");

const AddVehicleScreen = () => {
  const [image, setImage] = useState(null);
  const [showPicker, setShowPicker] = useState(false);

  const pickImage = async (setFieldValue) => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
      setFieldValue("image", result.assets[0].uri);
    }
  };

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

  const handleAddVehicle = (values) => {
    console.log("AUTO: ", values); // Handle submission logic here
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text variant="headlineSmall" style={styles.title}>
        Adding a vehicle to the fleet
      </Text>

      <Formik
        initialValues={{
          name: "",
          year: "",
          mileage: "",
          vin: "",
          purchasePrice: "",
          registrationNumber: "",
          registrationDate: "",
          owner: "",
          image: "",
        }}
        validationSchema={validationSchema}
        onSubmit={handleAddVehicle}
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
              {image || values.image ? (
                <Image
                  source={{ uri: image || values.image }}
                  style={styles.image}
                />
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
              Add Vehicle
            </Button>
          </>
        )}
      </Formik>
    </SafeAreaView>
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
    width: 300,
    height: 150,
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

export default AddVehicleScreen;
