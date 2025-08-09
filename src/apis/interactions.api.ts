import { generateClient } from "./client";

const token = localStorage.getItem("authToken");
const endpoint = "/crm/interactions/";

export const fetchInteractions = async () => {
  const client = generateClient();
  const response = await client.get(endpoint, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const createInteraction = async (body) => {
  const client = generateClient();
  const response = await client.post(endpoint, body, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export async function updateInteraction(id: number, data: Partial<any>) {
  const client = generateClient();
  const token = localStorage.getItem("authToken");
  const response = await client.put(`/crm/interactions/${id}/`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
  return response.data;
}

export async function deleteInteraction(id: number) {
  const client = generateClient();
  const token = localStorage.getItem("authToken");
  const response = await client.delete(`/crm/interactions/${id}/`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (response.status !== 204 && response.status !== 200) throw new Error('Failed to delete interaction');
  return true;
}
