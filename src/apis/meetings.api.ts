import { apiCall } from '../utils/api';
import { Meeting, MeetingCreateRequest, MeetingUpdateRequest } from '../types/meeting';

// Get all meetings for a company
export const getMeetings = async (company: number): Promise<Meeting[]> => {
  return await apiCall<Meeting[]>(`/crm/meetings/?company=${company}`);
};

// Get a single meeting by ID
export const getMeeting = async (id: number): Promise<Meeting> => {
  return await apiCall<Meeting>(`/crm/meetings/${id}/`);
};

// Create a new meeting
export const createMeeting = async (meeting: MeetingCreateRequest): Promise<Meeting> => {
  return await apiCall<Meeting>(`/crm/meetings/`, {
    method: 'POST',
    body: JSON.stringify(meeting),
  });
};

// Update an existing meeting
export const updateMeeting = async (id: number, meeting: MeetingUpdateRequest): Promise<Meeting> => {
  return await apiCall<Meeting>(`/crm/meetings/${id}/`, {
    method: 'PUT',
    body: JSON.stringify(meeting),
  });
};

// Delete a meeting
export const deleteMeeting = async (id: number): Promise<void> => {
  await apiCall<void>(`/crm/meetings/${id}/`, {
    method: 'DELETE',
  });
}; 