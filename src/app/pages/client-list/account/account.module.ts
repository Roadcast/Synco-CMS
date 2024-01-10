import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccountRoutingModule } from './account-routing.module';
import { AccountComponent } from './account.component';
import { NbRouteTabsetModule } from '@nebular/theme';
import { ConfigurationHeaderComponent } from '../configuration-header/configuration-header.component';

@NgModule({
  declarations: [AccountComponent, ConfigurationHeaderComponent],
  imports: [
    CommonModule,
    AccountRoutingModule,
    NbRouteTabsetModule,
  ],
})
export class AccountModule { }
