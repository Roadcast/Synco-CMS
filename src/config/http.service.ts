import {HttpClient, HttpHeaders, HttpParams, HttpResponse} from '@angular/common/http';
import {Observable} from 'rxjs';
import {catchError} from 'rxjs/operators';
import {NgxSpinnerService} from 'ngx-spinner';
import {environment} from "../environments/environment";

export type IRestTransform = (response: HttpResponse<any>) => any;

export interface IRestConfig {
	baseHeaders?: HttpHeaders;
	dynamicHeaders?: () => HttpHeaders;
	baseUrl?: string;
	path: string;
}

export interface IRestQuery {
	[key: string]: any;
}

export interface IOption {

	headers?: HttpHeaders | {
		[header: string]: string | string[];
	};
	observe?: 'body';
	params?: HttpParams | {
		[param: string]: string | string[];
	};
	reportProgress?: boolean;
	responseType: 'json';
	withCredentials?: boolean;
}

export abstract class HttpService<T> {

  protected http: HttpClient;
	private readonly path: string;
	private readonly base: string = environment.baseUrl;
	private baseHeaders: HttpHeaders;
	private dynamicHeaders: () => HttpHeaders;
	protected spinner: any;

	protected constructor(http: HttpClient, config: IRestConfig, spinner: NgxSpinnerService) {
		this.http = http;
		this.base = config.baseUrl || this.base;
		this.path = config.path.replace(/^\//, '');
		this.baseHeaders = config.baseHeaders ? config.baseHeaders : new HttpHeaders();
		this.dynamicHeaders = config.dynamicHeaders ? config.dynamicHeaders : () => new HttpHeaders();
		this.spinner = spinner;
	}

	protected static buildRequestOptions(query?: any, responseType?: string): IOption {
		for (const i in query) {
			if (query.hasOwnProperty(i)) {
				if (query[i] === undefined || query[i] === null) {
					delete query[i];
				}
			}
		}
		return {responseType: responseType ? responseType : 'json', params: query} as IOption;
	}

	protected static catchError(error: any): void {
		if (error.status !== 404 && error.status < 500) {
			const err = new Error();
			err.name = error.name;
			err.message = error.error;
			// Raven.captureException(err);
		}

		let title: string | null = null;
		let message: string = error.statusText;
		switch (error.status) {
			case 0:
				break;
			case 400:
				title = 'Bad Request';
				break;
			case 401:
				title = 'Unauthorized';
				break;
			case 403:
				title = 'Forbidden';
				break;
			case 404:
				title = null;
				break;
			case 429:
				const seconds = parseInt(error.headers.get('retry-after'), 10);
				message = seconds < 60 ? error.headers.get('retry-after') + ' seconds' : seconds / 60 + ' minutes';
				message = 'Request limit reached retry after ' + message;
				title = 'Network Limit';
				break;
			case 500:
				break;
			default:
				break;

		}
		if (title) {

		}
	}

	// public query(query?: IRestQuery, url?: string, report?: boolean): Promise<T> {
	// 	// this.spinner.show();
	// 	const request: Observable<any> = this.http.get(this.buildUrl(undefined, url, report), HttpService.buildRequestOptions(query));
	// 	return new Promise((resolve, reject) => request.subscribe(res => {
	// 		// this.spinner.hide();
	// 		return resolve(res);
	// 	}, (err) => {
	// 		HttpService.catchError(err);
	// 		this.spinner.hide();
	// 		return reject(err);
	// 	}));
	// }

	public query(query?: IRestQuery, url?: string, base?: string): Promise<T> {
		const request: Observable<any> = this.http.get(this.buildUrl(undefined, url, base), HttpService.buildRequestOptions(query));
		return new Promise((resolve, reject) => request.subscribe(res => {
			return resolve(res);
		}, (err) => {
			HttpService.catchError(err);
			return reject(err);
		}));
	}

	// public downloadFile(query?: IRestQuery, url?: string, report?: boolean): Promise<Blob> {
	// 	const request: Observable<any> = this.http.get(this.buildUrl(undefined, url, report),
	// 		HttpService.buildRequestOptions(query, 'blob'));
	// 	return new Promise((resolve, reject) => request.subscribe(res => {
	// 		return resolve(res);
	// 	}, (err) => {
	// 		HttpService.catchError(err);
	// 		return reject(err);
	// 	}));
	// }
	public downloadFile(query?: IRestQuery, url?: string, base?: string): Promise<Blob> {
		const request: Observable<any> = this.http.get(this.buildUrl(undefined, url, base),
			HttpService.buildRequestOptions(query, 'blob'));
		return new Promise((resolve, reject) => request.subscribe(res => {
			return resolve(res);
		}, (err) => {
			HttpService.catchError(err);
			return reject(err);
		}));
	}

	public get(id: string | number, query?: IRestQuery, url?: string): Promise<T> {
		const request: Observable<any> = this.http.get(this.buildUrl(id, url), HttpService.buildRequestOptions(query));
		return new Promise((resolve, reject) => request.subscribe(res => {
			return resolve(res);
		}, (err) => {
			HttpService.catchError(err);
			return reject(err);
		}));
	}

	public create(obj: T, query?: IRestQuery, url?: string): Promise<T> {

		const request: Observable<any> = this.http.post(this.buildUrl(undefined, url), obj,
			HttpService.buildRequestOptions(query));
		return new Promise((resolve, reject) => request.subscribe(res => {
			return resolve(res);
		}, (err) => {
			HttpService.catchError(err);
			return reject(err);
		}));
	}

	public createDirect(obj: T, query?: IRestQuery, url?: string, base?: string): Promise<T> {
		const request: Observable<any> = this.http.post(this.buildUrl(undefined, url, base), obj,
			HttpService.buildRequestOptions(query));
		return new Promise((resolve, reject) => request.subscribe(res => {
			return resolve(res);
		}, (err) => {
			HttpService.catchError(err);
			return reject(err);
		}));
	}

	public update(id: string | number, obj: T, query?: IRestQuery, url?: string, base?: string): Promise<T> {
		const request: Observable<any> = this.http.patch(this.buildUrl(id, url, base), obj, HttpService.buildRequestOptions(query));
		return new Promise((resolve, reject) => request.subscribe(res => {
			return resolve(res);
		}, (err) => {
			catchError(err);
			return reject(err);
		}));
	}

	public put(obj: T, query?: IRestQuery, url?: string): Promise<T> {
		const request: Observable<any> = this.http.put(this.buildUrl(undefined, url), obj, HttpService.buildRequestOptions(query));
		return new Promise((resolve, reject) => request.subscribe(res => {
			return resolve(res.data);
		}, (err) => {
			HttpService.catchError(err);
			return reject(err);
		}));
	}

	public delete(id: any, query?: IRestQuery, url?: string, base?: string): Promise<T> {
		const request: Observable<any> = this.http.delete(this.buildUrl(id, url, base), HttpService.buildRequestOptions(query));
		return new Promise((resolve, reject) => request.subscribe(res => {
			return resolve(res);
		}, (err) => {
			HttpService.catchError(err);
			return reject(err);
		}));
	}

	// protected buildUrl(id?: string | number, newUrl?: string, report?: boolean): string {
	// 	let url: string = newUrl ? newUrl : this.path;
	// 	if (id) {
	// 		url += `/${id}`;
	// 	}
	// 	url = `${this.base}${url}`;
	// 	return url;
	// }
	protected buildUrl(id?: string | number, newUrl?: string, baseUrl?: string): string {
		let url: string = newUrl ? newUrl : this.path;
		if (id) {
			url += `/${id}`;
		}
		
		// const base = environment[baseUrl];
		url = `${this.base}${url}`;
		
		return url;
	}
}
