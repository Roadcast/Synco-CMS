import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Subject} from 'rxjs';
import {StorageService} from './storage.service';
import {NgxSpinnerService} from 'ngx-spinner';
import {Router} from '@angular/router';
import {HttpService} from "../../config/http.service";
import {User} from "./user";

@Injectable({
  providedIn: 'root'
})
export class UserService extends HttpService<any> {
  user: User = {} as User;
  user$: Subject<User> = new Subject() as Subject<User>;

  constructor(private httpClient: HttpClient, private storage: StorageService, spinner: NgxSpinnerService,
              private router: Router) {
    super(httpClient, {
      path: '/user',
    }, spinner);
  }

  async init(): Promise<void> {
    const token = await this.storage.getItem('token');
    if (token) {
      await this.setUser();
    } else {
      this.storage.watch('token').subscribe(async res => {
        if (res) {
          await this.setUser();
        }
      });
    }
  }

  async setUser(): Promise<void> {
    try {
      this.user = (await this.getUser()).data[0];
      this.user$.next(this.user);
    } catch (e) {
      await this.storage.clearItem('token');
      this.router.navigate(['/auth/login']).then();
    }
  }

  async getUser(): Promise<any> {
    return this.query({
      __me__bool: true, __include: ['retail_brand'],
      __only: ['id', 'name', 'email'],
    });
  }

  async logout(): Promise<any> {
    await this.query( {}, 'logout/');
    this.user = {} as User;
    return await this.storage.clearAll();
  }
}
