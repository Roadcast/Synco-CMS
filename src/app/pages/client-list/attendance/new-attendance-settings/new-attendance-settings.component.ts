import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Geotag } from 'src/app/models/Geotag';
import { NewAttendanceConfig } from 'src/app/models/newAttendanceConfig';
import { DataService } from 'src/app/pages/data.service';
import { ToastService } from 'src/app/pages/toast.service';

@Component({
  selector: 'app-new-attendance-settings',
  templateUrl: './new-attendance-settings.component.html',
  styleUrls: ['./new-attendance-settings.component.scss']
})
export class NewAttendanceSettingsComponent implements OnInit {
  geotags: Geotag[] = [];
  geotag: Geotag | undefined;
  noAttendanceConfig: boolean = false;
  newAttendanceConfig: NewAttendanceConfig = {
    paid_leaves: 0,
    mark_out_allowed_before_minutes: 0,
    other_leaves: 0,
    casual_leaves: 0,
    sick_leaves: 0,
    mark_out_allowed_after_minutes: 0,
    consider_overtime_after_minute: 0,
    mark_in_allowed_before_minutes: 0,
    mark_in_allowed_after_minutes: 0,
    max_allowed_overtime_minutes: 0,
    calendar_type: "CALENDAR",
    only_allowed_in_geofence: false,
    is_roster_required: false,
    is_half_day_allowed: false,
    store_selection_for_attendance_mark_in: false,
    half_day_minutes: 0,
    late_mark_minutes: 0,
    late_out_minutes: 0,
    mark_half_if_shift_not_ended: false,
    show_odometer_attendance: false,
    face_recognition: false,
    vehicle_recognition: false,
    attendance_image: false,
    notification_in_minutes: 0,
    disable_duty_button: null,
    restrict_geotag_form_id_for_attendance: "",
    leave_status_update_notification: false,
  };
  newAttendanceConfigObj:any = {
    mark_in_allowed_before_minutes: 0,
    mark_in_allowed_after_minutes: 0,
    leave_status_update_notification: false,
    paid_leaves: 0,
    mark_out_allowed_before_minutes: 0,
    other_leaves: 0,
    casual_leaves: 0,
    sick_leaves: 0,
    mark_out_allowed_after_minutes: 0,
    consider_overtime_after_minute: 0,
    max_allowed_overtime_minutes: 0,
    calendar_type: "CALENDAR",
    only_allowed_in_geofence: false,
    is_roster_required: false,
    is_half_day_allowed: false,
    store_selection_for_attendance_mark_in: false,
    half_day_minutes: 0,
    late_mark_minutes: 0,
    late_out_minutes: 0,
    disable_duty_button: null,
    mark_half_if_shift_not_ended: false,
    show_odometer_attendance: false,
    face_recognition: false,
    vehicle_recognition: false,
    attendance_image: false,
    notification_in_minutes: 0,
    restrict_geotag_form_id_for_attendance: "",
  };
  isGeotag: boolean = false;
  updatedValue:any= {};

  constructor(
    private translate: TranslateService,
    private http: DataService,
    private toaster: ToastService,
  ) {}

  ngOnInit(): void {
    this.fetchAttendanceConfig()
      .then()
      .catch((data) => {
        this.noAttendanceConfig = true;
      });
    this.getGeoTag().then();
  }
  translateText(key: string): string {
    let translation: string = '';
    this.translate.get(key).subscribe((res: string) => {
      translation = res;
    });
    return translation;
  }
  async fetchAttendanceConfig() {
    const data = (
      await this.http.query({}, "attendance/attendance_configuration", "attendance")
    ).data;
    data.forEach((res:any) => {
      res.casual_leaves = Number(res.casual_leaves).toFixed();
      res.paid_leaves = Number(res.paid_leaves).toFixed();
      res.sick_leaves = Number(res.sick_leaves).toFixed();
      res.other_leaves = Number(res.other_leaves).toFixed();
    });
    this.newAttendanceConfig = data[0];
    console.log(this.newAttendanceConfig, 111111);
    this.newAttendanceConfigObj = Object.assign({}, this.newAttendanceConfig);
  }

