import axios from "axios";

const api = axios.create({
  baseURL: "https://sem-omni-backend.herokuapp.com/devs"
});

export default api;
