import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { DocVerification } from './DocVerification';
import { DataService } from 'src/app/pages/data.service';
import { ToastService } from 'src/app/pages/toast.service';
import { TranslateService } from '@ngx-translate/core';
import { ActivatedRoute } from '@angular/router';
import { MessageService } from 'primeng/api';

@Component({
    selector: 'app-doc-verification',
    templateUrl: './doc-verification.component.html',
    styleUrls: ['./doc-verification.component.scss']
})
export class DocVerificationComponent implements OnInit {

    @Output() getLoadingStatus = new EventEmitter<boolean>();
    @Input() companyId: string = '';
    docConfigRef: any = {} as any;
    docs: any[] = [];
    postDocs: any = {};
    selectedVerificationDocsRef: any = [];
    selectedVerificationObject: any
    selectedVerificationDocs: any = [];
    savedDocConfigObjectByVerifyPartner: any = {};
    savedDocConfig: any = [];
    savedDocConfigTableView: any = [];
    id: any;

    constructor(private http: DataService, private toast: ToastService, private translate: TranslateService,
        private activeRoute: ActivatedRoute,
        private messageService: MessageService) { }

    translateText(key: string): string {
        let translation: string = '';
        this.translate.get(key).subscribe((res: string) => {
            translation = res;
        });
        return translation;
    }

    ngOnInit(): void {
        this.getLoadingStatus.emit(true)
        // this.getDocVerifyData().then();
        this.getDocConfigDataRef().then();
        this.getDocConfigDataById().then();
        this.activeRoute.paramMap.subscribe(params => {
            this.id = params.get('id');
        });
    }

    async getDocConfigDataRef() {
        try {
            this.docConfigRef = (await this.http.query({}, 'auth/doc_config')).data;
            this.getLoadingStatus.emit(false);
        } catch (e) {
            console.error(e);
        }
    }

    setVerificationDocs() {
        this.selectedVerificationDocsRef = [];
        this.selectedVerificationDocs = [];
        if (!this.selectedVerificationObject)
            return;
        this.selectedVerificationDocsRef = Object.keys(this.selectedVerificationObject['docs'])
            .map(x => {
                return {
                    name: this.selectedVerificationObject['docs'][x],
                    value: x,
                    disable: !!(this.savedDocConfigObjectByVerifyPartner[this.selectedVerificationObject['verification_partner']] &&
                        this.savedDocConfigObjectByVerifyPartner[this.selectedVerificationObject['verification_partner']]
                            .includes(this.selectedVerificationObject['docs'][x])),
                }
            });
    }

    async getDocConfigDataById() {
        try {
            this.savedDocConfigObjectByVerifyPartner = {};
            this.savedDocConfigTableView = [];
            this.selectedVerificationDocsRef = [];
            this.selectedVerificationDocs = [];
            this.selectedVerificationObject = null;
            this.savedDocConfig = (await this.http.query({ __company_id__equal: this.companyId }, 'auth/doc_verification_config')).data;
            this.savedDocConfig.forEach((config: any) => {
                Object.keys(config['docs']).forEach(doc => {
                    this.savedDocConfigObjectByVerifyPartner[config['verification_partner']] ?
                        this.savedDocConfigObjectByVerifyPartner[config['verification_partner']].push(config['docs'][doc]) :
                        this.savedDocConfigObjectByVerifyPartner[config['verification_partner']] = [config['docs'][doc]]
                    const object: any = {}
                    object['verification_partner'] = config['verification_partner'],
                        object['doc'] = doc;
                    this.savedDocConfigTableView.push(object);
                });
            });
        } catch (e) {
            console.error(e);
        }
    }

    removeUnderScore(text: string = '') {
        return text !== '' ? text.split('_').join(' ') : '';
    }

    async deleteDoc(doc: any, verificationPartner: any) {
        let deleteObject: any = {};
        this.savedDocConfig.forEach((config: any) => {
            if (config['verification_partner'] === verificationPartner) {
                delete config['docs'][doc]
                delete config['created_on']
                deleteObject = config;
            }
        });
        try {
            await this.http.update(deleteObject['id'], deleteObject, {}, 'auth/doc_verification_config')
            this.getDocConfigDataById().then();
            this.messageService.add({
                severity: 'success', summary: 'Added successfully',
                detail: verificationPartner + ': ' + this.removeUnderScore(doc)
            });

        } catch (e) {
            this.messageService.add({ severity: 'error', summary: 'error', detail: 'Could not remove config!' });
            console.error(e);
        }
    }

    async saveDocConfig() {
        const payloadObject = JSON.parse(JSON.stringify(this.selectedVerificationObject));
        delete payloadObject['created_on'];
        delete payloadObject['id'];
    
        const savedConfig = this.savedDocConfig.find((x: any) => x['verification_partner'] ===
          this.selectedVerificationObject['verification_partner']);
        if (savedConfig) {
          payloadObject['id'] = savedConfig['id'];
        }
        Object.keys(payloadObject['docs']).forEach((doc: any) => {
          if (!this.selectedVerificationDocs.includes(doc) &&
            ((this.savedDocConfigObjectByVerifyPartner[payloadObject['verification_partner']] &&
              !this.savedDocConfigObjectByVerifyPartner[payloadObject['verification_partner']].includes(payloadObject['docs'][doc]))
            || !this.savedDocConfigObjectByVerifyPartner[payloadObject['verification_partner']]))
            delete payloadObject['docs'][doc];
        });
        payloadObject['company_id'] = this.id;
        try {
          if (payloadObject['id']) {
            await this.http.update(payloadObject['id'], payloadObject, {}, 'auth/doc_verification_config');
          } else {
            await this.http.create(payloadObject, {}, 'auth/doc_verification_config');
          }
            this.messageService.add({severity:'success', summary: 'Config saved successfully!', detail: ''});
            await this.getDocConfigDataById();
        } catch (e) {
          console.error(e);
          this.messageService.add({severity:'error', summary: 'error', detail: ''});
        }
      }
}
