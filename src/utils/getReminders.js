import { getCurrentMileage } from "./getCurrentMileage";

export const getReminders = (vehicle, state, upcomingOnly = false) => {
  if (!vehicle.reminders?.length) return [];

  const reminderMessages = [];

  const vehicleActivities = state.activities.filter(
    (activity) => activity.vehicleId === vehicle.id
  );

  const vehicleCategories = state.categories.filter((category) =>
    vehicle.reminders.some((r) => r.categoryId === category.id)
  );

  vehicleCategories.forEach((category) => {
    const { mileageInterval, timeInterval } = category;

    const lastActivity = vehicleActivities
      .filter((activity) => activity.categoryId === category.id)
      .sort((a, b) => new Date(b.date) - new Date(a.date))[0];

    if (mileageInterval) {
      const currentMileage = getCurrentMileage(vehicle.id, state);
      const lastCategoryMileage = lastActivity
        ? lastActivity.mileage
        : vehicle.mileage;
      const mileageDifference = currentMileage - lastCategoryMileage;
      const remainingMileage = mileageInterval - mileageDifference;

      if (!upcomingOnly || remainingMileage <= state.settings.kmReminder) {
        reminderMessages.push(
          remainingMileage >= 0
            ? `${category.name} is due within ${remainingMileage} km.`
            : `${category.name} was due ${Math.abs(remainingMileage)} km ago.`
        );
      }
    }

    if (timeInterval && lastActivity) {
      const currentDate = new Date();
      const daysSinceLastService = Math.floor(
        (currentDate - new Date(lastActivity.date)) / (1000 * 60 * 60 * 24)
      );
      const remainingTime = timeInterval - daysSinceLastService;

      if (!upcomingOnly || remainingTime <= state.settings.timeReminder) {
        reminderMessages.push(
          remainingTime >= 0
            ? `${category.name} is due in ${remainingTime} days.`
            : `${category.name} was due ${Math.abs(remainingTime)} days ago.`
        );
      }
    }
  });

  return reminderMessages;
};
