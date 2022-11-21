import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {ClientListComponent} from './client-list/client-list.component';
import {ClientDetailComponent} from './client-list/client-detail/client-detail.component';
import {FormsModule} from "@angular/forms";
import {PanelModule} from "primeng/panel";
import {ButtonModule} from "primeng/button";
import {TableModule} from "primeng/table";
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
import { ConfigSettingComponent } from './client-list/config-setting/config-setting.component';
import {TabViewModule} from "primeng/tabview";
import {InputSwitchModule} from "primeng/inputswitch";

@NgModule({
  declarations: [
    AppComponent,
    ClientListComponent,
    ClientDetailComponent,
    LoginComponent,
    ConfigSettingComponent,
  ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        HttpClientModule,
        FormsModule,
        PanelModule,
        ButtonModule,
        TableModule,
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
        InputSwitchModule
    ],
  providers: [{provide: HTTP_INTERCEPTORS, useClass: Interceptor, multi: true},],
  bootstrap: [AppComponent]
})
export class AppModule {
}
