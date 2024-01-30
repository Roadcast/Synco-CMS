import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PagesRoutingModule } from './pages-routing.module';
import { PagesComponent } from './pages.component';
import {
  NbLayoutModule,
  NbTooltipModule,
  NbMenuModule,
  NbTabsetModule,
  NbThemeModule,
  NbToastrModule,
  NbSelectModule,
  NbCardModule,
  NbSpinnerModule,
  NbIconModule, NbButtonModule, NbRadioModule, NbToggleModule, NbAccordionModule, NbInputModule, NbCheckboxModule
} from "@nebular/theme";
import { NgxSpinnerModule } from "ngx-spinner";
import { ToastModule } from "primeng/toast";
import { LogoutComponent } from './client-list/logout/logout.component';
import { ButtonModule } from "primeng/button";
import { MenuModule } from 'primeng/menu';
import { TableModule } from 'primeng/table';
import { IntegrationComponent } from './integration/integration.component';
import { TranslateModule } from '@ngx-translate/core';
import { ToastService } from './toast.service';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { YardConfigEditComponent } from './client-list/yard-config/yard-config-edit/yard-config-edit.component';
import { FormsModule } from '@angular/forms';
import { FileuploadComponent } from './client-list/fileupload/fileupload.component';
import { PartnerComponent } from './integration/partner/partner.component';
import { DialogModule } from 'primeng/dialog';
import { AttendanceComponent } from './client-list/attendance/attendance.component';
import { OrderComponent } from './client-list/order/order.component';
import { AttendanceHolidaysListComponent } from './client-list/attendance/attendance-holidays-list/attendance-holidays-list.component';
import { TypeAheadComponent } from './client-list/type-ahead/type-ahead.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { AttendanceSettingsComponent } from './client-list/attendance/attendance-settings/attendance-settings.component';
import { NewAttendanceSettingsComponent } from './client-list/attendance/new-attendance-settings/new-attendance-settings.component';

import { NewSettingsComponent } from './client-list/attendance/new-settings/new-settings.component';
import { AttendanceLeavetypeComponent } from './client-list/attendance/attendance-leavetype/attendance-leavetype.component';
import { AttendanceLeavetypeEditComponent } from './client-list/attendance/attendance-leavetype/attendance-leavetype-edit/attendance-leavetype-edit.component';
import { PrimeDataTableComponent } from './client-list/prime-data-table/prime-data-table.component';
import {
  MbscButtonModule,
  MbscCheckboxModule,
  MbscDatepickerModule,
  MbscEventcalendarModule,
  MbscInputModule,
  MbscModule,
  MbscPopupModule,
  MbscSegmentedModule,
} from '@mobiscroll/angular';
import { GeneralConfigOrderComponent } from './client-list/order/general-config-order/general-config-order.component';
import { SingleOrderConfigComponent } from './client-list/order/single-order-config/single-order-config.component';
import { ReportComponent } from './client-list/report/report.component';
import { ConfigurationHeaderComponent } from './client-list/configuration-header/configuration-header.component';
import { UploadFormatComponent } from './client-list/order/upload-format/upload-format.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { DataTableComponent } from '../@theme/components/data-table/data-table.component';
import {NgbModule} from "@ng-bootstrap/ng-bootstrap";


@NgModule({
  declarations: [
    PagesComponent,
    LogoutComponent,
    IntegrationComponent,
    YardConfigEditComponent,
    FileuploadComponent,
    PartnerComponent,
    AttendanceComponent,
    OrderComponent,
    AttendanceHolidaysListComponent,
    TypeAheadComponent,
    AttendanceSettingsComponent,
    NewAttendanceSettingsComponent,
    NewSettingsComponent,
    AttendanceLeavetypeComponent,
    AttendanceLeavetypeEditComponent,
    PrimeDataTableComponent,
    GeneralConfigOrderComponent,
    SingleOrderConfigComponent,
    ReportComponent,
    UploadFormatComponent,
    DataTableComponent,
  ],
  imports: [
    CommonModule,
    PagesRoutingModule,
    NbLayoutModule,
    NbTooltipModule,
    NgxSpinnerModule,
    ToastModule,
    NbMenuModule,
    ButtonModule,
    MenuModule,
    TableModule,
    NbTabsetModule,
    Ng2SmartTableModule,
    NbSelectModule,
    TranslateModule.forRoot(),
    NbThemeModule.forRoot(),
    NbToastrModule.forRoot(),
    FormsModule,
    NbCardModule,
    NbSpinnerModule,
    NbIconModule,
    NbButtonModule,
    DialogModule,
    NgSelectModule,
    NbRadioModule,
    NbToggleModule,
    NbAccordionModule,
    NbInputModule,
    MbscDatepickerModule,
    MbscInputModule,
    MbscEventcalendarModule,
    MbscModule,
    DragDropModule,
    NbCheckboxModule,
    NgbModule
  ],
  providers: [ToastService],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class PagesModule { }
