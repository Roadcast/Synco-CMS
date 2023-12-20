import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { HttpService } from 'src/config/http.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DataService extends HttpService<any> {

  constructor(public override http: HttpClient, protected override spinner: NgxSpinnerService) {
    super(http, {
      path: '',
      baseUrl: environment.baseUrl,
    }, spinner);
  }
}
