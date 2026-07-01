import { User } from './employee.model';

export interface AnnouncementReply {
  id?: number;
  content: string;
  datePosted?: string;
  author?: User;
}

export interface Announcement {
  id?: number;
  title: string;
  content: string;
  author?: User;
  datePosted?: string;
  replies?: AnnouncementReply[];
}
