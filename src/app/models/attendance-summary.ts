export interface AttendanceLeaveType {
	is_active: Boolean;
	apply_before_days: number;
	leaves_allowed?: number;
	name: string;
}