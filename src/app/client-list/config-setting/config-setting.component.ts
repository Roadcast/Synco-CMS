import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {ApiService} from "../../services/api.service";
import {MessageService} from "primeng/api";

@Component({
  selector: 'app-config-setting',
  templateUrl: './config-setting.component.html',
  styleUrls: ['./config-setting.component.scss']
})
export class ConfigSettingComponent implements OnInit {
  loading: boolean = false;
  outletsData: any;
  statusData: any;
  addApiData = {
    triggerName: '',
    triggerService: '',
    eventId: '',
    delayData: 1,
  }
  companyId: any;
  companyTrigger: any;
  id: any;
  docConfigRef: any = [];
  savedDocConfig: any = [];
  savedDocConfigTableView: any = [];
  savedDocConfigObjectByVerifyPartner: any = {};
  selectedVerificationDocsRef: any = [];
  selectedVerificationObject: any;
  selectedVerificationDocs: any = [];
  generalConfig = {
    face_recognition: {
      key: 'face_recognition',
      value: false,
      id: '',
    },
    live_streaming: {
      key: 'live_streaming',
      value: false,
      id: '',
    },
    custom_order_form: {
      is_default_form: false
    }
  };
  displayConfirmationDialog: any = false;
  selectedConfig: any;
  private orderConfigId: any;

  constructor(private router: Router,private http: ApiService, private activateRoute: ActivatedRoute,
              private messageService: MessageService) {
    this.activateRoute.params.subscribe(async res => {
      if (res['id'] !== 'new') {
        this.id = res['id'];
        this.setGeneralConfig().then();
      }
    });
  }

  ngOnInit(): void {
    this.getTrigger().then();
    this.getStatus().then();
    this.getDocConfigDataRef().then();
    this.getDocConfigDataById().then();
  }
   async getTrigger() {
     try {
       this.loading = true;
       this.outletsData = (await this.http.get('', {}, 'order/trigger_point_ref')).data;
       this.companyTrigger = (await this.http.get(this.id, {}, 'order/partner_trigger_point')).data;
     } catch (e) {
       this.loading = false;
       console.error(e);
     }
   }

  async getStatus() {
    try {
      this.statusData = (await this.http.get('', {}, 'order/status')).data;
      this.loading = false;
    } catch (e) {
      this.loading = false;
      console.error(e);
    }
  }
  back() {
    this.router.navigateByUrl('').then();
  }
  triggerData(event: any) {
    this.addApiData.triggerName = event.value.name;
    this.addApiData.triggerService = event.value.service;
  }
  eventData(event: any) {
    this.addApiData.eventId = event.value.id;
  }
  addTrigger() {
    try {
      this.http.create({
        name: this.addApiData.triggerName,
        delay: this.addApiData.delayData,
        service: this.addApiData.triggerService,
        status_id: this.addApiData.eventId
      }, {}, 'order/partner_trigger_point/' + this.id).then();
      this.getTrigger().then();
      this.messageService.add({severity:'success', summary: 'Added successfully', detail: this.addApiData.triggerName});
    } catch (e) {
      this.messageService.add({severity:'error', summary: 'error', detail: ''});
    }
  }

  delTrigger(event: any) {
    try {
      this.http.delete(event.id, {}, 'order/partner_trigger_point').then();
      this.getTrigger().then();
      this.messageService.add({severity:'success', summary: 'Removed successfully', detail: event.name});

    } catch (e) {
      this.messageService.add({severity:'error', summary: 'error', detail: ''});
    }
  }

  async getDocConfigDataRef() {
    try {
      this.docConfigRef = (await this.http.query({}, 'auth/doc_config')).data;

    } catch (e) {
      console.error(e);
    }
  }

  async getDocConfigDataById() {
    try {
      this.savedDocConfigObjectByVerifyPartner = {};
      this.savedDocConfigTableView = [];
      this.selectedVerificationDocsRef = [];
      this.selectedVerificationDocs = [];
      this.selectedVerificationObject = null;
      this.savedDocConfig = (await this.http.query({__company_id__equal: this.id}, 'auth/doc_verification_config')).data;
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
      this.messageService.add({severity:'success', summary: 'Added successfully',
        detail: verificationPartner + ': ' + this.removeUnderScore(doc)});

    } catch (e) {
      this.messageService.add({severity:'error', summary: 'error', detail: 'Could not remove config!'});
      console.error(e);
    }
  }

