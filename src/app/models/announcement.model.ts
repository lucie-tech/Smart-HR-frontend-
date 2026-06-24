import { User } from './employee.model';

export interface Announcement {
  id?: number;
  title: string;
  content: string;
  author?: User;
  datePosted?: string;
}
