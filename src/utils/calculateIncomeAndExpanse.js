const validateNumber = (value) =>
  !isNaN(value) && value !== null && value !== undefined;

export const calculateTotalIncomeAndExpense = (categories, activities) => {
  let totalIncome = 0;
  let totalExpense = 0;

  activities.forEach((activity) => {
    const category = categories.find((cat) => cat.id === activity.categoryId);

    if (category) {
      const amount = Number(activity.amount);

      if (validateNumber(amount)) {
        if (category.type === "income") {
          totalIncome += amount;
        } else {
          totalExpense += amount;
        }
      }
    }
  });

  return { totalIncome, totalExpense };
};
