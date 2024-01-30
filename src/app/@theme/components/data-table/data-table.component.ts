import { Component, ElementRef, EventEmitter, Input, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { NbCalendarRange, NbDialogRef, NbDialogService } from '@nebular/theme';
import { TranslateService } from '@ngx-translate/core';
import * as moment from 'moment';
import { LocalDataSource } from 'ng2-smart-table';
import { DataService } from 'src/app/pages/data.service';
import { ToastService } from 'src/app/pages/toast.service';
import { CeleryTaskStatusDialogComponent } from '../celery-task-status-dialog/celery-task-status-dialog.component';
import * as saveAs from 'file-saver';
import * as XLSX from 'xlsx';
export interface Column {
  name: string;
  sortable?: boolean;
  filter?: boolean;
  displayName: string;
  filterFn?: () => {};
  sortFn?: () => {};
  displayFn?: (row: any, columnName: any) => {};
}
@Component({
  selector: 'app-data-table',
  templateUrl: './data-table.component.html',
  styleUrls: ['./data-table.component.scss']
})
export class DataTableComponent implements OnInit {
  @ViewChild("table") dt1!: ElementRef;
  @Input() route_company_config: boolean = false;
  @Input() columns: Column[] = [];
  @Input() auto: boolean = true;
  @Input() dialogInputColumn: any[] = [];
  @Input() dialogCheckboxColumn: any[] = [];
  @Input() dialogDropdownColumn: any[] = [];
  @Input() filters: any[] = [];
  @Input() only: string[] = [];
  @Input() include: string[] = [];
  @Input() path!: string;
  @Input() downloadPath!: string;
  @Input() baseUrl: string = "auth";
  @Input() editPath!: string;
  @Input() reportName!: string;
  @Input() addNew = true;
  @Input() newOnBoardedRiders!: boolean;
  @Input() searchIcon = true;
  @Input() footer = true;
  @Input() inputQuery: any = {};
  @Input() infoIcon: boolean = false;
  @Input() editIcon!: boolean;
  @Input() folderIcon!: boolean;
  @Input() disableIcon!: boolean;
  @Input() deleteIcon!: boolean;
  @Input() deleteRowIcon: boolean = false;
  @Input() deleteColumn: string = '';
  @Input() disableColumn: string = '';
  @Input() refresh: boolean = false;
  @Input() searchField: string = '';
  @Input() multipleZoneEvent: any[] = [];
  @Input() searchFields: any[] = [];
  @Input() searchTerm: string = '';
  @Input() riderSearch: boolean = false;
  @Input() configBulkUpload: boolean = false;
  @Input() dateFilter: boolean = false;
  @Input() singleDay: boolean = false;
  @Input() canDownload: boolean = true;
  @Input() orderDownload: boolean = false;
  @Input() exportExcel: boolean = false;
  @Input() isInvoice: boolean = false;
  @Input() monthFilter: boolean = false;
  @Input() excelUpload: boolean = false;
  @Input() timeFilter: boolean = false;
  @Input() multipleZone: boolean = false;
  @Input() isManage: boolean = false;
  @Input() isDateTime = false;
  @Input() configBulkUploadforTD = false;
  @Input() refreshdata = false;
  @Input() routeCompanyConfigData: any;
  riderId: string | undefined;
  @ViewChild("table") table: any;
  @Output() sendQuery: EventEmitter<any> = new EventEmitter<any>();
  dateRange: NbCalendarRange<Date> = { start: new Date(), end: new Date() };
  dateFilterRange:any;
  page: number = 1;
  totalPages: any;
  currPage: number;
  @Input() limit = 10;
  data: any[] = [];
  query: any = new Object({});
  startDate: any;
  endDate: any;
  startDateFilter: any;
  endDateFilter: any;
  fromDate: any;
  toDate: any;
  date!: Date;
  loading: boolean = true;
  tableDataSource: LocalDataSource = new LocalDataSource();
  file!: File;
  tableSettings = {
    actions: {
      add: false,
      edit: false,
      delete: false,
      search: false,
    },
    pager: {
      display: true,
      perPage: 10,
    },
    columns: {
      name: { title: "Name", filter: false },
      password: { title: "Password", filter: false },
      mobile_number: { title: "Mobile Number", filter: false },
      email: { title: "Email", filter: false },
      zone: { title: "Zone", filter: false },
      employee_id: { title: "Employee ID", filter: false },
    },
  };
  [key: string]: any;

  @Output() view: EventEmitter<any> = new EventEmitter<any>();
  @Output() bulkUpload: EventEmitter<any> = new EventEmitter<any>();
  @Output() download_pdf: EventEmitter<any> = new EventEmitter<any>();
  @Output() upload_excel: EventEmitter<any> = new EventEmitter<any>();
  selectedMonth!: Date;
  dialogRef!: NbDialogRef<any>;
  closePopup = true;
  selectedDateTime = "";
  min = new Date();
  max!: number;
  dateControls = ["calender"];
  zoneIds: any = [];
  fieldName: any;
  riderDisableInfo = {
    id: "",
    name: "",
    description: "",
    time: "",
    date: "",
  };
  keyName: any;
  myOptions = {
    exclusiveEndDates: true,
  };
  checked: any;
  count: any;

  startEndDate: any;
  newOnBoardedRider: boolean = false;
  allOnBoardedRider: boolean = false;
  calendarStartDate: any;
  calendarEndDate: any;
  manual_touch_point_status:any;
  constructor(
    private http: DataService,
    private router: Router,
    private toaster: ToastService,
    public nbDialogService: NbDialogService,
    private activatedRoute: ActivatedRoute,
    private translate: TranslateService
  ) {
    this.totalPages = 1;
    this.currPage = 1;
  }

  translateText(key: string): string {
    let translation: string = '';
    this.translate.get(key).subscribe((res: string) => {
      translation = res;
    });
    return translation;
  }
  ngOnChanges(changes: SimpleChanges) {
    if (changes?.['route_company_config']?.currentValue === true) {
      this.getCompanyRouteConfig();
    }
    if (changes?.['refreshdata']?.currentValue === true) this.loadData().then();
    if (this.orderDownload) {
      this.startDate = moment(new Date().setHours(0, 0)).toJSON();
      this.endDate = moment(new Date().setHours(0, 0)).add(1, "day").toJSON();
      this.selectedDateTime =
        "" +
        moment(this.startDate).format("DD/MM/YYYY") +
        " - " +
        moment(this.endDate).format("DD/MM/YYYY");
    }
    if (
      (changes.hasOwnProperty("inputQuery") &&
        !changes['inputQuery'].firstChange) ||
      (changes.hasOwnProperty("refresh") &&
        changes['refresh'].currentValue === true)
    ) {
      this.loadData().then();
    }
  }

  ngOnInit() {
    console.log(this.routeCompanyConfigData);
    this.max = this.min.setMonth(this.min.getMonth() - 12);
    if (!this.isManage) {
      this.startDate = moment(new Date().setHours(0, 0, 0)).toJSON();
      this.endDate = moment(new Date().setHours(23, 59, 59)).toJSON();
    }
  }

  ngAfterViewInit() {
    const params = window.sessionStorage.getItem("query");
    if (params) {
      const data = JSON.parse(params);
      try {
        if (
          data.hasOwnProperty("path") &&
          JSON.parse(data["path"]) === this.path
        ) {
          return this.setFilterValues(data);
        } else {
          window.sessionStorage.removeItem("query");
        }
      } catch (e) {
        window.sessionStorage.removeItem("query");
      }
    }

    this.loadData().then();
  }

  setFilterValues(params: Params) {
    for (const paramsKey in params) {
      if (params.hasOwnProperty(paramsKey)) {
        try {
          this[paramsKey] = JSON.parse(params[paramsKey]);
        } catch (e:any) {
          console.error(e);
        }
      }
    }
    this.currPage = this.page;
    this.filters.forEach((filter) => {
      this.query[filter.value] = filter.checked;
    });
    if (this.dateFilter) {
      this.changeRange(this.dateRange);
    } else {
      this.loadData().then();
    }
  }

  async nextPage() {
    this.currPage =
      this.currPage < this.totalPages ? this.currPage + 1 : this.currPage;
    this.page = this.currPage;
    delete this.query.__export;
    await this.loadData();
  }

  async previousPage() {
    this.currPage = this.currPage > 1 ? this.currPage - 1 : this.currPage;
    this.page = this.currPage;
    delete this.query.__export;
    await this.loadData();
  }

  async setPage() {
    this.currPage =
      this.currPage > this.totalPages
        ? this.totalPages
        : this.currPage <= 0
        ? 1
        : this.currPage;
    this.page = this.currPage;
    delete this.query.__export;
    await this.loadData();
  }

  async search(clear?: boolean) {
    if (clear) {
      this.searchFields.forEach((s) => {
        if (s.hasOwnProperty("term")) {
          s.term = undefined;
          if (this.fieldName === undefined) {
            s.name = "";
          } else {
            s.name =
              s.name.toLowerCase() === this.fieldName?.toLowerCase()
                ? ""
                : s.name;
          }
          this.startDateFilter = this.endDateFilter = undefined;
          this.dateFilterRange = null;
          this.closePopup = true;
        }
      });
      this.closePopup = true;
    } else {
      this.closePopup = true;
    }
    this.page = 1;
    this.loadData().then();
  }

  async loadData() {
    try {
      const data = await this.getData();
      this.data = data.data;
      // if (this.path === 'order_report') {
      //     for (const order of this.data) {
      //         order.start_odometer_reading = order.start_odometer ? order.start_odometer.reading : 0;
      //         order.end_odometer_reading = order.end_odometer ? order.end_odometer.reading : 0;
      //     }
      // }
      this.count = data.total ? data.total : data.count;
      this.totalPages = Math.ceil(
        (data.total ? data.total : data.count) / this.limit
      );
    } catch (e) {
      this.data = [];
    }
    this.loading = false;
  }

  async getData(): Promise<any> {
    try {
      if (this.monthFilter && (!this.startDate || !this.endDate)) {
        const newDate = new Date();
        this.startDate = moment(newDate).startOf("month").format("YYYY-MM-DD");
        this.endDate = moment(newDate).endOf("month").format("YYYY-MM-DD");
        this.selectedMonth = moment(newDate).toDate();
      }
      if (!this.auto && (!this.startDate || !this.endDate)) {
        return;
      }
      this.query.__zone_id__in = this.zoneIds;
      this.query.__page = this.page;
      this.query.__only = this.only;
      this.query.__include = this.include;
      this.query.__limit = this.limit;
      this.query.__rider_id__equal = this.riderId;

      if (this.searchField) {
        this.query[this.searchField] = this.searchTerm;
      }
      if (this.searchFields) {
        this.searchFields.forEach((s) => {
          if (s.hasOwnProperty("term")) {
            if (
              (s.type === "date-range-start" || s.type === "date-range-end") &&
              this.startDateFilter &&
              this.endDateFilter
            ) {
              this.query[s.value] =
                s.type === "date-range-start"
                  ? this.startDateFilter
                  : this.endDateFilter;
            } else {
              this.query[s.value] = s.term;
            }
          }
        });
      }

      if (this.isInvoice) {
        this.query.__date__date_gte = this.fromDate;
        this.query.__date__date_lte = this.toDate;
      } else if (this.monthFilter) {
        this.query.__start__equal = this.startDate;
        this.query.__end__equal = this.endDate;
      }
       else if (this.path === "rider_feedback_report") {
        this.query.__last_feedback_at__datetime_gte = this.startDate;
        this.query.__last_feedback_at__datetime_lte = this.endDate;
      }
      else if (this.path === "leave_request" ){
        if(this.reportName !== "Pending Leave"){
          this.query.__updated_on__datetime_gte = this.startDate;
          this.query.__updated_on__datetime_lte = this.endDate;
        }
        delete this.query.__created_on__date_gte;
        delete this.query.__created_on__date_lte;
      }
       else if (this.isDateTime && !this.isManage) {
        if (this.startEndDate) {
          this.query.__created_on__datetime_gte = this.startDate;
          this.query.__created_on__datetime_lte = this.endDate;
        } else {
          if (this.path === "rest_room_category" || this.path === "rest_room") {
            delete this.query["__created_on__datetime_gte"];
            delete this.query["__created_on__datetime_lte"];
          }
        }
      }
       else {
        if (!this.isManage) {
          this.query.__created_on__date_gte = this.startDate;
          this.query.__created_on__date_lte = this.endDate;
        }
      }

      for (const i in this.inputQuery) {
        if (this.inputQuery.hasOwnProperty(i)) {
          this.query[i] = this.inputQuery[i];
        }
      }
      if (this.query["__export__"]) {
        delete this.query["__export__"];
      }
      const queryObject = this.query;
      this.sendQuery.emit(queryObject);
      return await this.http
        .query(this.query, this.path, this.baseUrl)
        .then()
        .catch((error) => {
          this.data = [];
          if (
            error?.error?.error === true &&
            error?.error?.message === "No Resource Found"
          ) {
            // this.toaster.showToast("No Resource found", "Error", true, error);
          }
        });
    } catch (e) {
      this.data = [];
    }
  }

  applyFilter(filter: any, value: boolean) {
    filter.checked = value ? true : undefined;
    this.query[filter.value] = filter.checked;
    this.page = 1;
    this.loadData().then();
  }

  async download() {
    const query = Object.assign({}, this.query);
    query.__export__ = true;
    query.__limit = this.count;
    query.__page = 1;
    if (this.path === "outlet") {
      this.path = "outlet_get";
    }
    return await this.http.downloadFile(query, this.path, this.baseUrl);
  }

  async saveAs() {
    try {
      if (this.downloadPath) {
        const query = Object.assign({}, this.query);
        query.__export__ = true;
        const task_status = await this.http.query(
          query,
          this.downloadPath,
          this.baseUrl
        );
        this.nbDialogService.open(CeleryTaskStatusDialogComponent, {
          context: {
            taskId: task_status["task_id"],
            title: "Generating Report...",
          },
        });
      } else {
        const data = await this.download();
        const blob = new Blob([data], { type: "text/csv;charset=utf-8;" });
        if (this.query.__report_name) {
          saveAs(
            blob,
            this.query.__report_name +
              "_" +
              new Date().toISOString().slice(0, 19).replace(/T/, "_") +
              ".csv"
          );
        } else if (this.reportName) {
          saveAs(
            blob,
            this.reportName +
              "_" +
              new Date().toISOString().slice(0, 19).replace(/T/, "_") +
              ".csv"
          );
        } else {
          saveAs(
            blob,
            new Date().toISOString().slice(0, 19).replace(/T/, "_") + ".csv"
          );
        }
      }
    } catch (e) {
      return;
    }
  }

  async edit(id?: number) {
    window.sessionStorage.setItem(
      "query",
      JSON.stringify({
        page: this.page,
        only: this.only,
        path: JSON.stringify(this.path),
        include: this.include,
        limit: this.limit,
        startDate: JSON.stringify(this.startDate),
        endDate: JSON.stringify(this.endDate),
        inputQuery: JSON.stringify(this.inputQuery),
        searchFields: JSON.stringify(this.searchFields),
        filters: JSON.stringify(this.filters),
      })
    );
    this.router
      .navigate([this.editPath + (id ? id.toString(10) : "new")], {
        relativeTo: this.activatedRoute,
        queryParamsHandling: "merge",
      })
      .then();
  }

  disable(row: any, column: string, dialogBox:any) {
    this.nbDialogService
      .open(dialogBox, {
        context: {
          toggle: !row[column],
          is_active: row.is_active,
        },
      })
      .onClose.subscribe(async (res) => {
        if (res) {
          const obj: any = {};
          obj[column] = !row[column];
          if (this.riderDisableInfo.name) {
            obj.reason = this.riderDisableInfo;
          }
          await this.http.update(row.id, obj, {}, this.path, this.baseUrl);
          row[column] = !row[column];
        }
      });
  }

  async delete(row: any, column: string, dialogBox:any) {
    // const index = this.data.findIndex(x => x.id === row.id);
    // this.data.splice(index, 1);
    // await this.http.delete(row.id, {}, this.path, this.baseUrl);
    this.nbDialogService
      .open(dialogBox, {
        context: {
          toggle: !row[column],
          is_active: row.is_active,
        },
      })
      .onClose.subscribe(async (res) => {
        if (res) {
          this.http
            .delete(row.id, {}, "auth/delete_rider")
            .then(() => {
              this.toaster.showToast(
                "Rider Deleted successfully",
                "Success",
                false
              );
              this.loadData().then();
            })
            .catch((e) => {
              this.toaster.showToast(e?.message, "Error", true, e);
            });
        }
      });
  }

  async deleteRow(row: any, index: number) {
    this.http
      .delete(row.id, {}, this.path, this.baseUrl)
      .then(() => {
        this.toaster.showToast(
          this.translateText("Deleted successfully"),
          "Success",
          false
        );
        this.loadData().then();
        this.data.splice(index, 1);
      })
      .catch((e) => {
        this.toaster.showToast(e?.message, "Error", true, e);
      });
  }

  setRiderId(ev:any) {
    this.riderId = ev;
    this.loadData().then();
  }

  changeRange(event: any) {
    this.isManage = false;
    if (event && event.value[0] && event.value[1]) {
      this.startDate = event.value[0].toJSON();
      if (this.path === "leave_request") {
        const endDate = event.value[1];
        endDate.setDate(endDate.getDate() + 1);
        this.endDate = endDate.toJSON();
      } else {
        this.endDate = event.value[1].toJSON();
      }
      this.page = 1;
      this.loadData().then();
    } else {
      this.startDate = undefined;
      this.endDate = undefined;
    }
  }

  dateChange(ev: Date) {
    if (ev) {
      this.startDate = ev.toJSON();
      const endDate = ev;
      endDate.setDate(ev.getDate() + 1);
      this.endDate = endDate.toJSON();
      this.currPage = 1;
      this.page = 1;
      this.loadData();
    }
  }

  selectMonth(event:any) {
    this.startDate = moment(event.value[0])
      .startOf("month")
      .format("YYYY-MM-DD");
    this.endDate = moment(event.value[1]).endOf("month").format("YYYY-MM-DD");
    this.selectedMonth = moment(event).toDate();
    this.currPage = 1;
    this.page = 1;
    this.loadData();
  }

  changeInvoiceRange(event: any) {
    if (event && event.value[0] && event.value[1]) {
      this.fromDate = event.value[0].toJSON();
      this.toDate = event.value[1].toJSON();
      this.page = 1;
      this.loadData().then();
    } else {
      this.fromDate = undefined;
      this.toDate = undefined;
    }
  }

  invoiceDateChange(ev: any) {
    if (ev) {
      this.fromDate = ev.value[0].toJSON();
      const toDate = ev.value[1];
      toDate.setDate(ev.getDate() + 1);
      this.toDate = toDate.toJSON();
      this.currPage = 1;
      this.page = 1;
      this.loadData();
    }
  }

  async fileUpload(e:any): Promise<any> {
    this.tableDataSource.reset();
    const file: File = e.files[0];
    const reader = new FileReader();
    const tableData: Array<any> = await this.tableDataSource.getAll();
    reader.onloadend = () => {
      const data = reader.result;
      const workbook = XLSX.read(data, { type: "binary", cellDates: true });

      const worksheet = workbook.Sheets['Sheet1'];
      const payout: Array<any> = XLSX.utils.sheet_to_json(worksheet, {
        raw: false,
      });
      this.tableDataSource.load(payout.concat(tableData));
      this.file = file;
    };
    reader.readAsBinaryString(file);
  }

  async uploadFile() {
    const tableData: Array<any> = await this.tableDataSource.getAll();
    if (tableData.length > 0) {
      this.upload_excel.emit(tableData);
      this.dialogRef.close();
    } else {
      this.toaster.showToast(
        this.translateText("PLease choose a file!"),
        "Error",
        true
      );
    }
  }

  closeDialog() {
    this.tableDataSource = new LocalDataSource();
    this.dialogRef.close();
  }

  filterDateRange(event: any) {
    if (event && event.value[0] && event.value[1]) {
      this.startDateFilter = event.value[0].toJSON();
      this.endDateFilter = event.value[1].toJSON();
    } else {
      this.startDateFilter = undefined;
      this.endDateFilter = undefined;
    }
  }

  async orderReportDownload() {
    const query = Object.assign({}, this.query);
    query.__order_by = "-created_on";
    query.__created_on__date_gte = this.startDate;
    query.__created_on__date_lte = this.endDate;
    query.__export__ = true;
    query.__report_name = "order_report";
    this.startDate = this.startDate
      ? this.startDate
      : moment(new Date()).set("hours", 5).set("minutes", 30).toJSON();
    this.endDate = this.endDate
      ? this.endDate
      : moment(this.startDate).add(23, "hours").add(59, "minutes").toJSON();
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
  }

  setDateTime(event:any) {
    if (event && event.value[0] && event.value[1]) {
      this.startDate = event.value[0].toJSON();
      this.endDate = event.value[1].toJSON();
      this.page = 1;
      this.loadData().then();
    }
  }

  multiZoneFilter(zone:any) {
    this.zoneIds = [];
    zone.forEach((row:any) => {
      this.zoneIds.push(row.id);
    });
    this.query.__zone_id__in = this.zoneIds;
    this.loadData().then();
  }

  riderDisable($event: any) {
    this.riderDisableInfo.name = $event.name;
    this.riderDisableInfo.id = $event.id;
    this.riderDisableInfo.date = new Date().toDateString();
    this.riderDisableInfo.time = new Date().toTimeString();
  }

  closeRiderDialog(dialogRef: NbDialogRef<any>) {
    if (this.riderDisableInfo.name === null) {
      this.toaster.showToast(
        this.translateText("PLease choose a reason!"),
        "Error",
        true
      );
      return;
    }
    dialogRef.close(true);
  }

  getEvent($event: any, field:any) {
    field.name = $event.name;

    field.term = $event.id;
    this.fieldName = $event.name;
    if ("name" in $event) {
      this.keyName = "name";
    } else {
      this.keyName = "registration_number";
    }
  }

  getValue(event: any) {
    this.fieldName = event.target.value;
  }
  onPaste(event: any) {
    this.fieldName = event.target.value;
  }

  cancel(_event: any) {
    if (this.newOnBoardedRider) {
      this.startDate = moment(new Date().setHours(0, 0))
        .subtract(7, "day")
        .toJSON();
      this.endDate = moment(new Date().setHours(0, 0)).toJSON();
      this.query.__created_on__datetime_gte = this.startDate;
      this.query.__created_on__datetime_lte = this.endDate;
      this.startEndDate = "";
      this.loadData().then();
    } else {
      if (this.startDate && this.endDate) {
        this.startEndDate = [
          new Date(moment(new Date().setHours(0, 0, 0)).toJSON()),
          new Date(moment(new Date().setHours(23, 59, 59)).toJSON()),
        ];
        this.startDate = moment(new Date().setHours(0, 0, 0)).toJSON();
        this.endDate = moment(new Date().setHours(23, 59, 59)).toJSON();
        this.startEndDate = "";
        // this.query.__created_on__date_gte = this.startDate;
        // this.query.__created_on__date_lte = this.endDate;

        this.loadData().then();
      }
    }
  }

  async seeNewOnboardedRider(event:any) {
    this.newOnBoardedRider = event;
    if (event) {
      this.startDate = null;
      this.endDate = null;
      this.startEndDate = "";
      this.startDate = moment(new Date().setHours(0, 0))
        .subtract(7, "day")
        .toJSON();
      this.calendarStartDate = moment(new Date().setHours(0, 0))
        .subtract(6, "day")
        .toJSON();
      this.endDate = moment(new Date().setHours(0, 0)).toJSON();
      this.calendarEndDate = moment(new Date().setHours(0, 0))
        .add(1, "day")
        .toJSON();
      this.query.__created_on__datetime_gte = this.startDate;
      this.query.__created_on__datetime_lte = this.endDate;
      this.loadData().then();
      await this.toaster.showToast(
        this.translateText("Showing last 7 days OnBoarded Riders"),
        "Success",
        false
      );
    } else {
      this.startDate = null;
      this.endDate = null;
      this.calendarStartDate = null;
      this.calendarEndDate = null;
      this.startEndDate = "";
      delete this.query.__created_on__datetime_gte;
      delete this.query.__created_on__datetime_lte;
      this.loadData().then();
      await this.toaster.showToast(
        this.translateText("Showing All the Riders"),
        "Success",
        false
      );
    }
  }

  // download excel
  downloadToExcel(event: any) {
    this.query.__export = true;
    delete this.query.__limit;
    delete this.query.__page;
    this.http
      .query(this.query, this.path, this.baseUrl)
      .then((response) => {
        const responseData = response?.data;
        if (responseData) {
          const excelTitleRow :any= {};
          let columns: Column[] = JSON.parse(JSON.stringify(this.columns));
          for (const [key, value] of Object.entries(columns)) {
            excelTitleRow[value["name"]] = value["displayName"];
          }
          responseData.map((val:any) => {
            val.created_on = moment
              .utc(val.created_on)
              .local()
              .format("DD/MM/YYYY hh:mm:ss A");
            val.type = val.leave_type.name;
            val.admin_user = val.admin_user?.user_name;
            delete val.id;
          });
          // Create a new array to hold the modified data including the title row
          const modifiedData = [excelTitleRow, ...responseData]; // Adding title row at the beginning
          const wb = XLSX.utils.book_new();
          XLSX.utils.book_append_sheet(
            wb,
            XLSX.utils.json_to_sheet(modifiedData, {
              header: [],
              skipHeader: true,
            }),
            this.reportName
          );
          XLSX.writeFile(wb, this.reportName + ".xlsx");
          const excelBuffer: any = XLSX.write(wb, {
            bookType: "xlsx",
            type: "array",
          });
          const data: Blob = new Blob([excelBuffer], {
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          });
        }
      })
      .catch((error) => {
        this.data = [];
        if (
          error?.error?.error === true &&
          error?.error?.message === "No Resource Found"
        ) {
          this.toaster.showToast("No Resource found", "Error", true, error);
        }
      });
  }
  toggleRouteConfig() {
    this.manual_touch_point_status.manual_update_touch_point_status = !this.manual_touch_point_status.manual_update_touch_point_status;
    this.updateCompanyRouteConfig();
  }

 async getCompanyRouteConfig() {
    this.http
      .get('', {}, "route/route_company_config")
      .then((res) => {
        if (res?.data.length > 0) {
          this.manual_touch_point_status = res?.data[0];
        }
        console.log(this.manual_touch_point_status, 1111);
      }).catch((err) => {
        const manual_update_touch_point_status=false
        console.log('12321321321');
         this.http.create(
           { manual_update_touch_point_status },
           {},
           "route/route_company_config",
         ).then((res) => { 
           this.getCompanyRouteConfig();
         });
      })
    
    
  }

  updateCompanyRouteConfig() {
    this.http.update(
      this.manual_touch_point_status.id,
      {
        manual_update_touch_point_status:
          this.manual_touch_point_status?.manual_update_touch_point_status,
      },
      {},
      "route/route_company_config",
    ).then((res) => { this.toaster.showToast(
      "Manually touchpoint updated successfully",
      "Success",
      false
    ); } ).catch((err) => { this.toaster.showToast("No Resource found", "Error", true, err); });
  }  
}
