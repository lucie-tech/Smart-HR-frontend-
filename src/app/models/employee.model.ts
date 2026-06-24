export interface User {
  id?: number;
  employeeId: string;
  fullName: string;
  email: string;
  role: string;
  jobTitle?: string;
  contactInfo?: string;
  dateOfHire?: string;
  employmentStatus?: string;
  profilePhotoUrl?: string;
  password?: string;
  active?: boolean;
  annualLeaveBalance?: number;
  sickLeaveBalance?: number;
}