  async save() {
    try {
      if (this.newAttendanceConfig.id) {
        //this.updatedValue = this.pagesService.Compare(this.newAttendanceConfig, this.newAttendanceConfigObj);
        // if (
        //   this.newAttendanceConfigObj.mark_in_allowed_after_minutes <
        //   this.newAttendanceConfigObj.late_mark_minutes
        // ) {
        //   this.toaster.showToast(
        //     "Late Mark Minutes should be less or equal Mark in allowed after/before minutes",
        //     "Error",
        //     true
        //   );
        //   return false;
        // }
        if (Object.keys(this.newAttendanceConfigObj).length) {
          await this.http
            .update(
              this.newAttendanceConfig.id,
              this.newAttendanceConfigObj,
              {},
              "attendance/attendance_configuration",
            )
            .then(() => {
              this.updatedValue = {};
              this.fetchAttendanceConfig();
              this.toaster.showToast(
                "Config Updated successful",
                "Success",
                false
              );
            });
        }
      } else {
        if (this.noAttendanceConfig === true) {
          delete this.newAttendanceConfig
            .restrict_geotag_form_id_for_attendance;
        }
        this.newAttendanceConfig.id = (
          await this.http.create(
            this.newAttendanceConfig,
            {},
            "attendance/attendance_configuration",
          )
        )[0].id;
        // tslint:disable-next-line:max-line-length
        this.noAttendanceConfig = false;
        this.toaster.showToast("Config Saved successful", "Success", false);
      }
    } catch (e:any) {
      this.toaster.showToast(
        "Error saving config " + e.toString(),
        "Error",
        true
      );
    }
  }
  keyPressNumbers(event: KeyboardEvent, key: any) {
    const inputValue = (event.target as HTMLInputElement).value;
    console.log(inputValue);
    console.log(this.newAttendanceConfigObj);
    if (inputValue === "0") {
      (event.target as HTMLInputElement).value = "0";
    }
    if (inputValue === "") {
      (event.target as HTMLInputElement).value = "0";
      //this.newAttendanceConfigObj[key] = this.newAttendanceConfig[key];
    }

    if (+inputValue > 600) {
      (event.target as HTMLInputElement).value = "";
      this.newAttendanceConfigObj[key] = 1;
      this.toaster.showToast(
        "Total Limit is 600. You have crossed the limit",
        "Error",
        true
      );
    }
    if (key === "late_mark_minutes") {
    }
  }

  underscoreConvert(string: string): string {
    return string.replace(/_/g, " ");
  }

  openGeotags(event: boolean) {
    this.isGeotag = event;
    if (!this.isGeotag) {
      this.newAttendanceConfigObj.restrict_geotag_form_id_for_attendance = null;
    }
  }
  setGeotag(event: any) {
    if (event.id) {
      this.newAttendanceConfigObj.restrict_geotag_form_id_for_attendance =
        event.id;
    } else {
      this.newAttendanceConfigObj.restrict_geotag_form_id_for_attendance = null;
    }
  }
  async getGeoTag() {
    const query = {
      __order_by: "-created_on",
    };
    this.geotags = (
      await this.http.get("", query, "auth/custom_form_config")
    ).data.filter((res:any) => res.active === true);
    this.geotag = this.geotags.find(
      (el) =>
        el.id ===
        this.newAttendanceConfigObj.restrict_geotag_form_id_for_attendance
    );
  }

  deepCompareObjects(obj1: any, obj2: any): { [key: string]: any } {
    const changedValues: { [key: string]: any } = {};

    function compareInternal(obj1: any, obj2: any, path: string[] = []) {
      for (const key in obj1) {
        if (obj1.hasOwnProperty(key) && obj2.hasOwnProperty(key)) {
          if (typeof obj1[key] === "object" && typeof obj2[key] === "object") {
            // If both values are objects, recursively compare them
            compareInternal(obj1[key], obj2[key], [...path, key]);
          } else if (obj1[key] !== obj2[key]) {
            // If values are different, store the key and changed value in the result object
            const fullPath = [...path, key].join(".");
            changedValues[fullPath] = obj2[key];
          }
        }
      }
    }

    // Start the deep comparison
    compareInternal(obj1, obj2);

    // Return the object with keys having changed values
    return changedValues;
  }
}


