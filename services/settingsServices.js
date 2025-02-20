import axios from "axios";
import storage from "./storage";
import { BASE_URL } from "@env";

const addSettings = async (settings) => {
  const token = await storage.getToken();
  const endpoint = `${BASE_URL}/settings.json?auth=${token}`;

  try {
    const res = await axios.post(endpoint, settings);
    return { id: res.data.name, ...settings };
  } catch (error) {
    console.error("Error saving settings:", error);
    throw error;
  }
};

const getUserSettings = async (userId) => {
  const token = await storage.getToken();
  const endpoint = `${BASE_URL}/settings.json?orderBy="userId"&equalTo="${userId}"&auth=${token}&print=pretty`;
  try {
    let result = await axios.get(endpoint);

    let settings = {};
    let resultArray = Object.entries(result.data);
    resultArray.map(
      (item) =>
        (settings = {
          id: item[0],
          ...item[1],
        })
    );

    return settings;
  } catch (error) {
    throw error;
  }
};

const updateSettings = async (settings) => {
  const { id, ...settingsData } = settings;
  const token = await storage.getToken();
  const endpoint = `${BASE_URL}/settings/${id}.json?auth=${token}`;

  try {
    await axios.put(endpoint, settingsData);
  } catch (error) {
    console.error("Error updating settings:", error);
    throw error;
  }
};

export { addSettings, updateSettings, getUserSettings };
