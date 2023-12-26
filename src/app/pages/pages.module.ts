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
  NbIconModule
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
// import { RouterModule } from '@angular/router';
// import { routes } from '../auth/auth-routing.module';

@NgModule({
  declarations: [
    PagesComponent,
    LogoutComponent,
    IntegrationComponent,
    YardConfigEditComponent,
    FileuploadComponent,
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
    // RouterModule.forRoot(routes)
  ],
  providers: [ToastService],
})
export class PagesModule { }
