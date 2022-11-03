import {Inject, Injectable, Injector} from '@angular/core';
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {from, Observable} from 'rxjs';
import {StorageService} from '../app/@core/service/storage.service';


@Injectable()
export class Interceptor implements HttpInterceptor {

  token: string | null = null;
	constructor(private injector: Injector, private storage: StorageService) {
	  this.init().then();
	}

	async init(): Promise<void> {
	  this.token = await this.storage.getItem('token');
	  await this.storage.watch('token').subscribe(res => {
          this.token = res;
        });

  }

	intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
		// do not intercept request whose urls are filtered by the injected filter
    return from(this.handle(req, next));
	}

  async handle(req: HttpRequest<any>, next: HttpHandler): Promise<any> {
    // if your getAuthToken() function declared as "async getAuthToken() {}"
    if (!this.token) {
      this.token = await this.storage.getItem('token');
    }


    // if your getAuthToken() function declared to return an observable then you can use
    // await this.auth.getAuthToken().toPromise()
    if (req.url.indexOf('amazon') < 0) {
      const authReq = req.clone({
        setHeaders: {
          Authorization: this.token || '',
        },
      });
      return next.handle(authReq).toPromise();
    }
    // Important: Note the .toPromise()
    return next.handle(req).toPromise();
  }
}
