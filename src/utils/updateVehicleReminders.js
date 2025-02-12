import { editVehicle } from "../../services/fleetServices";

export const updateVehicleReminders = async (
  vehicleId,
  categoryId,
  state,
  action = "add"
) => {
  const vehicle = state.fleet.find((v) => v.id === vehicleId);
  const category = state.categories.find((c) => c.id === categoryId);

  if (
    !vehicle ||
    !category ||
    (!category.mileageInterval && !category.timeInterval)
  ) {
    return;
  }

  const reminders = vehicle.reminders || [];
  const reminderExists = reminders.some(
    (reminder) => reminder.categoryId === categoryId
  );

  if (
    (action === "add" && reminderExists) ||
    (action === "remove" && !reminderExists)
  ) {
    return;
  }

  const updatedReminders =
    action === "add"
      ? [...reminders, { categoryId }]
      : reminders.filter((reminder) => reminder.categoryId !== categoryId);

  const updatedVehicle = { ...vehicle, reminders: updatedReminders };
  await editVehicle(updatedVehicle);
  return updatedVehicle;
};
