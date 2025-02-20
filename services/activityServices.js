import axios from "axios";
import storage from "../services/storage";
import { BASE_URL } from "@env";

const addActivity = async (activity) => {
  const token = await storage.getToken();
  const endpoint = `${BASE_URL}/activities.json?auth=${token}`;

  try {
    const res = await axios.post(endpoint, {
      ...activity,
    });

    return { id: res.data.name, ...activity };
  } catch (error) {
    throw error;
  }
};

const deleteActivity = async (activityId) => {
  const token = await storage.getToken();
  const endpoint = `${BASE_URL}/activities/${activityId}.json?auth=${token}`;

  try {
    return await axios.delete(endpoint);
  } catch (error) {
    throw error;
  }
};

const editActivity = async (activity) => {
  const { id, ...activityData } = activity;
  const token = await storage.getToken();
  const endpoint = `${BASE_URL}/activities/${id}.json?auth=${token}`;

  try {
    return await axios.put(endpoint, activityData);
  } catch (error) {
    throw error;
  }
};

const getUserActivities = async (userId) => {
  const token = await storage.getToken();
  const endpoint = `${BASE_URL}/activities.json?orderBy="userId"&equalTo="${userId}"&auth=${token}&print=pretty`;
  try {
    let result = await axios.get(endpoint);

    let resultArray = Object.entries(result.data);

    let activities = [];
    resultArray.map((item) =>
      activities.push({
        id: item[0],
        ...item[1],
      })
    );

    return activities;
  } catch (error) {
    throw error;
  }
};

export { addActivity, deleteActivity, editActivity, getUserActivities };
