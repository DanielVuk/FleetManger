import { editVehicle } from "../../services/fleetServices";

export const updateVehicleReminders = async (
  vehicleId,
  categoryId,
  state,
  action = "add"
) => {
  console.log("--- updateVehicleReminders START ---");
  const vehicle = state.fleet.find((v) => v.id === vehicleId);
  const category = state.categories.find((c) => c.id === categoryId);

  console.log("Found Vehicle:", vehicle.name);
  console.log("Found Category:", category.name);

  if (!category) {
    console.log("Category not found. Exiting function.");
    return;
  }

  if (!category.mileageInterval && !category.timeInterval) {
    console.log("Category has no mileage or time interval. Exiting function.");
    return;
  }

  const reminderExists =
    vehicle.reminders &&
    vehicle.reminders.some((reminder) => reminder.categoryId === categoryId);

  console.log("Reminder already exists?", reminderExists);

  if (action === "add") {
    if (reminderExists) {
      console.log("Reminder already exists. Exiting function.");
      return;
    }

    const updatedVehicle = {
      ...vehicle,
      reminders: [...(vehicle.reminders || []), { categoryId }],
    };

    await editVehicle(updatedVehicle);
    console.log("Vehicle updated in database.");
    return updatedVehicle;
  } else if (action === "remove") {
    if (!reminderExists) {
      console.log("Reminder does not exist. Exiting function.");
      return;
    }

    const updatedReminders = vehicle.reminders.filter(
      (reminder) => reminder.categoryId !== categoryId
    );

    const updatedVehicle = {
      ...vehicle,
      reminders: updatedReminders,
    };

    await editVehicle(updatedVehicle);
    console.log("Reminder removed and vehicle updated in database.");
    return updatedVehicle;
  }

  console.log("--- updateVehicleReminders END ---");
};
