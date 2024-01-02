import {ChangeDetectorRef, Component, Input, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {ApiService} from "../../../services/api.service";
import {MessageService} from "primeng/api";
import { TranslateService } from '@ngx-translate/core'; 
import { DataService } from '../../data.service';
import { ToastService } from '../../toast.service';
import { ConfigService } from '../../config.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-config-setting',
  templateUrl: './config-setting.component.html',
  styleUrls: ['./config-setting.component.scss']
})
export class ConfigSettingComponent  {
 
  loading: boolean = false;
  setActiveTab = "General";
  activeTabId = "yardConfig";
  companyId: any;

  loader = false;
  Object = Object;
  company_id:any;
  companyName:any;

  constructor(
    private http: DataService,
    private toaster: ToastService,
    public configService: ConfigService,
    private translate: TranslateService,
    private activeRoute: ActivatedRoute,
    private ref: ChangeDetectorRef,
    private user : UserService
  ) {
    this.loader = true;
    this.activeRoute.queryParams.subscribe((params) => {
      this.setActiveTab = params["page"];
    });
    this.activeRoute.paramMap.subscribe(params => {
        this.company_id = params.get('id');
      });
      localStorage.setItem('company_Id', this.company_id);
  }

  translateText(key: string): string {
    let translation: any;
    this.translate.get(key).subscribe((res: string) => {
      translation = res;
    });
    return translation;
  }

  ngOnInit() {
    this.http.query({__company_id__equal: this.company_id}, "auth/company_config", "auth").then((data) => {
      console.log(data);
      this.companyId = data?.data.find((el:any) => el.company_id).company_id;
      // this.user.getCompanyConfig();
    });
    this.companyName = localStorage.getItem('companyName');
  }
  
  validateInput(event: any) {
    if (event.target.value.length >= 1) {
      return false;
    }
    const charCode = event.which ? event.which : event.keyCode;
    if (charCode < 48 || charCode > 49) {
      event.preventDefault();
      return false;
    } else {
      // if(charCode<48 || charCode>49 || charCode === 8){
      if (charCode < 48 && charCode > 49) {
        event.preventDefault();
        return false;
      } else {
        return true;
      }
    }
  }

  ngAfterContentChecked() {
    this.ref.detectChanges();
  }

  loadingStatus(event:any) {
    this.loading = event;
  }
  
  onChangeOfTabset(event:any) {
    console.log(event);
    console.log(this.setActiveTab);
    
    this.setActiveTab = event.tabTitle;
    console.log(this.setActiveTab);
  }

  // loading: boolean = false;
  // outletsData: any;
  // statusData: any;
  // addApiData = {
  //   triggerName: '',
  //   triggerService: '',
  //   eventId: '',
  //   delayData: 1,
  // }
  // companyTrigger: any;
  // id: any;
  // docConfigRef: any = [];
  // savedDocConfig: any = [];
  // savedDocConfigTableView: any = [];
  // savedDocConfigObjectByVerifyPartner: any = {};
  // selectedVerificationDocsRef: any = [];
  // selectedVerificationObject: any;
  // selectedVerificationDocs: any = [];


  // constructor(private router: Router,private http: ApiService, private activateRoute: ActivatedRoute,
  //             private messageService: MessageService) {
  //   this.activateRoute.params.subscribe(async res => {
  //     if (res['id'] !== 'new') {
  //       this.id = res['id'];
  //     }
  //   });
  // }

  // ngOnInit(): void {
  //   this.getTrigger().then();
  //   this.getStatus().then();
  //   this.getDocConfigDataRef().then();
  //   this.getDocConfigDataById().then();
  // }
  //  async getTrigger() {
  //    try {
  //      this.loading = true;
  //      this.outletsData = (await this.http.get('', {}, 'order/trigger_point_ref')).data;
  //      this.companyTrigger = (await this.http.get(this.id, {}, 'order/partner_trigger_point')).data;
  //    } catch (e) {
  //      this.loading = false;
  //      console.error(e);
  //    }
  //  }

  // async getStatus() {
  //   try {
  //     this.statusData = (await this.http.get('', {}, 'order/status')).data;
  //     this.loading = false;
  //   } catch (e) {
  //     this.loading = false;
  //     console.error(e);
  //   }
  // }
  // back() {
  //   this.router.navigateByUrl('').then();
  // }
  // triggerData(event: any) {
  //   this.addApiData.triggerName = event.value.name;
  //   this.addApiData.triggerService = event.value.service;
  // }
  // eventData(event: any) {
  //   this.addApiData.eventId = event.value.id;
  // }
  // addTrigger() {
  //   try {
  //     this.http.create({
  //       name: this.addApiData.triggerName,
  //       delay: this.addApiData.delayData,
  //       service: this.addApiData.triggerService,
  //       status_id: this.addApiData.eventId
  //     }, {}, 'order/partner_trigger_point/' + this.id).then();
  //     this.getTrigger().then();
  //     this.messageService.add({severity:'success', summary: 'Added successfully', detail: this.addApiData.triggerName});
  //   } catch (e) {
  //     this.messageService.add({severity:'error', summary: 'error', detail: ''});
  //   }
  // }

