import axios from "axios";
import storage from "../services/storage";
import { BASE_URL } from "@env";

const addCategory = async (category) => {
  const token = await storage.getToken();
  const endpoint = `${process.env.BASE_URL}/categories.json?auth=${token}`;

  try {
    const categories = await getUserCategories(category.userId);
    const exists = categories.some(
      (cat) => cat.name.toLowerCase() === category.name.toLowerCase()
    );
    if (exists) {
      throw new Error("Category with this name already exists.");
    }

    const res = await axios.post(endpoint, {
      ...category,
    });

    return { id: res.data.name, ...category };
  } catch (error) {
    throw error;
  }
};

const deleteCategory = async (categoryId) => {
  const token = await storage.getToken();
  const endpoint = `${process.env.BASE_URL}/categories/${categoryId}.json?auth=${token}`;

  try {
    return await axios.delete(endpoint);
  } catch (error) {
    throw error;
  }
};

const editCategory = async (category) => {
  const { id, ...categoryData } = category;
  const token = await storage.getToken();
  const endpoint = `${process.env.BASE_URL}/categories/${id}.json?auth=${token}`;

  try {
    return await axios.put(endpoint, categoryData);
  } catch (error) {
    throw error;
  }
};

const getUserCategories = async (userId) => {
  const token = await storage.getToken();
  const endpoint = `${process.env.BASE_URL}/categories.json?orderBy="userId"&equalTo="${userId}"&auth=${token}&print=pretty`;
  try {
    let result = await axios.get(endpoint);

    let resultArray = Object.entries(result.data);

    let categories = [];
    resultArray.map((item) =>
      categories.push({
        id: item[0],
        ...item[1],
      })
    );

    return categories;
  } catch (error) {
    throw error;
  }
};

export { addCategory, deleteCategory, editCategory, getUserCategories };
