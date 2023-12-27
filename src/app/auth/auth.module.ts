import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterModule} from '@angular/router';
import { AuthRoutingModule } from './auth-routing.module';
import { AuthComponent } from './auth.component';
import { LoginComponent } from './login/login.component';
import {FormsModule} from "@angular/forms";
import {NbButtonModule, NbLayoutModule} from "@nebular/theme";
import {InputTextModule} from "primeng/inputtext";
import {ButtonModule} from "primeng/button";


@NgModule({
  declarations: [
    AuthComponent,
    LoginComponent
  ],
    imports: [
        CommonModule,
        AuthRoutingModule,
        FormsModule,
        RouterModule,
        NbLayoutModule,
        InputTextModule,
        ButtonModule,
        NbButtonModule,
    ]
})
export class AuthModule { }
