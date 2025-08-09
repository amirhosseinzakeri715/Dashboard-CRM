import { generateClient } from './client';

const endpoint = '/crm/contacts/';

export const getContacts = async (company_id: number) => {
  try {
    const token = localStorage.getItem('authToken');
    const client = generateClient();
    const response = await client.get(endpoint, {
      params: { company_id },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Failed to fetch contacts:', error);
    throw error;
  }
};

export const createContact = async (body: any) => {
  try {
    const token = localStorage.getItem('authToken');
    const client = generateClient();
    const response = await client.post(endpoint, body, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Failed to create contact:', error);
    throw error;
  }
};

export const updateContact = async (id: number, body: any) => {
  try {
    const token = localStorage.getItem('authToken');
    const client = generateClient();
    const response = await client.put(`${endpoint}${id}/`, body, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Failed to update contact:', error);
    throw error;
  }
};

export const deleteContact = async (id: number) => {
  try {
    const token = localStorage.getItem('authToken');
    const client = generateClient();
    const response = await client.delete(`${endpoint}${id}/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (response.status !== 204 && response.status !== 200) throw new Error('Failed to delete contact');
    return true;
  } catch (error) {
    console.error('Failed to delete contact:', error);
    throw error;
  }
}; 