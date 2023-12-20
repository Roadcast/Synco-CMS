import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NbMenuItem, NbSidebarService } from "@nebular/theme";


@Component({
  selector: 'app-pages',
  templateUrl: './pages.component.html',
  styleUrls: ['./pages.component.scss']
})
export class PagesComponent {

  constructor(private sidebarService: NbSidebarService,
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

  // navigateToIntegration() {
  //   this.router.navigate(['/pages/listIntegration']); 
  // }
}
