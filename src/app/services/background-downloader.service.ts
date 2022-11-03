import {EventEmitter, Injectable} from '@angular/core';
import {ApiService} from './api.service';
import {interval, Subscription} from 'rxjs';
import {saveAs} from 'file-saver';
import {HttpClient} from '@angular/common/http';
import {NgxSpinnerService} from "ngx-spinner";

@Injectable({
  providedIn: 'root',
})
export class BackgroundDownloaderService {

  taskId: string | undefined;
  sub: Subscription | undefined;
  resultEmitter: EventEmitter<any> = new EventEmitter<any>();
  public loader: boolean = false;

  constructor(private http: ApiService, private httpClient: HttpClient, private ngxSpinner: NgxSpinnerService) {
  }

  async start() {
    this.unsubscribe();
    this.ngxSpinner.show().then();
    this.sub = interval(2500)
        .subscribe(async () => {
          await this.getResult();
        });
  }

  async getResult() {
    if (!this.taskId) {
      return
    }
    try {
      const data = await this.http.get(this.taskId, {}, 'task/result');
      if (data) {
        if (data.state === 'SUCCESS') {
          this.unsubscribe();
        }
        if (data.hasOwnProperty('url')) {
          this.httpClient.get(data.url.replace('http://', 'https://'), {responseType: 'blob'}).subscribe(d => {
            const blob = new Blob([d], {type: 'text/csv;charset=utf-8;'});
            saveAs(blob, data.url.replace('http://zoai-upload.s3.amazonaws.com/', ''));
          }, () => {
          });
        } else {
          this.resultEmitter.emit(data.data);
        }

      }
    } catch (e) {
      this.unsubscribe();
    }
  }

  unsubscribe() {
    this.ngxSpinner.hide().then();
    if (this.sub) {
      this.sub.unsubscribe();
    }
  }
}
