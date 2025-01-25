import axios from "axios";
import { API_KEY } from "@env";

const registerUser = async (email, password) => {
  const endpoint = `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${process.env.API_KEY}`;
  return await axios.post(endpoint, {
    email,
    password,
    returnSecureToken: true,
  });
};

const loginUser = async (email, password) => {
  const endpoint = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${process.env.API_KEY}`;
  return await axios.post(endpoint, {
    email,
    password,
    returnSecureToken: true,
  });
};

const getUser = async (idToken) => {
  const endpoint = `https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${process.env.API_KEY}`;
  const res = await axios.post(endpoint, {
    idToken,
  });

  const { localId, email } = res.data.users[0];

  return { email, id: localId };
};

export { registerUser, loginUser, getUser };
