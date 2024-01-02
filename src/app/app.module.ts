import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {ClientListComponent} from './pages/client-list/client-list.component';
import {ClientDetailComponent} from './pages/client-list/client-detail/client-detail.component';
import {FormsModule} from "@angular/forms";
import {PanelModule} from "primeng/panel";
import {ButtonModule} from "primeng/button";
import {CalendarModule} from "primeng/calendar";
import {InputTextModule} from "primeng/inputtext";
import {CardModule} from "primeng/card";
import {ToggleButtonModule} from "primeng/togglebutton";
import {RippleModule} from "primeng/ripple";
import {TooltipModule} from "primeng/tooltip";
import {DialogModule} from "primeng/dialog";
import {SelectButtonModule} from "primeng/selectbutton";
import {TimelineModule} from "primeng/timeline";
import {NgxSpinnerModule} from "ngx-spinner";
import {HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";
import {LoginComponent} from "./login/login.component";
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {Interceptor} from "../config/http.intercepter";
import {DropdownModule} from "primeng/dropdown";
import {ToastModule} from 'primeng/toast';
import { ConfigSettingComponent } from './pages/client-list/config-setting/config-setting.component';
import {TabViewModule} from "primeng/tabview";
import {InputSwitchModule} from "primeng/inputswitch";
import {ProgressSpinnerModule} from "primeng/progressspinner";
import {MultiSelectModule} from "primeng/multiselect";
import { AddIntegrationComponent } from './pages/client-list/add-integration/add-integration.component';
import {StepsModule} from "primeng/steps";
import {NgSelectModule} from "@ng-select/ng-select";
import {TypeAheadComponent} from "./@theme/components/type-ahead/type-ahead.component";
import {AccordionModule} from "primeng/accordion";
import { GeneralConfigComponent } from './pages/client-list/config-setting/general-config/general-config.component';
import {AuthModule} from './auth/auth.module';
import { TableModule } from 'primeng/table';
import {
    NbThemeModule,
    NbLayoutModule,
    NbTooltipModule,
    NbBadgeModule,
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
    NbSpinnerModule, NbAccordionModule, NbInputModule
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
import { FileuploadComponent } from './pages/client-list/fileupload/fileupload.component';
import { AngularFireModule } from "@angular/fire/compat";
import { AngularFireAuthModule } from "@angular/fire/compat/auth";
import { AngularFireStorageModule } from '@angular/fire/compat/storage';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { environment } from 'src/environments/environment';

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
  ],
    imports: [
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
        NbThemeModule.forRoot({name: 'corporate'}),
        NbLayoutModule,
        NbEvaIconsModule,
        NbTooltipModule,
        NbBadgeModule,
        NbMenuModule.forRoot(),
        NbSidebarModule.forRoot(),
        NgbModule,
        NbTabsetModule,
        Ng2SmartTableModule,
        NbSelectModule,
        NbToggleModule,
        NbIconModule,
        NbButtonModule,
        NbToastrModule,
        NbCheckboxModule,
        TranslateModule.forRoot(),
        NbCardModule,
        Ng2SmartTableModule,
        AngularFireModule.initializeApp(environment.firebaseConfig),
        AngularFirestoreModule,
        AngularFireStorageModule,
        NbSpinnerModule,
        NbAccordionModule,
        NbInputModule,
        
    ],
  providers: [{provide: HTTP_INTERCEPTORS, useClass: Interceptor, multi: true},ToastService],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],

  bootstrap: [AppComponent]
})
export class AppModule {
}