  // delTrigger(event: any) {
  //   try {
  //     this.http.delete(event.id, {}, 'order/partner_trigger_point').then();
  //     this.getTrigger().then();
  //     this.messageService.add({severity:'success', summary: 'Removed successfully', detail: event.name});

  //   } catch (e) {
  //     this.messageService.add({severity:'error', summary: 'error', detail: ''});
  //   }
  // }

  // async getDocConfigDataRef() {
  //   try {
  //     this.docConfigRef = (await this.http.query({}, 'auth/doc_config')).data;

  //   } catch (e) {
  //     console.error(e);
  //   }
  // }

  // async getDocConfigDataById() {
  //   try {
  //     this.savedDocConfigObjectByVerifyPartner = {};
  //     this.savedDocConfigTableView = [];
  //     this.selectedVerificationDocsRef = [];
  //     this.selectedVerificationDocs = [];
  //     this.selectedVerificationObject = null;
  //     this.savedDocConfig = (await this.http.query({__company_id__equal: this.id}, 'auth/doc_verification_config')).data;
  //     this.savedDocConfig.forEach((config: any) => {
  //       Object.keys(config['docs']).forEach(doc => {
  //         this.savedDocConfigObjectByVerifyPartner[config['verification_partner']] ?
  //           this.savedDocConfigObjectByVerifyPartner[config['verification_partner']].push(config['docs'][doc]) :
  //           this.savedDocConfigObjectByVerifyPartner[config['verification_partner']] = [config['docs'][doc]]
  //         const object: any = {}
  //         object['verification_partner'] = config['verification_partner'],
  //           object['doc'] = doc;
  //         this.savedDocConfigTableView.push(object);
  //       });
  //     });
  //   } catch (e) {
  //     console.error(e);
  //   }
  // }

  // setVerificationDocs() {
  //   this.selectedVerificationDocsRef = [];
  //   this.selectedVerificationDocs = [];
  //   if (!this.selectedVerificationObject)
  //     return;
  //   this.selectedVerificationDocsRef = Object.keys(this.selectedVerificationObject['docs'])
  //     .map(x => {
  //       return {
  //         name: this.selectedVerificationObject['docs'][x],
  //         value: x,
  //         disable: !!(this.savedDocConfigObjectByVerifyPartner[this.selectedVerificationObject['verification_partner']] &&
  //           this.savedDocConfigObjectByVerifyPartner[this.selectedVerificationObject['verification_partner']]
  //             .includes(this.selectedVerificationObject['docs'][x])),
  //       }
  //     });
  // }

  // async saveDocConfig() {
  //   const payloadObject = JSON.parse(JSON.stringify(this.selectedVerificationObject));
  //   delete payloadObject['created_on'];
  //   delete payloadObject['id'];

  //   const savedConfig = this.savedDocConfig.find((x: any) => x['verification_partner'] ===
  //     this.selectedVerificationObject['verification_partner']);
  //   if (savedConfig) {
  //     payloadObject['id'] = savedConfig['id'];
  //   }
  //   Object.keys(payloadObject['docs']).forEach((doc: any) => {
  //     if (!this.selectedVerificationDocs.includes(doc) &&
  //       ((this.savedDocConfigObjectByVerifyPartner[payloadObject['verification_partner']] &&
  //         !this.savedDocConfigObjectByVerifyPartner[payloadObject['verification_partner']].includes(payloadObject['docs'][doc]))
  //       || !this.savedDocConfigObjectByVerifyPartner[payloadObject['verification_partner']]))
  //       delete payloadObject['docs'][doc];
  //   });
  //   payloadObject['company_id'] = this.id;
  //   try {
  //     if (payloadObject['id']) {
  //       await this.http.update(payloadObject['id'], payloadObject, {}, 'auth/doc_verification_config');
  //     } else {
  //       await this.http.create(payloadObject, {}, 'auth/doc_verification_config');
  //     }
  //       this.messageService.add({severity:'success', summary: 'Config saved successfully!', detail: ''});
  //       await this.getDocConfigDataById();
  //   } catch (e) {
  //     console.error(e);
  //     this.messageService.add({severity:'error', summary: 'error', detail: ''});
  //   }
  // }

  // async deleteDoc(doc: any, verificationPartner: any) {
  //   let deleteObject: any = {};
  //   this.savedDocConfig.forEach((config: any) => {
  //     if (config['verification_partner'] === verificationPartner) {
  //       delete config['docs'][doc]
  //       delete config['created_on']
  //       deleteObject = config;
  //     }
  //   });
  //   try {
  //     await this.http.update(deleteObject['id'], deleteObject, {}, 'auth/doc_verification_config')
  //     this.getDocConfigDataById().then();
  //     this.messageService.add({severity:'success', summary: 'Added successfully',
  //       detail: verificationPartner + ': ' + this.removeUnderScore(doc)});

  //   } catch (e) {
  //     this.messageService.add({severity:'error', summary: 'error', detail: 'Could not remove config!'});
  //     console.error(e);
  //   }
  // }

  // removeUnderScore(text: string = '') {
  //   return text !== '' ? text.split('_').join(' ') : '';
  // }
}
