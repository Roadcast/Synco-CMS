import {Component, OnDestroy, OnInit} from '@angular/core';

import {Router} from '@angular/router';
import {Subscription} from 'rxjs';
import {User} from "../../services/user";
import {LoginService} from "../../services/login.service";
import {UserService} from "../../services/user.service";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {

  email: string | undefined;
  password: string | undefined;
  user: User = {} as User;
  sub: Subscription;
  alert: string | null = null;
  constructor(private loginService: LoginService, private userService: UserService, private router: Router) {
    this.sub = this.userService.user$.subscribe((res: User) => {
      this.user = res;
      this.navigate().then();
    });
  }


  ngOnInit() {
    if (this.userService.user.id) {
      this.navigate().then();
    }

  }

  async login() {
    try {
      if (!this.email || !this.password) {
        return
      }
      await this.loginService.login(this.email, this.password);
      await this.userService.setUser();
      await this.navigate();
    } catch (e) {
      this.alert = 'Username or Password is incorrect! Please try again';
    }
  }

  close() {
    this.alert = null;
  }

  async navigate() {
    await this.router.navigate(['/pages']);
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }
}
