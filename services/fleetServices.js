import axios from "axios";
import storage from "../services/storage";
import { BASE_URL } from "@env";

const addVehicle = async (vehicle) => {
  const token = await storage.getToken();
  const endpoint = `${BASE_URL}/fleet.json?auth=${token}`;

  try {
    const response = await axios.post(endpoint, {
      ...vehicle,
    });

    return { id: response.data.name, ...vehicle };
  } catch (error) {
    throw error;
  }
};

const deleteVehicle = async (vehicleId) => {
  const token = await storage.getToken();
  const endpoint = `${BASE_URL}/fleet/${vehicleId}.json?auth=${token}`;
  try {
    return await axios.delete(endpoint);
  } catch (error) {
    throw error;
  }
};

const editVehicle = async (vehicle) => {
  const { id, ...vehicleData } = vehicle;
  const token = await storage.getToken();
  const endpoint = `${BASE_URL}/fleet/${id}.json?auth=${token}`;

  try {
    return await axios.put(endpoint, vehicleData);
  } catch (error) {
    throw error;
  }
};

const getUserFleet = async (userId) => {
  const token = await storage.getToken();
  const endpoint = `${BASE_URL}/fleet.json?orderBy="userId"&equalTo="${userId}"&auth=${token}&print=pretty`;
  try {
    let result = await axios.get(endpoint);

    let resultArray = Object.entries(result.data);
    let fleet = [];
    resultArray.map((item) =>
      fleet.push({
        id: item[0],
        ...item[1],
      })
    );
    return fleet;
  } catch (error) {
    throw error;
  }
};

export { addVehicle, deleteVehicle, getUserFleet, editVehicle };
