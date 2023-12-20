import { Injectable, OnInit } from '@angular/core';
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
export class UserService extends HttpService<any>{
  user: User = {} as User;
  user$: Subject<User> = new Subject() as Subject<User>;
  company_Id: Subject<any> = new Subject() as Subject<any>;

  constructor(private httpClient: HttpClient, private storage: StorageService, spinner: NgxSpinnerService,
              private router: Router) {
    super(httpClient, {
      path: 'auth/user',
    }, spinner);
  }

//   async getCompanyConfig() {
//     return (await this.query({
//       __company_id__equal: this.company_id,
//       __only: ['key', 'value'],
//     }, 'auth/company_config')).data;
// }

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
    try {
      await this.query({}, 'auth/logout/');
      await this.storage.clearAll()
      this.user = {} as User;
    } catch (e) {
      await this.storage.clearItem('token')
      this.user = {} as User;
    } finally {
      await this.router.navigate(['/login']);
    }
  }
}
