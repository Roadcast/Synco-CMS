import {Injectable} from '@angular/core';
import {CanActivate, Router} from '@angular/router';
import {StorageService} from "./storage.service";

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  token: string | undefined;

  constructor(private router: Router, private storage: StorageService) {
    this.init().then();
  }


  async init() {
    this.token = await this.storage.getItem('token');
    await this.storage.watch('token').subscribe((res: string) => {
      this.token = res;
    });
  }

  async canActivate() {
    if (!this.token) {
      this.token = await this.storage.getItem('token');
    }
    return this.token ? true : this.router.navigate(['login']);
  }
}
