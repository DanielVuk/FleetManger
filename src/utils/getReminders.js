import { getCurrentMileage } from "./getCurrentMileage";

export const getReminders = (vehicle, state, upcomingOnly = false) => {
  const reminderMessages = [];
  const MILEAGE_THRESHOLD = 2000;
  const TIME_THRESHOLD = 7;

  console.log("VOZILO: ", vehicle.name);

  if (!vehicle.reminders || vehicle.reminders.length === 0) return [];

  console.log("REMINDERS: ", vehicle.reminders);

  vehicle.reminders.forEach((r) => {
    const category = state.categories.find((c) => c.id === r.categoryId);
    console.log("REMINDER- KATEGORIJA: ", category?.name);

    if (!category) return;

    const { mileageInterval, timeInterval } = category;

    const lastActivity = state.activities
      .filter(
        (activity) =>
          activity.vehicleId === vehicle.id &&
          activity.categoryId === category.id
      )
      .sort((a, b) => new Date(b.date) - new Date(a.date))[0];
    console.log("AKTIVNOST: ", lastActivity);

    if (mileageInterval) {
      const currentMileage = getCurrentMileage(vehicle.id, state);
      const lastCategoryMileage = lastActivity
        ? lastActivity.mileage
        : vehicle.mileage;

      const mileageDifference = currentMileage - lastCategoryMileage;
      const remainingMileage = mileageInterval - mileageDifference;

      if (upcomingOnly) {
        if (remainingMileage <= MILEAGE_THRESHOLD) {
          reminderMessages.push(
            `${category.name} is due within ${remainingMileage} km.`
          );
        }
      } else {
        reminderMessages.push(
          `${category.name} is due within ${remainingMileage} km.`
        );
      }
    }

    if (timeInterval && lastActivity) {
      const currentDate = new Date();
      const daysSinceLastService = Math.floor(
        (currentDate - new Date(lastActivity.date)) / (1000 * 60 * 60 * 24)
      );
      const remainingTime = timeInterval - daysSinceLastService;

      if (upcomingOnly) {
        if (remainingTime <= TIME_THRESHOLD) {
          reminderMessages.push(
            `${category.name} is due in ${remainingTime} days.`
          );
        }
      } else {
        reminderMessages.push(
          `${category.name} is due in ${remainingTime} days.`
        );
      }
    }
  });

  console.log("PORUKE: ", reminderMessages);

  return reminderMessages;
};
