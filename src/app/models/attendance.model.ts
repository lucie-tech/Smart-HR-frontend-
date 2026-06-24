export interface AttendanceSummary {
  employeeId: number;
  year: number;
  month: number;
  daysPresent: number;
  daysAbsent: number;
  daysOnLeave: number;
  totalRecordedDays: number;
}
