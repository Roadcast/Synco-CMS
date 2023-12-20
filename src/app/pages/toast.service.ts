import { Injectable } from '@angular/core';
import {NbToastrService} from '@nebular/theme';
import {HttpErrorResponse} from '@angular/common/http';
import {TranslatePipe,TranslateService} from '@ngx-translate/core';

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  config = {
		destroyByClick: true,
		duration: 5000,
		preventDuplicates: false,
	};

	constructor(private translate: TranslateService
,		private toastrService: NbToastrService) {
	}
	translateText(key: string): string {
		let translation: string ='';
		this.translate.get(key).subscribe((res: string) => {
			translation = res;
		});
		return translation;
	}
	showToast(message: string, title: string, isError: boolean, error?: HttpErrorResponse) {
		if (isError) {
			if (error && error.error && error.error.message && error.error.message === 'Integrity Error') {
				this.toastrService.danger('Duplicate Data', this.translateText(title), this.config);
			} else if (error && error.error.msg && error.error.msg === 'User claims verification failed') {
				this.toastrService.danger('Permission Error (Contact Admin)', this.translateText(title), this.config);
			} else {
				this.toastrService.danger(message, this.translateText(title), this.config);
			}
		} else {
			this.toastrService.primary(message, this.translateText(title), this.config);
		}
	}
}
