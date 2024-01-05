import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { AttendanceLeaveType } from 'src/app/models/attendance-summary';
import { DataService } from 'src/app/pages/data.service';
import { ToastService } from 'src/app/pages/toast.service';

@Component({
  selector: 'app-attendance-leavetype-edit',
  templateUrl: './attendance-leavetype-edit.component.html',
  styleUrls: ['./attendance-leavetype-edit.component.scss']
})
export class AttendanceLeavetypeEditComponent implements OnInit {
  id: any;
  loading: boolean = false;
  leaveType: AttendanceLeaveType = <AttendanceLeaveType>{}
  constructor(private translate: TranslateService
    , private activateRoute: ActivatedRoute, private http: DataService,
    private toaster: ToastService, private router: Router) {
    this.activateRoute.params.subscribe(res => {
      if (res['id'] !== 'new') {
        this.id = res['id'];
      }
    });
    console.log(this.id)
  }

  ngOnInit(): void {
    console.log(this.leaveType)
    this.fetchLeaveType();
  }
  translateText(key: string): string {
    let translation: string = '';
    this.translate.get(key).subscribe((res: string) => {
      translation = res;
    });
    return translation;
  }

  async saveLeavestype(leaveType: any) {
    this.loading = true;
    try {
      if (this.id) {
        // Create a new object without the 'leaves_allowed' property
        const updatedLeaveType = { ...this.leaveType };
        delete updatedLeaveType.leaves_allowed;

        // Update the leave type without the 'leaves_allowed' property
        await this.http.update(this.id, updatedLeaveType, {}, 'attendance/leave_type');
      } else {
        await this.http.create(this.leaveType, { __only: 'id' }, 'attendance/leave_type');
      }
      this.toaster.showToast(this.translateText('Saved Leave type successful'), 'Success', false);
    } catch (e: any) {
      this.toaster.showToast(this.translateText('Error saving Leave Type ') + e.toString(), 'Error', true);
    }
    this.loading = false;
  }

  async fetchLeaveType() {
    if (this.id) {
      this.http.get(this.id, {}, 'attendance/leave_type').then(leaveType => {
        this.leaveType.leaves_allowed = leaveType.leaves_allowed;
        this.leaveType.name = leaveType.name;
        this.leaveType.apply_before_days = leaveType.apply_before_days;
      }).catch(e => { console.error(e); });
    }
  }

  clearForm() {
    // Reset the leaveType object
    this.leaveType = <AttendanceLeaveType>{};
  }
}