  removeUnderScore(text: string = '') {
    return text !== '' ? text.split('_').join(' ') : '';
  }

  async getCompanyConfig() {
    try {
      return (await this.http.query({
        __company_id__equal: this.id,
      }, 'auth/company_config')).data;
    } catch (e) {
      console.error(e);
      return null;
    }
  }

  async getCompanyOrderConfig() {
    try {
      return (await this.http.query({
        __company_id__equal: this.id,
      }, 'order/order_config')).data[0];

    } catch (e) {
      console.error(e);
      return null;
    }
  }

  saveConfig() {
    if (this.selectedConfig === 'face_recognition') {
      this.saveFaceRecognition().then();
    }
    if (this.selectedConfig === 'live_streaming') {
      this.saveLiveStreaming().then();
    }
    if (this.selectedConfig === 'custom_order_form') {
      this.saveDefaultOrderForm().then();
    }
    this.selectedConfig = null;
  }

  async saveFaceRecognition() {
    try {
      const faceRecognitionObj = {
        key: 'face_recognition',
        value: this.generalConfig.face_recognition.value ? 1 : 0,
      }
      if (this.generalConfig.face_recognition.id === '') {
        await this.http.create(faceRecognitionObj, {}, 'auth/company_config');
      } else {
        await this.http.update(this.generalConfig.face_recognition.id, faceRecognitionObj, {}, 'auth/company_config');
        this.messageService.add({severity:'success', summary: 'Success', detail: 'Config updated successfully!'});
        await this.setGeneralConfig();
      }
    } catch (e) {
      console.error(e);
    }
  }

  async saveLiveStreaming() {
    try {
      const liveStreamingObj = {
        key: 'live_streaming',
        value: this.generalConfig.live_streaming.value ? 1 : 0,
      }
      if (this.generalConfig.live_streaming.id === '') {
        await this.http.create(liveStreamingObj, {}, 'auth/company_config');
      } else {
        await this.http.update(this.generalConfig.live_streaming.id, liveStreamingObj, {}, 'auth/company_config');
        this.messageService.add({severity:'success', summary: 'Success', detail: 'Config updated successfully!'});
        await this.setGeneralConfig();
      }
    } catch (e) {
      console.error(e);
    }
  }

  async saveDefaultOrderForm() {
    try {
      if (!this.orderConfigId) {
        this.messageService.add({severity: 'Error!', summary: 'No order config found.', detail: ''});
        return;
      }
      await this.http.update(this.orderConfigId, this.generalConfig.custom_order_form, {}, 'order/order_config');
        this.messageService.add({severity:'success', summary: 'Success', detail: 'Config updated successfully!'});
      await this.setGeneralConfig();
    } catch (e) {
      console.error(e);
    }
  }

  openConfirmationDialog(configType: string, event: any) {
    this.selectedConfig = configType;
    this.displayConfirmationDialog = true;
  }

  cancelSave() {
    if (this.selectedConfig === 'face_recognition') {
      this.generalConfig.face_recognition.value = !this.generalConfig.face_recognition.value;
    }
    if (this.selectedConfig === 'live_streaming') {
      this.generalConfig.live_streaming.value = !this.generalConfig.live_streaming.value;
    }
    if (this.selectedConfig === 'custom_order_form') {
      this.generalConfig.custom_order_form.is_default_form = !this.generalConfig.custom_order_form.is_default_form;
    }
    this.displayConfirmationDialog = false;
    this.selectedConfig = null;
  }

  async setGeneralConfig() {
    const config = await this.getCompanyConfig();
    const orderConfig = await this.getCompanyOrderConfig();
    this.orderConfigId = orderConfig ? orderConfig.id : null;
    const faceRecognitionObj = config.find((x: any) => x.key === 'face_recognition');
    if (faceRecognitionObj) {
      this.generalConfig.face_recognition.value = faceRecognitionObj.value !== 0;
      this.generalConfig.face_recognition.id = faceRecognitionObj.id;
    }

    const liveStreamObj = config.find((x: any) => x.key === 'live_streaming');
    if (liveStreamObj) {
      this.generalConfig.live_streaming.value = liveStreamObj.value !== 0;
      this.generalConfig.live_streaming.id = liveStreamObj.id;
    }
    this.generalConfig.custom_order_form.is_default_form = orderConfig['is_default_form'] ? orderConfig['is_default_form'] : false;
  }
}
