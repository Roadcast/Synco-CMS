import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { LocalDataSource } from 'ng2-smart-table';
import { DataService } from 'src/app/pages/data.service';
import { ToastService } from 'src/app/pages/toast.service';
import * as moment from 'moment';

@Component({
  selector: 'app-attendance-holidays-list',
  templateUrl: './attendance-holidays-list.component.html',
  styleUrls: ['./attendance-holidays-list.component.scss']
})
export class AttendanceHolidaysListComponent implements OnInit {

  holiday = {
    date: moment().format('YYYY-MM-DD'),
    type: 'HOLIDAY',
    zone: [],
    title: '',
  };
  tableSettings = {
    delete: {
      deleteButtonContent: '<img src="/assets/images/icon-remove.svg" alt="" width="16">',
      confirmDelete: true,
    },
    actions: {
      add: false,
      edit: false,
    },
    pager: {
      display: true,
      perPage: 10,
    },
    columns: {
      date: {
        title: 'Date',

      },
      type: {title: 'Holiday Type'},
      title: {title: 'Holiday Title'},
      zone: {
        title: 'Zones',
        valuePrepareFunction: (value:any) => {
          try {
            return JSON.parse(value).map((u:any) => u.name).join(', ');
          } catch (e) {
            console.error(e);
          }
        },
      },
    },
  };
  tableData = new LocalDataSource([]);

  constructor(private translate: TranslateService
,    private http: DataService, private toaster: ToastService) { }

  ngOnInit() {
    this.fetchHolidays().then();
  }
  translateText(key: string): string {
		let translation: string='';
		this.translate.get(key).subscribe((res: string) => {
			translation = res;
		});
		return translation;
	}
  async save() {
    try {
        await this.http.create(this.holiday, {
        }, 'event/holiday');
        this.holiday.title = '';
        this.fetchHolidays().then();
      this.toaster.showToast(this.translateText('Saved Holiday Successfully.'), 'Success', false);
    } catch (e:any) {
      this.toaster.showToast(this.translateText('Error Saving Holiday ') + e.toString(), 'Error', true, e);
    }

  }


  async fetchHolidays() {
    this.http.query({__limit: 1365}, 'event/holiday').then(holidays => {
      this.tableData = new LocalDataSource(holidays.data);
    }).catch(e => { console.error(e); });
  }


  async deleteHoliday(event:any) {
    if (window.confirm('Are you sure want to delete?')) {
      try {
        await this.http.delete(event.data.id, {}, 'event/holiday', );
        this.toaster.showToast(this.translateText('Holiday Deleted!'), 'Success', false);
        event.confirm.resolve();
      } catch (e:any) {
        event.confirm.reject();
        this.toaster.showToast(this.translateText('Error Deleting Holiday ') + e.toString(), 'Error', true, e);
      }
    } else {
      event.confirm.reject();
    }
  }

}
