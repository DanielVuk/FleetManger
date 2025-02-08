export const getCurrentMileage = (vehicleId, state) => {
  const vehicle = state.fleet.find((vehicle) => vehicle.id === vehicleId);

  if (!vehicle) return null;

  const lastActivity = state.activities
    .filter((activity) => activity.vehicleId === vehicleId)
    .sort((a, b) => new Date(b.date) - new Date(a.date))[0];

  console.log(
    "KILOMETZA: ",
    lastActivity ? lastActivity.mileage : vehicle.mileage
  );

  return lastActivity ? lastActivity.mileage : vehicle.mileage;
};
