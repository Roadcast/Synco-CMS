import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AccountComponent } from './account.component';
import { ConfigSettingComponent } from '../config-setting/config-setting.component';
import { YardConfigEditComponent } from '../yard-config/yard-config-edit/yard-config-edit.component';
import { AttendanceComponent } from '../attendance/attendance.component';
import { OrderComponent } from '../order/order.component';
import { AttendanceLeavetypeEditComponent } from '../attendance/attendance-leavetype/attendance-leavetype-edit/attendance-leavetype-edit.component';

const routes: Routes = [
  {
    path: '',
    component: AccountComponent,
    children: [
      {
        path: 'configuration',
        component: ConfigSettingComponent,
      },
      {
        path: 'attendance',
        component: AttendanceComponent,
      },
      {
        path: 'configuration/yard-config/:id',
        component: YardConfigEditComponent,
      },
      {
        path: 'order',
        component: OrderComponent,
      },
      {
        path: 'leave_type/:id',
        component: AttendanceLeavetypeEditComponent,
      },
     ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AccountRoutingModule { }
