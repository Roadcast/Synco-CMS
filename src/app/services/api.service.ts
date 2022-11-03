import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {NgxSpinnerService} from 'ngx-spinner';
import {HttpService} from "../../config/http.service";


@Injectable({
  providedIn: 'root'
})
export class ApiService extends HttpService<any> {

  constructor(private httpClient: HttpClient, spinner: NgxSpinnerService) {
    super(httpClient, {
      path: '/',
    }, spinner);
  }
}
