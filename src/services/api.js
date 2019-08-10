import axios from "axios";

const url = process.env.DATABASE_URL;

const api = axios.create({
  baseURL: url,
});

export default api;
export { url };
