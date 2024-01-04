import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import * as moment from 'moment';
import { Geotag } from 'src/app/models/Geotag';
import { Store } from 'src/app/models/Store';
import { DataService } from 'src/app/pages/data.service';
import { ToastService } from 'src/app/pages/toast.service';
import {AttendanceConfig} from 'src/app/models/attendanceConfig';

@Component({
  selector: 'app-attendance-settings',
  templateUrl: './attendance-settings.component.html',
  styleUrls: ['./attendance-settings.component.scss']
})
export class AttendanceSettingsComponent implements OnInit {
  startDate: any = moment().subtract(1, 'day').toJSON();
  endDate: string = new Date().toJSON();
  geotags: Geotag[] = [];
  attendanceConfig: AttendanceConfig = {
      shift_start_time: '09:00',
      working_minutes: 60,
      late_mark_minutes: 0,
      half_day_minutes: 0,
      late_out_minutes: 0,
      skip_late_if_hours_completed: false,
      mark_half_if_shift_not_ended: false,
      no_of_late_to_half: 2,
      calendar_type: 'CALENDAR',
      min_days_leave_apply: 0,
      is_approval_required: false,
      casual_leaves: 0,
      paid_leaves: 0,
      sick_leaves: 0,
      other_leaves: 0,
      is_auto_attendance: false,
      auto_attendance_in: 'IN',
      auto_attendance_out: 'OUT',
      multi_attendance: false,
      only_allowed_in_geofence: false,
      attendance_image: false,
      show_odometer_attendance: false,
      vehicle_recognition: false,
      face_recognition: false,
      push_attendance_for: '',
      restrict_geotag_form_id_for_attendance: '',
      store_selection_for_attendance_mark_in: false,
      disable_duty_button: false,
  };
  companyConfig = {
      face_recognition: 0, show_odometer_attendance: undefined,
  };
  stores: Store[] = [];
  geotag: Geotag | undefined ;
  isGeotag: boolean = false;


  constructor(private translate: TranslateService
,        private http: DataService, private toaster: ToastService) {
  }

  ngOnInit() {
      this.fetchAttendanceConfig().then();
      this.getGeoTag().then();
      this.getStores().then();
  }
  translateText(key: string): string {
  let translation: string ="";
  this.translate.get(key).subscribe((res: string) => {
    translation = res;
  });
  return translation;
}
  async getGeoTag() {

      const query = {
          __order_by: '-created_on',
      };
      this.geotags = (await this.http.get('', query, 'auth/custom_form_config')).data.filter((res:any) => res.active === true);
      this.geotag = this.geotags.find(el => el.id === this.attendanceConfig.restrict_geotag_form_id_for_attendance);

  }

  isEmptyObject(obj: Geotag) {
      // return (obj && (Object.keys(obj).length === 0));
  }

  async getStores() {

      const query = {
          __order_by: '-created_on',
      };
      this.stores = (await this.http.get('', query, 'auth/outlet')).data.filter((res:any) => res.active === true);

  }

  async fetchAttendanceConfig() {
      const data = (await this.http.query({}, 'event/attendance_config', 'event')).data;
      data.forEach((res:any) => {
          res.casual_leaves = Number(res.casual_leaves).toFixed();
          res.paid_leaves = Number(res.paid_leaves).toFixed();
          res.sick_leaves = Number(res.sick_leaves).toFixed();
          res.other_leaves = Number(res.other_leaves).toFixed();
          res.min_days_leave_apply = Number(res.min_days_leave_apply).toFixed();
      });
      this.attendanceConfig = data[0];
  }


  async save() {
      try {
          if (this.attendanceConfig.id) {
              await this.http.update(this.attendanceConfig.id, this.attendanceConfig, {}, 'event/attendance_config');
          } else {
              this.attendanceConfig.id = (await this.http.create(this.attendanceConfig, {}, 'event/attendance_config'))[0].id;
          }
          this.toaster.showToast(this.translateText('Saved config successful'), 'Success', false);
      } catch (e:any) {
          this.toaster.showToast(this.translateText('Error saving config ') + e.toString(), 'Error', true, e);
      }
  }

  setGeotag(event: any) {
      if (event.id) {
          this.attendanceConfig.restrict_geotag_form_id_for_attendance = event.id;

      } else {
          this.attendanceConfig.restrict_geotag_form_id_for_attendance = null;
      }

  }

  openGeotags(event: boolean) {
      this.isGeotag = event;
      if (!this.isGeotag) {
          this.attendanceConfig.restrict_geotag_form_id_for_attendance = null;
      }
  }
}
