import { ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { NbDialogRef, NbDialogService } from '@nebular/theme';
import { TranslateService } from '@ngx-translate/core';
import * as FileSaver from 'file-saver';
import * as moment from 'moment';
import { Table } from 'primeng/table';
import { Subscription, interval } from 'rxjs';
import { CeleryTaskStatusDialogComponent } from 'src/app/@theme/components/celery-task-status-dialog/celery-task-status-dialog.component';
import { DataService } from '../../data.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ReverseGeocodeService } from '../reverse-geocode.service';
import { Column } from 'ng2-smart-table/lib/lib/data-set/column';

@Component({
  selector: 'app-prime-data-table',
  templateUrl: './prime-data-table.component.html',
  styleUrls: ['./prime-data-table.component.scss']
})
export class PrimeDataTableComponent implements OnInit {

  @Input() baseUrl: string = "auth";
  @Input() dateFormat!: string;
  @Input() path!: string;
  @Input() columns: Column[] = [];
  @Input() globalFilterFields = [];
  @Input() inputQuery: any = {};
  @Input() showDownload: boolean = true;
  @Input() searchFields: any[] = [];
  @Input() reportName!: string;
  @Input() editPath!: string;
  @Input() editIcon!: boolean;
  @Input() disableIcon!: boolean;
  @Input() searchAll!: boolean;
  @Input() infoIcon!: boolean;
  @Input() orderDownload: boolean = false;
  @Input() addNew: boolean = false;
  @Input() configBulkUpload: boolean = false;
  @Input() bulkuploadtd: boolean = false;
  @Input() disableColumn: any = null;
  @Output() view: EventEmitter<any> = new EventEmitter<any>();
  @Output() bulkUpload: EventEmitter<any> = new EventEmitter<any>();
  @Output() getAllData: EventEmitter<any> = new EventEmitter<any>();
  @Input() checkIntervalMS = 5000;
  @ViewChild("dt1")
  dt1!: ElementRef;
  filter = [];
  sub!: Subscription;
  timeZoneString: any;
  timeZone: any;
  query: any = {};
  i!: number;
  data: any[] = [];
  riderDisableInfo = {
    id: "",
    name: "",
    description: "",
    time: "",
    date: "",
  };
  taskId: any;
  myOptions = {
    exclusiveEndDates: true,
  };
  status = this.translateText("PENDING");
  taskResultData: any;
  url: string = "";
  taskStatusId: any;
  loading!: boolean;
  selectedProducts: any;
  // date range filter
  formatStartEndDate!: string;
  in_time_address = {};
  max = new Date();

  constructor(
    private translate: TranslateService,
    private http: DataService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    public nbDialogService: NbDialogService,
    public cd: ChangeDetectorRef,
    private address: ReverseGeocodeService
  ) {}

  ngOnInit(): void {
    if (this.path === "attendance_monthly_summary") {
      this.query.__start__equal = moment(
        new Date().setHours(0, 0, 10)
      ).toJSON();
      this.query.__end__equal = moment(new Date()).toJSON();
    } else if (this.path === "leave_type") {
      this.query = {};
    } else if (
      this.path === "rest_room" ||
      this.path === "rest_room_category"
    ) {
      this.query = {};
    } else if (this.path === "rider_report_async") {
      this.query.__created_on__datetime_gte = moment(
        new Date().setHours(0, 0, 10)
      ).toJSON();
      this.query.__created_on__datetime_lte = moment(new Date()).toJSON();
    } else if (this.path === "attendance_report") {
      this.query.__created_on__date_gte = moment(
        new Date().setHours(0, 0, 10)
      ).toJSON();
      this.query.__created_on__date_lte = moment(new Date()).toJSON();
      delete this.query.__created_on__datetime_gte;
      delete this.query.__created_on__datetime_lte;
    } else if (this.path === "deleted_rider_report") {
      this.query.__updated_on__datetime_gte = moment(
        new Date().setHours(0, 0, 10)
      ).toJSON();
      this.query.__updated_on__datetime_lte = moment(new Date()).toJSON();
      //duty_schedule
    } else if (this.path === "duty_schedule") {
      this.query.__date__date_gte = moment(
        new Date().setHours(0, 0, 10)
      ).toJSON();
      this.query.__date__date_lte = moment(new Date()).toJSON();
    } else {
      this.query.__created_on__datetime_gte = moment(
        new Date().setHours(0, 0, 10)
      ).toJSON();
      this.query.__created_on__datetime_lte = moment(new Date()).toJSON();
    }

    this.address.addressSubject.subscribe((address: any) => {
      this.in_time_address = address;
      this.data.forEach((el) => {
        const lat = parseFloat(el.in_geom?.latitude).toFixed(3);
        const lon = parseFloat(el.in_geom?.longitude).toFixed(3);
        const key: string = lat + "-" + lon;
        const lat1 = parseFloat(el.out_geom?.latitude).toFixed(3);
        const lon2 = parseFloat(el.out_geom?.longitude).toFixed(3);
        const key1: string = lat1 + "-" + lon2;
        el.in_Time_Address = address[key];
        el.out_Time_Address = address[key1];
        el.in_geom_lat_lng = el.in_geom
          ? el.in_geom.latitude + " " + el.in_geom.longitude
          : "";
        el.out_geom_lat_lng = el.out_geom
          ? el.out_geom.latitude + " " + el.out_geom.longitude
          : "";
      });
    });
    this.loadGetData().then();
    this.fetchCompanyDetails().then();
  }
  async fetchCompanyDetails() {
    const company = (await this.http.query({}, "auth/company", "auth")).data[0];
    this.timeZoneString = company.time_zone_string;
    this.timeZone = company.time_zone;
  }
  async loadGetData() {
    this.getData().then();
    if (this.status === "PENDING" && this.taskStatusId) {
      this.sub = interval(this.checkIntervalMS).subscribe(() => {
        this.getTaskStatusData();
      });
    }
  }
  translateText(key: string): string {
    let translation: string = '';
    this.translate.get(key).subscribe((res: string) => {
      translation = res;
    });
    return translation;
  }
  // get api data
  async getData(): Promise<void> {
    for (const i in this.inputQuery) {
      if (this.inputQuery.hasOwnProperty(i)) {
        this.query[i] = this.inputQuery[i];
      }
    }
    if (this.path === "attendance_report") {
      delete this.query.__created_on__datetime_gte;
      delete this.query.__created_on__datetime_lte;
    }

    if (this.path === "duty_schedule") {
      delete this.query.__created_on__datetime_gte;
      delete this.query.__created_on__datetime_lte;
      
    }
    

    if (this.query["__export__"]) {
      delete this.query["__export__"];
    }
    try {
      const data = await this.http.query(this.query, `${this.baseUrl}/${this.path}`);
      if (data) {
        this.taskStatusId = data.task_id;
        if (data.task_id) {
          await this.getTaskStatusData();
        } else {
          this.loading = false;
          this.data = data.data;
          if (this.reportName === "Deleted Rider Report") {
            this.data.map((row) => {
              row.updated_on
                ? moment(row.updated_on).format("DD-MM-YYYY HH:mm:ss")
                : "";
            });
          }
        }
      }
    } catch (e) {
      this.data = [];
    }
  }

  // pass task id for get data
  async getTaskStatusData() {
    this.data = [];
    try {
      this.loading = true;
      const taskResult = await this.http.query(
        { task_id: this.taskStatusId },
        "task_status",
        "auth"
      );
      this.taskResultData = taskResult;
      if (Array.isArray(taskResult["data"])) {
        this.data = this.getApiData(this.path, taskResult["data"]);
        if (this.path === "trip_report_async") {
          this.data = await this.getModifiedData(this.data);
        }

        this.loading = false;
      } else {
        this.url = taskResult["data"];
      }
      if (taskResult["state"] === "PENDING") {
        this.status = taskResult["state"];
      }
      if (this.status !== "PENDING") {
        if (this.sub) {
          this.loading = false;
          this.sub.unsubscribe();
        }
      }
      if (taskResult["state"] === "SUCCESS") {
        if (this.sub) {
          this.loading = false;
          this.sub.unsubscribe();
        }
      }
    } catch (e) {
      if (this.sub) {
        this.sub.unsubscribe();
      }
    }
  }

  async getModifiedData(data:any) {
    data.forEach((row:any) => {
      row["first_in_scan"] = row?.scanning_entry[0]?.start_time;
      row["first_out_scan"] = row?.scanning_entry[0]?.end_time;
      row["second_in_scan"] = row?.scanning_entry[1]?.start_time;
      row["second_out_scan"] = row?.scanning_entry[1]?.end_time;
      row["entered_at"] =
        row.time_line.length > 0
          ? row.time_line?.find((el:any) => {
              return el.status === "ENTERED";
            })?.created_on
          : "";
      row["parking_assigned_at"] =
        row.time_line.length > 0
          ? row.time_line?.find((el:any) => {
              return el.status === "PARKING_ASSIGN";
            })?.created_on
          : "";
      row["dock_assigned_at"] =
        row.time_line.length > 0
          ? row.time_line?.find((el:any) => {
              return el.status === "DOCK_ASSIGN";
            })?.created_on
          : "";
      row["start_loading_time"] =
        row.time_line.length > 0
          ? row.time_line?.find((el:any) => {
              return el.status === "START_LOADING";
            })?.created_on
          : "";
      row["end_loading_time"] =
        row.time_line.length > 0
          ? row.time_line?.find((el:any) => {
              return el.status === "STOP_LOADING";
            })?.created_on
          : "";
      row["out_for_delivery"] =
        row.time_line.length > 0
          ? row.time_line?.find((el:any) => {
              return el.status === "OUT_FOR_DELIVERY";
            })?.created_on
          : "";
      row["completed_time"] =
        row.time_line.length > 0
          ? row.time_line?.find((el:any) => {
              return el.status === "COMPLETED";
            })?.created_on
          : "";
      row["loading_time"] =
        row.time_line.length > 0
          ? Math.round(
              moment(
                row.time_line?.find((el:any) => {
                  return el.status === "STOP_LOADING";
                })?.created_on
              ).diff(
                moment(
                  row.time_line?.find((el:any) => el.status === "START_LOADING")
                    ?.created_on
                ),
                "seconds"
              ) / 60
            )
          : "";
    });
    return data;
  }

  ngOnDestroy() {
    if (this.sub) {
      this.sub.unsubscribe();
    }
  }

  // download excel
  async exportExcel() {
    if (this.orderDownload) {
      const query = Object.assign({}, this.query);
      query.__order_by = "-created_on";
      query.__created_on__datet = this.query.__created_on__datetime_gte;
      query.__created_on__datetime_lte = this.query.__created_on__datetime_lte;
      query.__export__ = true;
      query.__report_name = "order_report";
      const response = await this.http.query(
        query,
        "order_report_async",
        "report"
      );
      this.nbDialogService.open(CeleryTaskStatusDialogComponent, {
        context: {
          taskId: response.task_id,
          title: "Generating Report...",
        },
      });
    } else {
      let data;
      if (this.dt1.nativeElement["filteredValue"] === null) {
        data = this.data;
      } else if(this.path="attendance_monthly_summary"){
        data=this.dt1.nativeElement['_value'];
      
      }
      else {
        data = this.dt1.nativeElement["filteredValue"];
      }
      let copiedData = JSON.parse(JSON.stringify(data));
      copiedData.forEach((row:any) => {

        if (this.path === "scanning_entry_async") {
          console.log(row.end_time, this.timeZone);
          row.end_time = row.end_time
            ? moment(row.end_time).format("DD-MM-YYYY HH:mm:ss")
            : "";
          row.start_time = row.start_time
            ? moment(row.start_time).format("DD-MM-YYYY HH:mm:ss")
            : "";
        }

        if (this.path === "duty_schedule") {
          console.log(row.end_time, this.timeZone);
          row.created_on = row.created_on
            ? moment
                .utc(row.created_on)
                .add(this.timeZone, "minutes")
                .format("DD-MM-YYYY HH:mm:ss")
            : "";

          row.end_time = row.end_time
            ? moment(row.end_time).format("DD-MM-YYYY HH:mm:ss")
            : "";
          row.start_time = row.start_time
            ? moment(row.start_time).format("DD-MM-YYYY HH:mm:ss")
            : "";

        }
      
        if (this.path === "attendance_report") {
          row.total_working_hours = row.total_working_hours
            ? moment(row.total_working_hours, "hh:mm:ss").format("HH:mm:ss")
            : "";
            row.mark_in = row.mark_in
          ? moment(row.mark_in, "hh:mm:ss").format("hh:mm:ss")
          : "";
        row.mark_out = row.mark_out
          ? moment(row.mark_out, "hh:mm:ss").format("hh:mm:ss")
          : "";
          row.total_shift_hours = row.total_shift_hours
          ? moment(row.total_shift_hours, "hh:mm:ss").format("HH:mm:ss")
          : "";
            
        } 

        
          if (this.path === "duty_schedule") {
            delete row.break_start_time;
              delete row.break_end_time;
              delete row.rider;
              delete row.mark_in;
              delete row.mark_out;
              delete row.total_working_hours;
              delete row.total_shift_hours;
          }
      });
      if(this.path==='event_report_async'){
        copiedData.forEach((obj:any) => {
          obj['date/time'] = obj['date'];
          delete obj['date'];
        });
      }
      import("xlsx").then((xlsx) => {
        const worksheet = xlsx.utils.json_to_sheet(copiedData);
        const workbook = { Sheets: { data: worksheet }, SheetNames: ["data"] };
        const excelBuffer: any = xlsx.write(workbook, {
          bookType: "xlsx",
          type: "array",
        });
        this.saveAsExcelFile(excelBuffer, this.reportName);
      });
    }
  }
  saveAsExcelFile(buffer: any, fileName: string): void {
    const EXCEL_TYPE =
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
    const EXCEL_EXTENSION = ".xlsx";
    const data: Blob = new Blob([buffer], {
      type: EXCEL_TYPE,
    });
    FileSaver.saveAs(
      data,
      fileName + "_export_" + new Date().getTime() + EXCEL_EXTENSION
    );
  }

  // edit table data navigate page
  edit(rowData?: any) {
    if (rowData) {
      this.router
        .navigate(
          [
            this.editPath +
              (rowData != undefined
                ? rowData?.id
                  ? rowData?.id.toString(10)
                  : ""
                : ""),
          ],
          {
            relativeTo: this.activatedRoute,
            queryParamsHandling: "merge",
          }
        )
        .then();
    } else {
      this.router
        .navigate([this.editPath + "new"], {
          relativeTo: this.activatedRoute,
          queryParamsHandling: "merge",
        })
        .then();
    }
  }

  disable(row: any, column: string, dialogBox:any) {
    this.nbDialogService
      .open(dialogBox, {
        context: {
          toggle: !row[column],
          is_active: row.is_active,
        },
      })
      .onClose.subscribe(async (res:any) => {
        if (res) {
          const obj: any = {};
          obj[column] = !row[column];
          if (this.riderDisableInfo.name) {
            obj.reason = this.riderDisableInfo;
          }
          await this.http.update(row.id, obj, {}, this.path);
          row[column] = !row[column];
        }
      });
  }

  riderDisable($event: any) {
    this.riderDisableInfo.name = $event.name;
    this.riderDisableInfo.id = $event.id;
    this.riderDisableInfo.date = new Date().toDateString();
    this.riderDisableInfo.time = new Date().toTimeString();
  }

  closeRiderDialog(dialogRef: NbDialogRef<any>) {
    if (this.riderDisableInfo.name === null) {
      return;
    }
    dialogRef.close(true);
  }

  selectedDateRange(event: any) {
    if (event === "cancel") {
      this.formatStartEndDate = "";
      this.loadGetData().then();
      return false;
    }
    if (this.path === "attendance_monthly_summary") {
      this.query.__start__equal = moment(event.value[0])
        .startOf("month")
        .format("YYYY-MM-DD");
      this.query.__end__equal = moment(event.value[1])
        .endOf("month")
        .format("YYYY-MM-DD");
    } else if (this.path === "deleted_rider_report") {
      this.query.__updated_on__datetime_gte = moment(event.value[0]).toJSON();
      this.query.__updated_on__datetime_lte = moment(event.value[1]).toJSON();
    } else if (this.path === "duty_schedule") {
      this.query.__date__date_gte = moment(event.value[0]).toJSON();
      this.query.__date__date_lte = moment(event.value[1]).toJSON();
      delete this.query.__created_on__datetime_gte;
      delete this.query.__created_on__datetime_lte;
    } else if (this.path === "attendance_report") {
      this.query.__created_on__date_gte = moment(event.value[0]).toJSON();
      this.query.__created_on__date_lte = moment(event.value[1]).toJSON();
      delete this.query.__created_on__datetime_gte;
      delete this.query.__created_on__datetime_lte;
    } else {
      this.query.__created_on__datetime_gte = event.value[0].toJSON();
      this.query.__created_on__datetime_lte = event.value[1].toJSON();
    }
    this.loadGetData().then();
    return
  }

  // Clear date filter value
  ClearDateRange() {
    this.formatStartEndDate = "";
    // this.formatStartEndDate = moment().format('YYYY-MM-DD');
    if (this.path === "attendance_monthly_summary") {
      this.query.__start__equal = moment(
        new Date().setHours(0, 0, 10)
      ).toJSON();
      this.query.__end__equal = moment(new Date()).toJSON();
    } else if (this.path === "leave_type") {
      this.query = {};
    } else if (this.path === "duty_schedule") {
      this.query.__date__date_gte = moment(
        new Date().setHours(0, 0, 10)
      ).toJSON();
      this.query.__date__date_lte = moment(new Date()).toJSON();
      delete this.query.__created_on__datetime_gte;
      delete this.query.__created_on__datetime_lte;
    } else if (
      this.path === "rest_room" ||
      this.path === "rest_room_category"
    ) {
      this.query = {};
    } else if (this.path === "rider_report_async") {
      this.query.__created_on__datetime_gte = moment(
        new Date().setHours(0, 0, 10)
      ).toJSON();
      this.query.__created_on__datetime_lte = moment(new Date()).toJSON();
    } else if (this.path === "deleted_rider_report") {
      this.query.__updated_on__datetime_gte = moment(
        new Date().setHours(0, 0, 10)
      ).toJSON();
      this.query.__updated_on__datetime_lte = moment(new Date()).toJSON();
    } else if (this.path === "attendance_report") {
      this.query.__created_on__date_gte = moment(
        new Date().setHours(0, 0, 10)
      ).toJSON();
      this.query.__created_on__date_lte = moment(new Date()).toJSON();
      delete this.query.__created_on__datetime_gte;
      delete this.query.__created_on__datetime_lte;
    } else {
      this.query.__created_on__datetime_gte = moment(
        new Date().setHours(0, 0, 10)
      ).toJSON();
      this.query.__created_on__datetime_lte = moment(new Date()).toJSON();
    }
    this.loadGetData().then();
  }

  isObjectEmpty(obj:any): boolean {
    return JSON.stringify(obj) === "{}";
  }

  // Pass data for download
  getAllDataFn() {
    this.loading = true;
    let data;

    if (this.dt1.nativeElement["filteredValue"] === null) {
      data = this.data;
    } else {
      data = this.dt1.nativeElement["filteredValue"];
    }

    this.getAllData.emit(data);
    this.cd.detectChanges();
    if (this.path !== "rider_report_async") {
      this.loadGetData().then();
    }

    this.loading = false;
  }

  getApiData(path: string, data:any) {
    if (path === "order_report_elastic_async") {
      return data.map((el:any, i:any) => {
        return {
          ...data[i],
          accepted_geom_latitude:
            el.accepted_geom !== undefined ? el.accepted_geom.latitude : "",
          accepted_geom_longitude:
            el.accepted_geom !== undefined ? el.accepted_geom.longitude : "",
          custom_field_order_field1:
            el.custom_field_order !== null
              ? el.custom_field_order.field1
              : null,
          custom_field_order_field2:
            el.custom_field_order !== null
              ? el.custom_field_order.field2
              : null,
          custom_field_order_field3:
            el.custom_field_order !== null
              ? el.custom_field_order.field3
              : null,
          custom_field_order_field4:
            el.custom_field_order !== null
              ? el.custom_field_order.field4
              : null,
          custom_field_order_field5:
            el.custom_field_order !== null
              ? el.custom_field_order.field5
              : null,
          custom_field_order_field6:
            el.custom_field_order !== null
              ? el.custom_field_order.field6
              : null,
          custom_field_order_field7:
            el.custom_field_order !== null
              ? el.custom_field_order.field7
              : null,
          custom_field_order_field8:
            el.custom_field_order !== null
              ? el.custom_field_order.field8
              : null,
          custom_field_order_field9:
            el.custom_field_order !== null
              ? el.custom_field_order.field9
              : null,
          custom_field_order_field10:
            el.custom_field_order !== null
              ? el.custom_field_order.field10
              : null,
          customer_mobile_number: el.customer.mobile_number,
          customer_name: el.customer.name,
          delivered_geom_latitude:
            el.delivered_geom !== undefined ? el.delivered_geom.latitude : "",
          delivered_geom_longitude:
            el.delivered_geom !== undefined ? el.delivered_geom.longitude : "",
          delivery_address_address: el.delivery_address.address,
          delivery_address_google_address: el.delivery_address.google_address,
          delivery_address_geom_latitude: this.isObjectEmpty(
            el.delivery_address.geom
          )
            ? el.delivery_address.geom.latitude
            : "",
          delivery_address_geom_longitude: this.isObjectEmpty(
            el.delivery_address.geom
          )
            ? el.delivery_address.geom.longitude
            : "",
          dispatch_geom_latitude:
            el.dispatch_geom !== undefined ? el.dispatch_geom.latitude : "",
          dispatch_geom_longitude:
            el.dispatch_geom !== undefined ? el.dispatch_geom.longitude : "",
          outlet_brand_name: el.outlet.brand_name,
          outlet_id: el.outlet.id,
          outlet_mobile_number: el.outlet.mobile_number,
          outlet_name: el.outlet.name,
          outlet_prep_time: el.outlet.prep_time,
          pick_up_address_address: el.pick_up_address.address,
          pick_up_address_city: el.pick_up_address.city,
          pick_up_address_country: el.pick_up_address.country,
          pick_up_address_geom_latitude: el.pick_up_address.geom
            ? el.pick_up_address.geom.latitude
            : "",
          pick_up_address_geom_longitude: el.pick_up_address.geom
            ? el.pick_up_address.geom.longitude
            : "",
          rider_name: el.rider.name,
          rider_mobile_number: el.rider.mobile_number,
        };
      });
    } else if (path === "order_report_elastic_async") {
      return data.map((el:any, i:any) => {
        return {
          ...data[i],
          accepted_geom_latitude: el.accepted_geom
            ? el.accepted_geom.latitude
            : "",
          accepted_geom_longitude: el.accepted_geom
            ? el.accepted_geom.longitude
            : "",
          customer_id: el.customer.id,
          customer_mobile_number: el.customer.mobile_number,
          customer_name: el.customer.name,
          delivered_geom_latitude: el.delivered_geom
            ? el.delivered_geom.latitude
            : "",
          delivered_geom_longitude: el.delivered_geom
            ? el.delivered_geom.longitude
            : "",
          delivery_address_address: el.delivery_address.address,
          delivery_address_google_address: el.delivery_address.google_address,
          delivery_address_geom_latitude: this.isObjectEmpty(
            el.delivery_address.geom
          )
            ? el.delivery_address.geom.latitude
            : "",
          delivery_address_geom_longitude: this.isObjectEmpty(
            el.delivery_address.geom
          )
            ? el.delivery_address.geom.longitude
            : "",
          dispatch_geom_latitude: el.dispatch_geom
            ? el.dispatch_geom.latitude
            : "",
          dispatch_geom_longitude: el.dispatch_geom
            ? el.dispatch_geom.longitude
            : "",
          outlet_name: el.outlet.name,
          outlet_brand_name: el.outlet.brand_name,
          outlet_mobile_number: el.outlet.mobile_number,
          outlet_prep_time: el.outlet.prep_time,
          outlet_id: el.outlet.id,
          pick_up_address_address: el.pick_up_address.address,
          pick_up_address_mobile_number:
            el.pick_up_address.mobile_number !== null
              ? el.pick_up_address.mobile_number
              : "",
          pick_up_address_state: el.pick_up_address.state,
          pick_up_address_street:
            el.pick_up_address.street !== null ? el.pick_up_address.street : "",
          pick_up_address_title:
            el.pick_up_address.title !== null ? el.pick_up_address.title : "",
          pick_up_address_type:
            el.pick_up_address.type !== null ? el.pick_up_address.type : "",
          pick_up_address_zip:
            el.pick_up_address.zip !== null ? el.pick_up_address.zip : "",
          pick_up_address_google_address: el.pick_up_address.google_address,
          pick_up_address_city: el.pick_up_address.city,
          pick_up_address_geom_latitude: el.pick_up_address.geom
            ? el.pick_up_address.geom.latitude
            : "",
          pick_up_address_geom_longitude: el.pick_up_address.geom
            ? el.pick_up_address.geom.longitude
            : "",
          reached_destination_geom_latitude: el.reached_destination_geom
            ? el.reached_destination_geom.latitude
            : "",
          reached_destination_geom_longitude: el.reached_destination_geom
            ? el.reached_destination_geom.longitude
            : "",
          reached_pick_up_geom_latitude: el.reached_pick_up_geom
            ? el.reached_pick_up_geom.latitude
            : "",
          reached_pick_up_geom_longitude: el.reached_pick_up_geom
            ? el.reached_pick_up_geom.longitude
            : "",
          rider_name: el.rider.name,
          rider_mobile_number: el.rider.mobile_number,
          rider_type_id: el.rider.type_id,
        };
      });
    } else if (path === "rider_report_async") {
      this.address.addresses = {};
      return data.map((el:any, i:any) => {
        this.address.getAddress(el.in_geom?.latitude, el.in_geom?.longitude);
        this.address.getAddress(el.out_geom?.latitude, el.out_geom?.longitude);
        return {
          ...data[i],
          in_geom_latitude: el.in_geom ? el.in_geom.latitude : "",
          in_geom_longitude: el.in_geom ? el.in_geom.longitude : "",
          rider_employee_id: el.rider.employee_id,
          rider_outlet_id:
            el.rider.outlet_id !== null ? el.rider.outlet_id : "",
          rider_outlet_name:
            el.rider.outlet_name !== null ? el.rider.outlet_name : "",
          rider_unique_id:
            el.rider.unique_id !== null ? el.rider.unique_id : "",
          in_geom_lat_lng: el.in_geom
            ? el.in_geom.latitude + " " + el.in_geom.longitude
            : "",
          out_geom_lat_lng: el.out_geom
            ? el.out_geom.latitude + " " + el.out_geom.longitude
            : "",
        };
      });
    } else if (this.path === "event_report_async") {
      return data.map((el:any, i:any) => {
        if (el.device_details && el.device_details.event) {
          return {
            ...data[i],
            device_all_details: null,
          };
        } else {
          return {
            ...data[i],
            device_all_details: el.device_details
              ? el.device_details?.androidVersion
                ? "Android Version: " +
                  el.device_details?.androidVersion +
                  ", " +
                  "App Version: " +
                  el.device_details?.app_version +
                  ", " +
                  "Device Type: " +
                  el.device_details?.device_type +
                  ", " +
                  "Manufacturer: " +
                  el.device_details?.manufacturer +
                  ", " +
                  "Model: " +
                  el.device_details?.model +
                  ", " +
                  "Sdk: " +
                  el.device_details?.sdk +
                  ", "
                : "iOS Version: " +
                  el.device_details?.iOSVersion +
                  ", " +
                  "App Version: " +
                  el.device_details?.app_version +
                  ", " +
                  "Device Type: " +
                  el.device_details?.device_type +
                  ", " +
                  "Manufacturer: " +
                  el.device_details?.manufacturer +
                  ", " +
                  "Model: " +
                  el.device_details?.model +
                  ", " +
                  "Sdk: " +
                  el.device_details?.sdk +
                  ", "
              : "",
          };
        }
      });
    } else {
      return data;
    }
  }

  searchFilter(event: any, dt1: Table) {
    dt1.filterGlobal(event.target.value, "contains");
  }
}
