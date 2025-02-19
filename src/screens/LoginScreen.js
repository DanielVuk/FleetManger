import { Formik } from "formik";
import React, { useContext } from "react";
import {
  Keyboard,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import {
  Button,
  HelperText,
  Text,
  TextInput,
  useTheme,
} from "react-native-paper";
import * as Yup from "yup";
import { getUserActivities } from "../../services/activityServices.js";
import { loginUser } from "../../services/auth.js";
import { getUserCategories } from "../../services/categoryServices.js";
import { getUserFleet } from "../../services/fleetServices.js";
import { getUserSettings } from "../../services/settingsServices.js";
import storage from "../../services/storage.js";
import { AppContext } from "../contexts/AppContext.js";
import { NotificationContext } from "../contexts/NotificationContext.js";

const validationSchema = Yup.object().shape({
  email: Yup.string().required().email().label("Email"),
  password: Yup.string().required().min(4).label("Password"),
});

const LoginScreen = ({ navigation }) => {
  const theme = useTheme();
  const [state, setState] = useContext(AppContext);
  const { showNotification } = useContext(NotificationContext);

  const handleLogin = async ({ email, password }) => {
    try {
      setState({ ...state, loading: true });

      let result = await loginUser(email, password);
      storage.storeToken(result.data.idToken);

      const fleet = await getUserFleet(result.data.localId);
      const categories = await getUserCategories(result.data.localId);
      const activities = await getUserActivities(result.data.localId);
      const settings = await getUserSettings(result.data.localId);

      setState({
        ...state,
        user: { id: result.data.localId, email: result.data.email },
        fleet,
        categories,
        activities,
        settings,
        loading: false,
      });
    } catch (error) {
      setState({ ...state, loading: false });
      showNotification(
        "error",
        "Login failed. Please verify your credentials and try again."
      );
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <Text variant="headlineLarge" style={styles.title}>
          Sign In to FleetManager
        </Text>
        <Text style={styles.subtitle}>
          Welcome back! Get access to your fleet
        </Text>
        <Formik
          initialValues={{ email: "", password: "" }}
          onSubmit={handleLogin}
          validationSchema={validationSchema}
        >
          {({
            handleChange,
            handleSubmit,
            errors,
            setFieldTouched,
            touched,
          }) => (
            <>
              <TextInput
                autoCapitalize="none"
                keyboardType="email-address"
                label="Email"
                left={
                  <TextInput.Icon icon="account" color={theme.colors.primary} />
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
              <HelperText type="error" style={styles.errorMsg}>
                {touched.password && errors.password}
              </HelperText>
              <Button
                buttonColor={theme.colors.primary}
                labelStyle={styles.buttonText}
                mode="contained"
                onPress={handleSubmit}
                style={styles.button}
              >
                Login
              </Button>
            </>
          )}
        </Formik>
        <Button
          mode="text"
          onPress={() => navigation.navigate("Register")}
          style={styles.link}
          textColor={theme.colors.secondary}
        >
          Don’t have an account? Register
        </Button>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
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
    marginTop: 20,
    borderRadius: 25,
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

export default LoginScreen;
