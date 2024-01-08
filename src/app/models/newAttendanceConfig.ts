export interface NewAttendanceConfig {
    paid_leaves: number;
    mark_out_allowed_before_minutes: number;
    other_leaves: number;
    casual_leaves: number;
    sick_leaves: number;
    disable_duty_button: boolean | null;
    mark_out_allowed_after_minutes: number;
    id?: null;
    consider_overtime_after_minute: number;
    mark_in_allowed_before_minutes: number;
    mark_in_allowed_after_minutes: number;
    max_allowed_overtime_minutes: number;
    company_id?: null;
    created_on?: string;
    calendar_type: string;
    only_allowed_in_geofence: boolean;
    store_selection_for_attendance_mark_in: boolean;
    half_day_minutes: number;
    late_mark_minutes: number;
    late_out_minutes: number;
    mark_half_if_shift_not_ended: boolean;
    leave_status_update_notification: boolean;
    show_odometer_attendance: boolean;
    face_recognition: boolean;
    vehicle_recognition: boolean;
    attendance_image: boolean;
    is_roster_required: boolean;
    is_half_day_allowed: boolean;
    notification_in_minutes: number;
    restrict_geotag_form_id_for_attendance?: string;
}