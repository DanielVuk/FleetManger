import axios from "axios";
import storage from "../services/storage";

const addVehicle = async (vehicle) => {
  const token = await storage.getToken();
  const endpoint = `https://fleetmanager-2afe4-default-rtdb.europe-west1.firebasedatabase.app/fleet.json?auth=${token}`;

  try {
    const response = await axios.post(endpoint, {
      ...vehicle,
    });

    return { id: response.data.name, ...vehicle };
  } catch (error) {
    console.log(error);
  }
};

const deleteVehicle = async (vehicleId) => {
  const token = await storage.getToken();
  const endpoint = `https://fleetmanager-2afe4-default-rtdb.europe-west1.firebasedatabase.app/fleet/${vehicleId}.json?auth=${token}`;

  return await axios.delete(endpoint);
};

const editVehicle = async (vehicle) => {
  const { id, ...vehicleData } = vehicle;
  const token = await storage.getToken();
  const endpoint = `https://fleetmanager-2afe4-default-rtdb.europe-west1.firebasedatabase.app/fleet/${id}.json?auth=${token}`;

  return await axios.put(endpoint, vehicleData);
};

const getUserFleet = async (userId) => {
  const token = await storage.getToken();
  const endpoint = `https://fleetmanager-2afe4-default-rtdb.europe-west1.firebasedatabase.app/fleet.json?orderBy="userId"&equalTo="${userId}"&auth=${token}&print=pretty`;
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
};

export { addVehicle, deleteVehicle, getUserFleet, editVehicle };
