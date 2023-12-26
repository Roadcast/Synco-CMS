import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NbMenuItem, NbSidebarService } from "@nebular/theme";
import {UserService} from "../services/user.service";


@Component({
  selector: 'app-pages',
  templateUrl: './pages.component.html',
  styleUrls: ['./pages.component.scss']
})
export class PagesComponent {

  constructor(private sidebarService: NbSidebarService,private userService: UserService,
    private router: Router) { }

  items: NbMenuItem[] = [
    {
      title: 'Client List',
      icon: 'people-outline',
      link: 'clientList',
    },
    {
      title: 'Integration',
      icon: 'copy-outline',
      link: 'integration',
    },
    {
      title: 'Logout',
      icon: 'log-out-outline',
      link: 'logout'
    },
  ];

  data: any[] = [
    {
      label: 'New Company',
    },

    {
      label: 'Integration',
      command: () => {
        this.router.navigate(['/pages/listIntegration']);
      }
    }
  ]

  toggleSidebar(): boolean {
    this.sidebarService.toggle(true, "menu-sidebar");

    return false;
  }


  logout() {
    this.userService.logout().then();
  }
  // navigateToIntegration() {
  //   this.router.navigate(['/pages/listIntegration']);
  // }
}
