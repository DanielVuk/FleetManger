import axios from "axios";
import { API_KEY } from "@env";
import storage from "./storage";
import { deleteUserFleet } from "./fleetServices";
import { deleteUserCategories } from "./categoryServices";
import { deleteSetting, deleteUserSettings } from "./settingsServices";
import { deleteUserActivities } from "./activityServices";

const registerUser = async (email, password) => {
  const endpoint = `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${API_KEY}`;
  return await axios.post(endpoint, {
    email,
    password,
    returnSecureToken: true,
  });
};

const loginUser = async (email, password) => {
  const endpoint = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${API_KEY}`;
  return await axios.post(endpoint, {
    email,
    password,
    returnSecureToken: true,
  });
};

const getUser = async (idToken) => {
  const endpoint = `https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${API_KEY}`;
  const res = await axios.post(endpoint, {
    idToken,
  });

  const { localId, email } = res.data.users[0];

  return { email, id: localId };
};

const deleteUser = async (userId, settingId) => {
  const token = await storage.getToken();

  await deleteUserFleet(userId);
  await deleteUserCategories(userId);
  await deleteUserActivities(userId);
  await deleteSetting(settingId);

  const endpoint = `https://identitytoolkit.googleapis.com/v1/accounts:delete?key=${API_KEY}`;

  return await axios.post(endpoint, {
    idToken: token,
  });
};

export { registerUser, loginUser, getUser, deleteUser };
