import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { DataService } from 'src/app/pages/data.service';
import { ToastService } from 'src/app/pages/toast.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-report-edit',
  templateUrl: './report-edit.component.html',
  styleUrls: ['./report-edit.component.scss']
})
export class ReportEditComponent implements OnInit {

  id: any = null;
  userEmails = new FormGroup({
    email_to: new FormControl('', [
      Validators.required,
      Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]),
  });
  get email_to() {
    return this.userEmails.get('email_to');
  }
  isDisabled: boolean = false;
  newUSer = false;
  type: any;
  options = [
    { value: 'user', label: 'User', checked: true },
    { value: 'merchant', label: 'Merchant' },
  ];
  option = 'user';
  userReport:any = {
    'active': null,
    'csv': true,
    'email_body': null,
    'email_time': null,
    'email_subject': null,
    'email_to': null,
    'excel': false,
    'pdf': false,
    'email_date': null,
    'merchant': null,
    'merchant_id' : null,
    'merchant_name' : null,
    'recurring_repeat': 'daily',
    'recurring_until': null,
    'user': null,
    'user_id' : null,
    'user_name' : null,
    'reports_detail': [
      {
        'report_name': 'attendance_report',
        'server_name': 'order',
        'status': false,
      },
      {
        'report_name': 'order_report',
        'server_name': 'reporting',
        'status': false,
      },
    ],
  };
  noFileSelected: boolean | undefined;
  noReportSelected: boolean | undefined;
  userId!: string;
  details = {
    user: null,
    merchant: null,
  };

  constructor(private translate: TranslateService
,    private activateRoute: ActivatedRoute, private http: DataService, private _location: Location, private router: Router,
              private toaster: ToastService) {
    this.activateRoute.params.subscribe(res => {
      if (res['id'] !== 'new') {
        this.id = res['id'];
        this.getReport().then();
      } else {
        this.newUSer = true;
      }
    });
  }
  translateText(key: string): string {
		let translation: string='';
		this.translate.get(key).subscribe((res: string) => {
			translation = res;
		});
		return translation;
	}
  ngOnInit() {}

  async cancel() {
    this._location.back();
  }
  isFileTypeSelected () {
    if (this.userReport.csv) {
      return true;
    } else {
      return false;
    }
  }
  isReportSelected () {
    if (this.userReport.reports_detail[0].status || this.userReport.reports_detail[1].status) {
      return true;
    } else {
      return false;
    }
  }

  async save() {
    if (this.isReportSelected() && this.isFileTypeSelected()) {
      this.noFileSelected = false;
      this.noReportSelected = false;
      try {
        if (this.id) {
          await this.http.update(this.id, this.userReport, {}, 'auth/reports_schedule', 'auth');
        } else {
          const res = await this.http.create(this.userReport, {}, 'auth/reports_schedule' );
          this.id = res[0].id;
          this.newUSer = false;
          await this.router.navigate(['/pages/account-settings/report/' + this.id.toString()]);
        }
        this.toaster.showToast(this.translateText('Saved Mail successful'), 'Success', false);
      } catch (e:any) {
        this.toaster.showToast(this.translateText('Error saving Mail ') + e.toString(), 'Error', true, e);
      }} else {
      this.noFileSelected = !this.isFileTypeSelected();
      this.noReportSelected = !this.isReportSelected();
    }
  }

  async getReport() {
    try {
      const data = await this.http.get(this.id, {}, 'auth/reports_schedule');
      this.userReport = data;
      if (this.userReport.reports_detail.length === 0) {
        this.userReport.reports_detail = [{'report_name': 'attendance_report', 'server_name': 'order', 'status': false}, { 'report_name': 'order_report', 'server_name': 'reporting', 'status': false}];
      }
      if (this.userReport.user_id) {
        this.type = 'User';
        this.details.user = data.user.name;
        delete this.userReport.merchant;
        delete this.userReport.merchant_id;
        delete this.userReport.merchant_name;
      } else {
        this.type = 'Merchant';
        this.details.user = data.merchant.name;
        delete this.userReport.user;
        delete this.userReport.user_id;
        delete this.userReport.user_name;
      }
    } catch (e) {

    }
  }

  sendUser($event: any) {
    this.userReport.user = $event;
    this.userReport.user_id = $event.id;
    this.userReport.email_to = $event.email;
    this.userReport.user_name = $event.name;
    delete this.userReport.merchant;
    delete this.userReport.merchant_id;
    delete this.userReport.merchant_name;
  }

  sendMerchant($event: any) {
    this.userReport.merchant = $event;
    this.userReport.merchant_name = $event.name;
    this.userReport.merchant_id = $event.id;
    this.userReport.email_to = $event.email;
    delete this.userReport.user;
    delete this.userReport.user_name;
  }
}
