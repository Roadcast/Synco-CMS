import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { NbDialogService } from '@nebular/theme';
import * as moment from 'moment';
import { DataService } from 'src/app/pages/data.service';

@Component({
  selector: 'app-attendance-leavetype',
  templateUrl: './attendance-leavetype.component.html',
  styleUrls: ['./attendance-leavetype.component.scss']
})
export class AttendanceLeavetypeComponent implements OnInit {
  columns = [
    { field: 'company_name', header: 'Company Name', visible: true, filter: true, type: 'text' },
    { field: 'name', header: 'Leave Type' , visible: true, filter: true, type: 'text' },
    { field: 'leaves_allowed', header: 'Leaves Allowed', visible: true, filter: true, type: 'date'},
    { field: 'apply_before_days', header: 'Apply Before Days', visible: true, filter: true, type: 'text' },
    { field: 'is_active', header: 'is Active', visible: true, filter: true, type: 'text' },
    { field: 'updated_on', header: 'Updated on', visible: true, filter: true, type: 'text',displayFn: ((r:any) => moment(r.updated_on).format('DD/MM/YYYY hh:mm:ss A'))  },
    { field: 'created_on', header: 'Created On' , visible: true, filter: true, type: 'text',displayFn: ((r:any) => moment(r.created_on).format('DD/MM/YYYY hh:mm:ss A')) },
    
  ];
  constructor(private http: DataService, private cd: ChangeDetectorRef, private dialogService: NbDialogService) {}

  ngOnInit(): void {
  
  }

}

