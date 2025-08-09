import { generateClient } from "./client";

const token = localStorage.getItem("authToken");
const endpoint = "/crm/products/";

export const fetchProducts = async () => {
  const client = generateClient();
  const response = await client.get(endpoint, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const createProduct = async (body) => {
  const client = generateClient();
  const response = await client.post(endpoint, body, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const updateProduct = async (id, body) => {
  const client = generateClient();
  const response = await client.put(`${endpoint}${id}/`, body, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const deleteProduct = async (id) => {
  const client = generateClient();
  const response = await client.delete(`${endpoint}${id}/`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (response.status !== 204 && response.status !== 200) throw new Error('Failed to delete product');
  return true;
}; 