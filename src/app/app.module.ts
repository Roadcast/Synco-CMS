import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ClientListComponent } from './pages/client-list/client-list.component';
import { ClientDetailComponent } from './pages/client-list/client-detail/client-detail.component';
import { FormsModule } from "@angular/forms";
import { PanelModule } from "primeng/panel";
import { ButtonModule } from "primeng/button";
import { CalendarModule } from "primeng/calendar";
import { InputTextModule } from "primeng/inputtext";
import { CardModule } from "primeng/card";
import { ToggleButtonModule } from "primeng/togglebutton";
import { RippleModule } from "primeng/ripple";
import { TooltipModule } from "primeng/tooltip";
import { DialogModule } from "primeng/dialog";
import { SelectButtonModule } from "primeng/selectbutton";
import { TimelineModule } from "primeng/timeline";
import { NgxSpinnerModule } from "ngx-spinner";
import { HTTP_INTERCEPTORS, HttpClientModule } from "@angular/common/http";
import { LoginComponent } from "./login/login.component";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Interceptor } from "../config/http.intercepter";
import { DropdownModule } from "primeng/dropdown";
import { ToastModule } from 'primeng/toast';
import { ConfigSettingComponent } from './pages/client-list/config-setting/config-setting.component';
import { TabViewModule } from "primeng/tabview";
import { InputSwitchModule } from "primeng/inputswitch";
import { ProgressSpinnerModule } from "primeng/progressspinner";
import { MultiSelectModule } from "primeng/multiselect";
import { AddIntegrationComponent } from './pages/client-list/add-integration/add-integration.component';
import { StepsModule } from "primeng/steps";
import { NgSelectModule } from "@ng-select/ng-select";
import { TypeAheadComponent } from "./@theme/components/type-ahead/type-ahead.component";
import { AccordionModule } from "primeng/accordion";
import { GeneralConfigComponent } from './pages/client-list/config-setting/general-config/general-config.component';
import { AuthModule } from './auth/auth.module';
import { TableModule } from 'primeng/table';
import { Ng2CompleterModule } from "ng2-completer";
import {
  NbThemeModule,
  NbMenuModule,
  NbSidebarModule,
  NbTabsetModule,
  NbSelectModule,
  NbToggleModule,
  NbIconModule,
  NbButtonModule,
  NbToastrModule,
  NbCheckboxModule,
  NbCardModule,
  NbSpinnerModule, NbAccordionModule, NbInputModule, NbDialogModule, NbLayoutModule
} from '@nebular/theme';
import { NbEvaIconsModule } from '@nebular/eva-icons';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { ToastService } from './pages/toast.service';
import { ReasonsComponent } from './pages/client-list/config-setting/reasons/reasons.component';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { DocVerificationComponent } from './pages/client-list/config-setting/doc-verification/doc-verification.component';
import { TriggerPointComponent } from './pages/client-list/trigger-point/trigger-point.component';
import { YardConfigComponent } from './pages/client-list/yard-config/yard-config.component';
import { AngularFireModule } from "@angular/fire/compat";
import { AngularFireStorageModule } from '@angular/fire/compat/storage';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { environment } from 'src/environments/environment';
import { CommonModule } from '@angular/common';
import { CeleryTaskStatusDialogComponent } from './@theme/components/celery-task-status-dialog/celery-task-status-dialog.component';


// import { RouterModule } from '@angular/router';
// import { routes } from './auth/auth-routing.module';

@NgModule({
  declarations: [
    AppComponent,
    ClientListComponent,
    ClientDetailComponent,
    LoginComponent,
    ConfigSettingComponent,
    AddIntegrationComponent,
    TypeAheadComponent,
    GeneralConfigComponent,
    ReasonsComponent,
    DocVerificationComponent,
    TriggerPointComponent,
    YardConfigComponent,
    CeleryTaskStatusDialogComponent,
  ],
  imports: [
    CommonModule,
    TableModule,
    BrowserModule,
    AppRoutingModule,
    AuthModule,
    HttpClientModule,
    FormsModule,
    PanelModule,
    ButtonModule,
    CalendarModule,
    FormsModule,
    InputTextModule,
    CardModule,
    ToggleButtonModule,
    ToastModule,
    RippleModule,
    TooltipModule,
    DialogModule,
    SelectButtonModule,
    TimelineModule,
    NgxSpinnerModule,
    BrowserAnimationsModule,
    DropdownModule,
    TabViewModule,
    InputSwitchModule,
    ProgressSpinnerModule,
    MultiSelectModule,
    StepsModule,
    NgSelectModule,
    AccordionModule,
    NbThemeModule.forRoot({ name: 'corporate' }),
    NbEvaIconsModule,
    NbMenuModule.forRoot(),
    NbSidebarModule.forRoot(),
    NgbModule,
    NbTabsetModule,
    Ng2SmartTableModule,
    Ng2CompleterModule,
    NbSelectModule,
    NbToggleModule,
    NbIconModule,
    NbButtonModule,
    NbToastrModule,
    NbCheckboxModule,
    TranslateModule.forRoot(),
    NbCardModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFirestoreModule,
    AngularFireStorageModule,
    NbSpinnerModule,
    NbAccordionModule,
    NbLayoutModule,
    NbInputModule,
    NbDialogModule.forRoot(),
  ],
  providers: [{ provide: HTTP_INTERCEPTORS, useClass: Interceptor, multi: true }, ToastService],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],

  bootstrap: [AppComponent]
})
export class AppModule {
}

