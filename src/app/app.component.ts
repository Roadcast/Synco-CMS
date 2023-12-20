import { Component } from '@angular/core';
import {MessageService, PrimeNGConfig} from "primeng/api";
import {NbMenuItem} from '@nebular/theme';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [MessageService]

})
export class AppComponent {
  title = 'Synco Client Management';



  constructor(private messageService: MessageService, private primengConfig: PrimeNGConfig ) {
  }
  ngOnInit() {
    this.primengConfig.ripple = true;
  }

  // items: NbMenuItem[] = [
  //   {
  //     title: 'Profile',
  //     icon: 'person-outline',
  //   },
  //   {
  //     title: 'Change Password',
  //     icon: 'lock-outline',
  //   },
  //   {
  //     title: 'Privacy Policy',
  //     icon: { icon: 'checkmark-outline', pack: 'eva' },
  //   },
  //   {
  //     title: 'Logout',
  //     icon: 'unlock-outline',
  //   },
  // ];


  // toggleSidebar(): boolean {
  //   this.toggle(true, "menu-sidebar");
  //
  //   return false;
  // }
}
