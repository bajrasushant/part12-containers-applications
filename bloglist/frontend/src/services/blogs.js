import axios from "../utils/apiClient";
const baseUrl = "/api/blogs";

let token = null;
let config;

const getAll = async () => {
  const request = await axios.get(baseUrl, config);
  return request.data;
};

const create = async (newObject) => {
  const response = await axios.post(baseUrl, newObject, config);
  return response.data;
};

const edit = async (editObject) => {
  await axios.put(`${baseUrl}/${editObject.id}`, editObject, config);
};

const deleteBlog = async (blogToDeleteId) => {
  const response = await axios.delete(`${baseUrl}/${blogToDeleteId}`, config);
  return response.data;
};

const setToken = (newToken) => {
  token = `Bearer ${newToken}`;
  config = {
    headers: { Authorization: token },
  };
};

export default { getAll, setToken, create, edit, deleteBlog };
