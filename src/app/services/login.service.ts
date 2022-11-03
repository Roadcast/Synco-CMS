import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {StorageService} from "./storage.service";
import {NgxSpinnerService} from 'ngx-spinner';
import {HttpService} from "../../config/http.service";

@Injectable({
  providedIn: 'root'
})
export class LoginService extends HttpService<any> {

  constructor(private httpClient: HttpClient, private storage: StorageService, spinner: NgxSpinnerService) {
    super(httpClient, {path: '/'}, spinner);
  }

  async login(email: string, password: string): Promise<void> {
    const res = await this.create({email, password}, {}, 'login/');
    await this.storage.setItem('token', res.authentication_token);
  }
}
