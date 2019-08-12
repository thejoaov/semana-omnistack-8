import axios from "axios";
import { DB_URL } from "react-native-dotenv";
const url = DB_URL;
const api = axios.create({
  baseURL: url,
});

export default api;
export { url };
