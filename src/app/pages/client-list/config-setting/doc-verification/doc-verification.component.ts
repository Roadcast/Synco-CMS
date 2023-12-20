import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { DocVerification } from './DocVerification';
import { DataService } from 'src/app/pages/data.service';
import { ToastService } from 'src/app/pages/toast.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-doc-verification',
  templateUrl: './doc-verification.component.html',
  styleUrls: ['./doc-verification.component.scss']
})
export class DocVerificationComponent implements OnInit {

  @Output() getLoadingStatus = new EventEmitter<boolean>();  
    @Input() companyId: string ='';
    docConfig: any = {} as DocVerification;
    docs: any[] = [];
    postDocs:any= {}

    constructor(private http: DataService, private toast: ToastService,private translate: TranslateService) {}

    translateText(key: string): string {
        let translation: string='';
        this.translate.get(key).subscribe((res: string) => {
            translation = res;
        });
        return translation;
    }

    ngOnInit(): void {
        this.getLoadingStatus.emit(true)
        this.getDocVerifyData().then();
    }

    async getDocVerifyData() {
        try {
            this.docConfig = (await this.http.query({__company_id__equal: this.companyId}, 'auth/doc_verification_config', 'auth')).data[0];
            for (const doc in this.docConfig.docs) {
                this.docs.push({doc: this.docConfig.docs[doc]})
            }
            this.getLoadingStatus.emit(false)
        } catch (e) {
            console.error('e', e);
            this.getLoadingStatus.emit(false)
        }
    }

    async postDocVerifyData() {
        this.getLoadingStatus.emit(true)
        if (!this.companyId) {
            this.toast.showToast(this.translateText('Not able to find company id'), 'Invalid', true);
            this.getLoadingStatus.emit(false)
            return;
        } else if (!this.docConfig.verification_partner) {
            this.toast.showToast(this.translateText('Not able to find verification partner'), 'Invalid', true);
            this.getLoadingStatus.emit(false)
            return; 
        } else if (Object.keys(this.postDocs).length === 0) {
            this.toast.showToast(this.translateText('Not able to find any docs'), 'Invalid', true);
            this.getLoadingStatus.emit(false)
            return;
        } else {
            const body = {
                company_id: this.companyId,
                verification_partner: this.docConfig.verification_partner,
                docs: this.postDocs
            }
            try {
                const res = await this.http.create(body, {}, 'auth/doc_verification_config');
                console.log('res', res);
                this.getLoadingStatus.emit(false)
            } catch (e) {
                console.log('e', e);
                this.toast.showToast(this.translateText('Error while saving config'), 'Failed', true);
                this.getLoadingStatus.emit(false)
            }
        }

    }

    removeUnderScore(text: string = '') {
        return text !== '' ? text.split('_').join(' ') : '';
    }

    getSelectedChange(event: any) {
        console.log('event', event);
        event.forEach((el: string) => {
            this.postDocs[el === 'BANK_ACCOUNT' ? 'BANK'.toLowerCase() : el.toLowerCase()] = el;
        });
        console.log('post docs', this.postDocs);
    }
}
