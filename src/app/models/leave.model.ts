import { User } from './employee.model';

export interface LeaveRequest {
  id?: number;
  employee?: User;
  type: string;     // ANNUAL | SICK | UNPAID
  startDate: string;
  endDate: string;
  reason?: string;
  status?: string;  // PENDING | APPROVED | REJECTED
  appliedAt?: string;
  processedAt?: string;
  processedBy?: User;
}
