export interface Meeting {
  id: number;
  company: number;
  date: string;
  report: string;
  attachment?: string; // readOnly, not sent in requests
  user_ids: number[];
  attendees: User[]; // readOnly, not sent in requests
}

export interface MeetingCreateRequest {
  company?: number;
  date?: string;
  report: string;
  user_ids: number[];
}

export interface MeetingUpdateRequest {
  date?: string;
  report?: string;
  user_ids?: number[];
}

import { User } from './user'; 