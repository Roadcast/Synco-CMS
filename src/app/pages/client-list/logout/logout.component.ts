import { Component } from '@angular/core';
import {UserService} from "../../../services/user.service";
import {NbSidebarService} from "@nebular/theme";

@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.scss']
})
export class LogoutComponent {

  constructor(private userService: UserService) {}

  logout() {
    this.userService.logout().then();
  }

}
