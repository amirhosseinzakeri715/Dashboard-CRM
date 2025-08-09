import { generateClient } from './client';

const getToken = () => localStorage.getItem('authToken');

export interface Opportunity {
  id: number;
  company_id: number;
  stage: 'lead' | 'qualified' | 'negotiation' | 'won' | 'lost';
  expected_value: number;
  expected_close_date?: string | null;
  probability: string;
}

export async function fetchOpportunities(companyId: number): Promise<Opportunity[]> {
  const client = generateClient();
  const token = getToken();
  const res = await client.get(`/crm/opportunities/?company_id=${companyId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
}

export async function createOpportunity(data: Omit<Opportunity, 'id'>): Promise<Opportunity> {
  const client = generateClient();
  const token = getToken();
  const res = await client.post('/crm/opportunities/', data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
}

export async function updateOpportunity(id: number, data: Partial<Opportunity>): Promise<Opportunity> {
  const client = generateClient();
  const token = getToken();
  const res = await client.patch(`/crm/opportunities/${id}/`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
}

export async function deleteOpportunity(id: number): Promise<void> {
  const client = generateClient();
  const token = getToken();
  await client.delete(`/crm/opportunities/${id}/`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
} 