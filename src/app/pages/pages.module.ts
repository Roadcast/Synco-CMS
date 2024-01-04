import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PagesRoutingModule } from './pages-routing.module';
import { PagesComponent } from './pages.component';
import {
  NbBadgeModule,
  NbLayoutModule,
  NbTooltipModule,
  NbSidebarModule,
  NbMenuModule,
  NbTabsetModule,
  NbThemeModule,
  NbToastrModule,
  NbSelectModule,
  NbCardModule,
  NbToggleModule,
  NbSpinnerModule,
  NbIconModule, NbButtonModule
} from "@nebular/theme";
import {NgxSpinnerModule} from "ngx-spinner";
import {ToastModule} from "primeng/toast";
import { LogoutComponent } from './client-list/logout/logout.component';
import {ButtonModule} from "primeng/button";
import { MenuModule } from 'primeng/menu';
import { TableModule } from 'primeng/table';
import { IntegrationComponent } from './integration/integration.component';
import { TranslateModule } from '@ngx-translate/core';
import { ToastService } from './toast.service';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { YardConfigEditComponent } from './client-list/yard-config/yard-config-edit/yard-config-edit.component';
import { FormsModule } from '@angular/forms';
import { NbEvaIconsModule } from '@nebular/eva-icons';
import { FileuploadComponent } from './client-list/fileupload/fileupload.component';
import { AngularFireModule } from '@angular/fire/compat';
import { environment } from 'src/environments/environment';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { AngularFireStorageModule } from '@angular/fire/compat/storage';
import { PartnerComponent } from './integration/partner/partner.component';
import { DialogModule } from 'primeng/dialog';
import { AccountComponent } from './client-list/account/account.component';
import { AttendanceComponent } from './client-list/attendance/attendance.component';
import { OrderComponent } from './client-list/order/order.component';
import { AttendanceHolidaysListComponent } from './client-list/attendance/attendance-holidays-list/attendance-holidays-list.component';
import { TypeAheadComponent } from './client-list/type-ahead/type-ahead.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { AttendanceSettingsComponent } from './client-list/attendance/attendance-settings/attendance-settings.component';
// import { RouterModule } from '@angular/router';
// import { routes } from '../auth/auth-routing.module';

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
    // AccountComponent,
  ],
  imports: [
    CommonModule,
    PagesRoutingModule,
    NbLayoutModule,
    NbBadgeModule,
    NbTooltipModule,
    NgxSpinnerModule,
    ToastModule,
    NbSidebarModule,
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
    NbEvaIconsModule,
    NbCardModule,
    NbToggleModule,
    NbSpinnerModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFirestoreModule,
    AngularFireStorageModule,
    NbIconModule,
    NbButtonModule,
    DialogModule,
    NgSelectModule
    // RouterModule.forRoot(routes)
  ],
  providers: [ToastService],
})
export class PagesModule { }
