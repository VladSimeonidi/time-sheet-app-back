export interface LeaveRequest {
  employee: string;
  leave_type: string;
  start_date: Date;
  end_date: Date;
  status: string;
}
