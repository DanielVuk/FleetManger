import React from "react";
import { View, StyleSheet } from "react-native";
import {
  HelperText,
  Text,
  TextInput,
  Button,
  useTheme,
} from "react-native-paper";
import { Formik } from "formik";
import * as Yup from "yup";

const validationSchema = Yup.object().shape({
  email: Yup.string().required().email().label("Email"),
  password: Yup.string().required().min(4).label("Password"),
  confirmPassword: Yup.string()
    .required()
    .oneOf([Yup.ref("password"), null], "Passwords must match")
    .label("Confirm Password"),
});

const RegisterScreen = ({ navigation }) => {
  const theme = useTheme();

  return (
    <View style={styles.container}>
      <Text variant="headlineLarge" style={styles.title}>
        Sign Up to FleetManager
      </Text>
      <Text style={styles.subtitle}>
        Create your account and start managing your fleet.
      </Text>

      <Formik
        initialValues={{ email: "", password: "", confirmPassword: "" }}
        onSubmit={async (values) => {
          await new Promise((r) => setTimeout(r, 500));
          alert(JSON.stringify(values, null, 2));
        }}
        validationSchema={validationSchema}
      >
        {({ handleChange, handleSubmit, errors, setFieldTouched, touched }) => {
          console.log("Errors:", errors);
          console.log("Touched:", touched);
          return (
            <>
              <TextInput
                autoCapitalize="none"
                keyboardType="email-address"
                label="Email"
                left={
                  <TextInput.Icon icon="email" color={theme.colors.primary} />
                }
                mode="outlined"
                onBlur={() => setFieldTouched("email")}
                onChangeText={handleChange("email")}
                style={styles.input}
              />
              <HelperText style={styles.errorMsg} type="error">
                {touched.email && errors.email}
              </HelperText>

              <TextInput
                label="Password"
                left={
                  <TextInput.Icon icon="lock" color={theme.colors.primary} />
                }
                mode="outlined"
                onBlur={() => setFieldTouched("password")}
                onChangeText={handleChange("password")}
                secureTextEntry
                style={styles.input}
              />
              <HelperText style={styles.errorMsg} type="error">
                {touched.password && errors.password}
              </HelperText>
              <TextInput
                label="Confirm Password"
                left={
                  <TextInput.Icon
                    icon="lock-check"
                    color={theme.colors.primary}
                  />
                }
                mode="outlined"
                onBlur={() => setFieldTouched("confirmPassword")}
                onChangeText={handleChange("confirmPassword")}
                secureTextEntry
                style={styles.input}
              />
              <HelperText style={styles.errorMsg} type="error">
                {touched.confirmPassword && errors.confirmPassword}
              </HelperText>
              <Button
                buttonColor={theme.colors.primary}
                labelStyle={styles.buttonText}
                mode="contained"
                onPress={handleSubmit}
                style={styles.button}
              >
                Register
              </Button>
            </>
          );
        }}
      </Formik>
      <Button
        mode="text"
        onPress={() => navigation.navigate("Login")}
        textColor={theme.colors.secondary}
        style={styles.link}
      >
        Already have an account? Login
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#f9f9f9",
    flex: 1,
    justifyContent: "center",
    padding: 20,
  },
  title: {
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  subtitle: {
    color: "#6c6c6c",
    fontSize: 16,
    marginBottom: 30,
    textAlign: "center",
  },
  input: {
    backgroundColor: "white",
    marginBottom: 20,
  },
  errorMsg: {
    marginTop: -20,
  },
  button: {
    borderRadius: 25,
    marginTop: 20,
    paddingVertical: 10,
  },
  buttonText: {
    fontSize: 16,
  },
  link: {
    marginTop: 10,
    textAlign: "center",
  },
});

export default RegisterScreen;
