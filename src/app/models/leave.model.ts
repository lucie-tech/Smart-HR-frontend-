export interface LeaveRequest {
  id?: number;
  type: string;
  startDate: string;
  endDate: string;
  reason?: string;
  status?: string;
  appliedAt?: string;
  processedAt?: string;
  employeeName?: string;
  employeeId?: string;
  processedByName?: string;
}
