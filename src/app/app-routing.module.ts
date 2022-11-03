import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {ClientListComponent} from "./client-list/client-list.component";
import {AuthGuard} from "./services/auth-guard.service";
import {LoginComponent} from "./login/login.component";

const routes: Routes = [
  {path: '', component: ClientListComponent, canActivate: [AuthGuard]},
  {path: 'login', component: LoginComponent,}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
