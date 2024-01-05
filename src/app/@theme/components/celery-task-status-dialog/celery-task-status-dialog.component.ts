import { DatePipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { NbDialogRef } from '@nebular/theme';
import { TranslateService } from '@ngx-translate/core';
import * as FileSaver from 'file-saver';
import * as moment from 'moment';
import { Subscription, interval } from 'rxjs';
import { DataService } from 'src/app/pages/data.service';
import { ToastService } from 'src/app/pages/toast.service';

@Component({
  selector: 'app-celery-task-status-dialog',
  templateUrl: './celery-task-status-dialog.component.html',
  styleUrls: ['./celery-task-status-dialog.component.scss']
})
export class CeleryTaskStatusDialogComponent implements OnInit {


  @Input() checkIntervalMS = 5000;

  @Input() taskId: any;
  @Input() disableDownload = false;

  @Input() title = '';

  @Input() allowClose = false;

  @Input() componentName: any;

  dataList: any[] = [];
  sub!: Subscription;
  status = this.translateText('PENDING');
  url: any;
  errorData: any;

  // 'SUCCESS' or 'FAILURE'
  taskResultData: any;
  count = 0;
  message = '';
  downloadData=[];
  autoRouteTableSettings = {
      actions: {
        add: false,
        edit: false,
        delete: false,
      },
      hideSubHeader: true,
      pager: {
        display: true,
        perPage: 10,
      },
      columns: {
      rider_mobile_number: {
          title: 'Rider Mobile Number',
          type: 'html',
      },
      error: {
          title: 'Error message',
          type: 'html',
      },
      },
    };
  constructor(private http: DataService, public ref: NbDialogRef<CeleryTaskStatusDialogComponent>,
              private toast: ToastService, private datePipe: DatePipe, private translate: TranslateService) {
  }
  translateText(key: string): string {
      let translation: string='';
      this.translate.get(key).subscribe((res: string) => {
          translation = res;
      });
      return translation;
  }
  ngOnInit() {
      this.checkAndInitSubscription().then();
  }

  async checkAndInitSubscription() {
      await this.getTaskStatus();

      if (this.status === 'PENDING') {
          this.sub = interval(this.checkIntervalMS)
              .subscribe(() => {
                  this.getTaskStatus().then();
                  this.count += 1;
              });
      }
  }

  async getTaskStatus() {
      try {
          // const taskResult = (await this.http.query({task_id: this.taskId}, 'task_status', 'auth'));
          if ((this.componentName === 'payout') || (this.componentName === 'udaan')) {
              const taskResult = (await this.http.query({task_id: this.taskId}, 'task_status', 'auth'));
              this.taskResultData = {
                  data: [],
                  state: '',
              };
              this.status = 'ERROR';
              this.errorData = taskResult.data[1];
              this.taskResultData.data = taskResult.data[0];
              this.taskResultData.state = taskResult.state;
              if (Array.isArray(taskResult['data'][0])) {
                  this.dataList = taskResult['data'][0];
              } else {
                  this.url = taskResult['data'][0];
              }
              this.status = taskResult['state'];

              if (this.status !== 'PENDING') {
                  if (this.sub) {
                      this.sub.unsubscribe();
                  }
              }
          } else if (this.componentName === 'bulk-upload') {
              const taskResult = (await this.http.query({task_id: this.taskId}, 'task_status', 'auth'));
              this.taskResultData = {
                  data: [],
                  state: '',
              };
              this.status = 'ERROR';
              this.errorData = [];
              this.taskResultData.data = taskResult.data[0];
              this.taskResultData.state = taskResult.state;
              for (let i = 0; i < taskResult.data[1].length; i++) {
                  this.errorData.push(Object.values(taskResult.data[1][i][i]));
              }
              if (this.errorData.length === 0) {
                  this.ref.close(true);
              }
              if (Array.isArray(taskResult['data'][0])) {
                  this.dataList = taskResult['data'][0];
              } else {
                  this.url = taskResult['data'][0];
              }
              this.status = taskResult['state'];

              if (this.status !== 'PENDING') {
                  if (this.sub) {
                      this.sub.unsubscribe();
                  }
              }
          } else if (this.componentName === 'roaster-bulk-upload') {
              const taskResult = (await this.http.query({task_id: this.taskId}, 'task_status', 'auth'));
              this.taskResultData = taskResult;
              if (this.taskResultData.state === 'SUCCESS') {
                  this.downloadData = [];
                  this.title = 'Upload Success';
                  const downloadData:any= [];
                  for (const [key, value] of Object.entries<any>(this.taskResultData)) {
                      let newData = {};
                      if (value['failed']) {
                          if (value['failed'].length !== 0) {
                              value['failed'].map(function (failed:any, failedIndex:any) {
                                  const end_time = failed.end_time ? moment(failed.end_time).format('YYYY-MM-DD hh:mm:ss') : null;
                                  const start_time = failed.start_time ? moment(failed.start_time).format('YYYY-MM-DD hh:mm:ss') : null;
                                  newData = {'date': failed.date, 'start_time': start_time, 'end_time': end_time, 'is_week_off': failed.is_week_off, 'rider_mobile_number': failed.rider_mobile_number, 'is_off': failed.is_off, 'status': 'Failure', 'Remark': failed.error };
                                  downloadData.push(newData);
                              });
                          }
                      }
                      if (value['success']) {
                          if (value['success'].length !== 0) {
                              value['success'].map(function (success:any, successIndex:any) {
                                  const end_time = success.end_time ? moment(success.end_time).format('YYYY-MM-DD hh:mm:ss') : null;
                                  const start_time = success.start_time ? moment(success.start_time).format('YYYY-MM-DD hh:mm:ss') : null;
                                  newData = {'date': success.date, 'start_time': start_time, 'end_time': end_time, 'is_week_off': success.is_week_off, 'rider_mobile_number': success.rider_mobile_number, 'is_off': success.is_off, 'status': 'Success', 'Remark': '' };
                                  downloadData.push(newData);
                              });
                          }
                      }
                   }
                  this.downloadData = downloadData;
              }
              if (this.count === 20) {
                  if (this.status === 'PENDING') {
                      this.message = 'Its take 20 or 30 min for update';
                      if (this.sub) {
                          this.sub.unsubscribe();
                      }
                  }
              }
              if (this.url?.error === true) {
                  this.status = 'FAILURE';
              } else {
                  this.status = taskResult['state'];
              }
              if (this.status !== 'PENDING') {
                  if (this.sub) {
                      this.sub.unsubscribe();
                  }
              }

          } else {
              const taskResult = (await this.http.query({task_id: this.taskId}, 'task_status', 'auth'));
              this.taskResultData = taskResult;
              if (Array.isArray(taskResult['data'])) {
                  this.dataList = taskResult['data'];
              } else {
                  this.url = taskResult['data'];
              }
              if (this.count === 20) {
                  if (this.status === 'PENDING') {
                      this.message = 'Its take 20 or 30 min for update';
                      if (this.sub) {
                          this.sub.unsubscribe();
                      }
                  }
              }
              if (this.url?.error === true) {
                  this.status = 'FAILURE';
              } else {
                  this.status = taskResult['state'];
              }
              if (this.status !== 'PENDING') {
                  if (this.sub) {
                      this.sub.unsubscribe();
                  }
              }
          }

      } catch (e:any) {
          this.taskResultData = e.error;
          this.status = 'FAILURE';
          this.toast.showToast(this.translateText('Error Uploading Data'), 'Error', true);

          if (this.sub) {
              this.sub.unsubscribe();
          }
      }
  }

  ngOnDestroy() {
      if (this.sub) {
          this.sub.unsubscribe();
      }
  }

  closeDialog(ref: NbDialogRef<CeleryTaskStatusDialogComponent>) {
      ref.close(this.taskResultData);
  }
  closeDialogref(ref: NbDialogRef<CeleryTaskStatusDialogComponent>) {
      ref.close('notFound');
  }

  downloadToExcel(){
      import('xlsx').then(xlsx => {
          const worksheet = xlsx.utils.json_to_sheet(this.downloadData);
          const workbook = {Sheets: {'data': worksheet}, SheetNames: ['data']};
          const excelBuffer: any = xlsx.write(workbook, {bookType: 'xlsx', type: 'array'});
          this.saveAsExcelFile(excelBuffer, 'RoasterStatus');
      });
  }
  saveAsExcelFile(buffer: any, fileName: string): void {
      const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
      const EXCEL_EXTENSION = '.xlsx';
      const data: Blob = new Blob([buffer], {
          type: EXCEL_TYPE,
      });
      FileSaver.saveAs(data, fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION);
  }
}
