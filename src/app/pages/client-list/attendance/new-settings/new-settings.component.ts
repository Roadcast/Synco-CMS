import { DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { MbscCalendarEvent, MbscEventcalendarOptions, MbscEventcalendarView } from '@mobiscroll/angular';
import { NbDialogService } from '@nebular/theme';
import { TranslateService } from '@ngx-translate/core';
import * as moment from 'moment';
import { LocalDataSource } from 'ng2-smart-table';
import { DataService } from 'src/app/pages/data.service';
import { ToastService } from 'src/app/pages/toast.service';

@Component({
  selector: 'app-new-settings',
  templateUrl: './new-settings.component.html',
  styleUrls: ['./new-settings.component.scss']
})
export class NewSettingsComponent implements OnInit {

  tableSettings = {
    delete: {
      deleteButtonContent:
        '<img src="/assets/images/icon-remove.svg" alt="" width="16">',
      confirmDelete: true,
    },
    actions: {
      add: false,
      edit: false,
      delete: false,
    },
    pager: {
      display: true,
      perPage: 10,
    },
    columns: {
      holiday_name: {
        title: this.translateText('Holiday Name'),
      },
      holiday_date: {
        title: this.translateText('Holiday date'),
        valuePrepareFunction: (row: any) =>
          row ? moment(row).format('DD/MM/YYYY') : '-',
      },
      created_on: {
        title: this.translateText('Created on'),
        valuePrepareFunction: (row: any) =>
          row ? moment(row).format('DD/MM/YYYY HH:mm A') : '-',
      },
    },
  };
  tableData = new LocalDataSource([]);
  holidayList: any;
  @ViewChild('editHolidayScheduleDialog')
  editHolidayScheduleDialog!: TemplateRef<any>;
  @ViewChild('createFinancialYearDialog')
  createFinancialYearDialog!: TemplateRef<any>;
  @ViewChild('eventCalender') eventCalender!: TemplateRef<any>;
  myOptions = {
    exclusiveEndDates: true,
  };
  dateFinancialYear = '';
  myEvents1: MbscCalendarEvent[] = [];
  myEvents: MbscCalendarEvent[] = [];
  view = 'month';
  currentYear = new Date().getFullYear();
  nextYear = new Date().getFullYear() + 1;
  minDateCalender: any = new Date();
  maxDateCalender: any = new Date();
  placeholder = 'Search Calender year';
  financialyearExist: boolean = false;
  calView: MbscEventcalendarView = {
    calendar: { labels: true },
  };
  calendarOptions: MbscEventcalendarOptions = {
    dataTimezone: 'utc',
    displayTimezone: 'asia/kolkata',
    clickToCreate: 'double',
    dragToCreate: false,
    dragToMove: false,
    dragToResize: false,
    dragTimeStep: 30,
    eventDelete: false,

    view: {
      timeline: {
        type: 'day',
      },
    },
    onEventCreated: (event, inst) => {
      console.log(event, inst);
    },
    onEventDoubleClick(args, inst) { },
    onEventClick: (args, inst) => {
      // const existingEvent = this.args.find((e) => e.start === args.date);
      // return false;
      this.editHolidaySchedule(args.event).then();
    },
    onLabelClick: (event, inst) => {
      console.log(event);
    },
  };

  editHoliDayObject:any = {
    holiday_date: '',
    holiday_name: '',
    id: '',
    calender_year_id: '',
    is_restricted: false,
    is_active: true,
  };
  holidayName: any;
  calender_year_id: any;
  constructor(
    private translate: TranslateService,
    private http1: HttpClient,
    private http: DataService,
    private nbDialog: NbDialogService,
    private toast: ToastService,
    // private datePipe: DatePipe,  
  ) { }
  translateText(key: string): string {
    let translation: string ='';
    this.translate.get(key).subscribe((res: string) => {
      translation = res;
    });
    return translation;
  }
  ngOnInit(): void {
    this.getHolidayList().then();
    this.http
      .query({}, 'attendance/calender_year', 'attendance')
      .then((data) => {
        if (data.total !== 0) {
          data.data.map((dates:any) => {
            const year_end = moment(dates.financial_year_end);
            const year_start = moment(dates.financial_year_start);
            if (
              year_end.year() === this.currentYear &&
              year_start.year() === this.currentYear
            ) {
              this.financialyearExist = true;
            } else if (
              year_end.year() === this.nextYear &&
              year_start.year() === this.currentYear
            ) {
              this.financialyearExist = true;
            }
          });
        }
      })
      .catch();
  }

  changeView(): void {
    setTimeout(() => {
      switch (this.view) {
        case 'year':
          this.calView = {
            calendar: { type: 'year' },
          };
          break;
        case 'month':
          this.calView = {
            calendar: { labels: true },
          };
          break;
        case 'week':
          this.calView = {
            schedule: { type: 'week' },
          };
          break;
        case 'agenda':
          this.calView = {
            calendar: { type: 'week' },
            agenda: { type: 'week' },
          };
          break;
      }
    });
  }
  async getHolidayList(calender_year_id?:any) {
    if (calender_year_id) {
      this.holidayList = (
        await this.http.query(
          {
            __calender_year_id__equal: calender_year_id ? calender_year_id : '',
          },
          'attendance/holiday_list',
          'attendance'
        )
      ).data;
      this.myEvents1 = this.holidayList.map((el:any) => ({
        color: '#339966',
        start: moment(el.holiday_date).format('YYYY-MM-DDTHH:mm:ss.SSSZ'),
        end: moment(el.holiday_date).format('YYYY-MM-DDTHH:mm:ss.SSSZ'),
        title: el.holiday_name,
        calender_year_id: el.calender_year_id,
        id: el.id,
        allDay: true,
        editable: true,
      }));
    }
  }

  async editHolidaySchedule(dutySchedule:any) {
    console.log(dutySchedule);
    if (dutySchedule.id.includes('mbsc')) {
      delete dutySchedule.id;
    }
    if (!this.calender_year_id) {
      this.toast.showToast(this.translateText('Please select finanacial range'), 'Failed!', true);
      return false;
    }
    try {
      this.holidayName = dutySchedule.title;
      this.editHoliDayObject = {
        holiday_date: moment(dutySchedule.start).format('YYYY-MM-DD'),
        holiday_name:
          dutySchedule.title === 'New event' ? '' : dutySchedule.title,
        id: dutySchedule.id,
        calender_year_id: this.calender_year_id,
        is_restricted: false,
        is_active: true,
      };
      this.nbDialog.open(this.editHolidayScheduleDialog, {
        context: {
          id: dutySchedule.id,
          title: dutySchedule.title,
        },
      });
    } catch (e) {
      console.error(e);
      // this.toast.showToast('Could not fetch the schedule.', 'Failed!', true);
    }
    return
  }

  async updateDutySchedule(dutyId:any) {
    if (dutyId) {
      try {
        delete this.editHoliDayObject.id;
        delete this.editHoliDayObject.calender_year_id;
        delete this.editHoliDayObject.holiday_date;
        await this.http.update(
          dutyId,
          this.editHoliDayObject,
          {},
          "attendance/holiday_list",
        );
        this.getHolidayList(this.calender_year_id);
        this.toast.showToast(
          "Holday list updated Successfully",
          "Success",
          false
        );
      } catch (e) {
        this.toast.showToast(
          "Could not update the Holiday Name.",
          "Failed!",
          true
        );
        console.error(e);
      }
    } else {
      try {
        await this.http.create(
          this.editHoliDayObject,
          {},
          "attendance/holiday_list",
        );
        this.getHolidayList(this.calender_year_id);
        this.toast.showToast(
          "Holday list added Successfully",
          "Success",
          false
        );
      } catch (e) {
        this.toast.showToast(
          "Could not add the Holiday Name.",
          "Failed!",
          true
        );
        console.error(e);
      }
    }
  }

  setCalenderYear(calender_year_id?:any) {
    console.log(calender_year_id);
    this.placeholder =
      calender_year_id.financial_year_start +
      "-" +
      calender_year_id.financial_year_end;
    this.minDateCalender = calender_year_id.financial_year_start;
    this.maxDateCalender = calender_year_id.financial_year_end;
    console.log(this.placeholder);
    this.calender_year_id = calender_year_id.id;
    this.getHolidayList(this.calender_year_id).then();
  }

  resetCalenderYear() {
    this.calender_year_id = '';
    this.placeholder = "Search Calender year";
    this.myEvents1 = [];
  }

  createFinancialYear() {
    if (this.financialyearExist === true) {
      this.toast.showToast("Already 1 financial year exist", "Failed!", true);
      return false;
    }
    this.dateFinancialYear = "";
    this.nbDialog.open(this.createFinancialYearDialog, {});
    return
  }
  catch(e:any) {
    console.error(e);
    // this.toast.showToast('Could not fetch the schedule.', 'Failed!', true);
  }

  async updateFinancialYear(dateFinancialYear:any) {
    console.log(dateFinancialYear);
    let financialYear = { financial_year_start: "", financial_year_end: "" };
    if (dateFinancialYear == 1) {
      financialYear = {
        financial_year_start: this.currentYear + "-01-01",
        financial_year_end: this.currentYear + "-12-31",
      };
    }
    if (dateFinancialYear == 2) {
      financialYear = {
        financial_year_start: this.currentYear + "-04-01",
        financial_year_end: this.nextYear + "-03-31",
      };
    }
    if (financialYear) {
      try {
        let response = await this.http.create(
          financialYear,
          {},
          "attendance/calender_year",
        );
        console.log(response);
        this.placeholder =
          financialYear.financial_year_start +
          "-" +
          financialYear.financial_year_end;
        this.minDateCalender = financialYear.financial_year_start;
        this.maxDateCalender = financialYear.financial_year_end;
        this.calender_year_id = response[0].id;
        this.getHolidayList(this.calender_year_id);
        this.toast.showToast(
          "Financial Year created Successfully",
          "Success",
          false,
        );
        //this.getHolidayList(this.calender_year_id);
      } catch (e) {
        this.toast.showToast(
          "Could not Create the Financial year.",
          "Failed!",
          true,
        );
        console.error(e);
      }
    } else {
      this.toast.showToast(
        'Could not Create the Financial year.',
        'Failed!',
        true,
      );
    }
  }


  ClearDateRange(event:any) {
    console.log(event);
    this.dateFinancialYear = '';
  }
}
