import { NgModule } from '@angular/core';
import {ActivatedRoute, RouterModule, Routes} from '@angular/router';
import {PagesComponent} from "./pages.component";
import {ClientListComponent} from "./client-list/client-list.component";
import {AddIntegrationComponent} from "./client-list/add-integration/add-integration.component";
import {ConfigSettingComponent} from "./client-list/config-setting/config-setting.component";
import {LogoutComponent} from "./client-list/logout/logout.component";
import { IntegrationComponent } from './integration/integration.component';
import { YardConfigEditComponent } from './client-list/yard-config/yard-config-edit/yard-config-edit.component';
import { YardConfigComponent } from './client-list/yard-config/yard-config.component';
import { PartnerComponent } from './integration/partner/partner.component';
import { AuthGuard } from '../services/auth-guard.service';
import { AccountComponent } from './client-list/account/account.component';



const routes: Routes = [

  {
    path: '',
    component: PagesComponent,
    children: [
      {
        path: 'clientList',
        component: ClientListComponent,
      },
      {
        path: '',
        redirectTo: 'clientList',
        pathMatch: 'full',
      },
      // {
      //   path: 'config/:id',
      //   component: AccountComponent
      // },
      {
        path: 'new-integration/:id',
        component: AddIntegrationComponent
      },
      {
        path: 'integration',
        component: AddIntegrationComponent,
      },
      {
        path: 'logout',
        component: LogoutComponent,
      },
      {
        path: 'listIntegration',
        component: IntegrationComponent
      },
      // {
      //   path: 'config/add/:id',
      //   component: YardConfigEditComponent
      // },
      // {
      //   path: 'config/:id',
      //   component: YardConfigComponent
      // },
      {
        path:'partner',
        component: PartnerComponent
      },
      {
        path: 'account-settings',
        loadChildren: () => import('./client-list/account/account.module')
          .then(m => m.AccountModule),
        canActivate: [AuthGuard],
      },
    ],
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagesRoutingModule { }
