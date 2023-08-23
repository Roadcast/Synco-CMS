import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {ApiService} from "../../../services/api.service";
import {ActivatedRoute} from "@angular/router";
import {MessageService} from "primeng/api";

@Component({
  selector: 'app-general-config',
  templateUrl: './general-config.component.html',
  styleUrls: ['./general-config.component.scss']
})
export class GeneralConfigComponent implements OnInit, OnChanges {
  @Input() id = null;
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
  dataSource: any = [];
  customFields: any = [];
  dataTypes = [{label: 'Text', value: 'text'}, {label: 'Number', value: 'number'}, {
    label: 'Dropdown',
    value: 'dropdown'
  },
    {label: 'Date', value: 'date'}, {label: 'Boolean', value: 'boolean'},]

  newField = {
    'actual_field_name': '',
    'custom_dropdown': null,
    'custom_type': '',
    'description': null,
    'is_custom': true,
    'is_required': false,
    'is_visible': false,
    'show_field_name': '',
    'show_field_placeholder': '',
    'show_sequence': 3,
  };
  customType = '';
  status = [];

  constructor(private http: ApiService, private messageService: MessageService) {
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.setGeneralConfig().then();
    this.dataSource = [];
    this.customFields = [];
    this.fetchOrderFieldConfig().then();
  }

  ngOnInit(): void {
  }


  async fetchOrderFieldConfig(): Promise<any> {
    try {
      const fieldConfig = (await this.http.query({}, 'order/order_field_config')).data;
      this.dataSource = [];
      this.customFields = [];
      this.dataSource = fieldConfig;
      fieldConfig.forEach( (field: any) => {
        if (field.is_custom) {
          this.customFields.push(field);
        }
      });
    } catch (err) {
    }
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
      const faceRecognitionObj: any = {
        key: 'face_recognition',
        value: this.generalConfig.face_recognition.value ? 1 : 0,
      }
      if (this.generalConfig.face_recognition.id === '') {
        faceRecognitionObj['company_id'] = this.id;
        await this.http.create(faceRecognitionObj, {}, 'auth/company_config');
      } else {
        await this.http.update(this.generalConfig.face_recognition.id, faceRecognitionObj, {}, 'auth/company_config');
        this.messageService.add({severity:'success', summary: 'Success', detail: 'Config updated successfully!'});
      }
      await this.setGeneralConfig();
    } catch (e) {
      this.messageService.add({severity:'error', summary: 'error!', detail: 'Could not save!'});
      this.generalConfig.face_recognition.value = !this.generalConfig.face_recognition.value;
      console.error(e);
    }
  }

  async saveLiveStreaming() {
    try {
      const liveStreamingObj: any = {
        key: 'live_streaming',
        value: this.generalConfig.live_streaming.value ? 1 : 0,
      }
      if (this.generalConfig.live_streaming.id === '') {
        liveStreamingObj['company_id'] = this.id;
        await this.http.create(liveStreamingObj, {}, 'auth/company_config');
      } else {
        await this.http.update(this.generalConfig.live_streaming.id, liveStreamingObj, {}, 'auth/company_config');
        this.messageService.add({severity:'success', summary: 'Success', detail: 'Config updated successfully!'});
      }
      await this.setGeneralConfig();
    } catch (e) {
      this.messageService.add({severity:'error', summary: 'error!', detail: 'Could not save!'});
      this.generalConfig.live_streaming.value = !this.generalConfig.live_streaming.value;
      console.error(e);
    }
  }

  async saveDefaultOrderForm() {
    try {
      if (!this.orderConfigId) {
        await this.http.create({
          is_default_form: this.generalConfig.custom_order_form.is_default_form,
          company_id: this.id,
        }, {}, 'order/order_config');
        this.messageService.add({severity:'success', summary: 'Success', detail: 'Config updated successfully!'});
        await this.setGeneralConfig();
        return;
      }
      await this.http.update(this.orderConfigId, this.generalConfig.custom_order_form, {}, 'order/order_config');
      this.messageService.add({severity:'success', summary: 'Success', detail: 'Config updated successfully!'});
      await this.setGeneralConfig();
    } catch (e) {
      this.messageService.add({severity:'error', summary: 'error!', detail: 'Could not save!'});
      this.generalConfig.custom_order_form.is_default_form = !this.generalConfig.custom_order_form.is_default_form;
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



  async saveCustomFields(data: any) {
    try {
      const response = await this.http.update(data.id, data, {}, 'order/order_field_config');
      if (response.success === true) {
      this.messageService.add({severity:'success', summary: 'Success', detail: 'Fields saved successfully!'});
      }
    } catch (err) {
      this.messageService.add({severity:'error', summary: 'error!', detail: 'Could not save fields!'});
    }
  }

  async removeField(fieldId: any) {
    try {
      await this.http.delete(fieldId, {}, 'order/order_field_config');
      this.messageService.add({severity:'success', summary: 'Success', detail: 'Removed field successfully!'});
      this.fetchOrderFieldConfig().then();
    } catch (err) {
      this.messageService.add({severity:'error', summary: 'error!', detail: 'Could not remove field!'});
    }
  }

  async addNewCustomField(): Promise<any> {
    if (this.customType) {
      if (this.customFields.length < 10) {
        this.newField.actual_field_name = 'field' + (this.customFields.length + 1);
        this.newField.custom_type = this.customType;
        this.customFields.push(this.newField);
        this.dataSource.push(this.newField);
        this.customType = '';
        await this.http.create(this.newField, {}, 'order/order_field_config');
        this.messageService.add({severity:'success', summary: 'Success', detail: 'Field added successfully!'});
        this.fetchOrderFieldConfig().then();
      } else {
        this.messageService.add({severity:'error', summary: 'error!', detail: 'Custom field max limit(10) reached!'});
      }
    } else {
      this.messageService.add({severity:'error', summary: 'error!', detail: 'Provide all details'});
    }
  }

  deleteDropDown(fieldName: any, value: any) {
    let index = -1;
    this.customFields.forEach( (field: any, key: any) => {
      if (field.actual_field_name === fieldName) {
        index = key;
      }
    });
    const index2 = this.customFields[index].custom_dropdown.indexOf(value);
    this.customFields[index].custom_dropdown.splice(index2, 1);
    const dropdown = this.customFields[index].custom_dropdown;
    this.dataSource.forEach( (field: any, key: any) => {
      if (field.actual_field_name === fieldName) {
        index = key;
      }
    });
    this.dataSource[index].custom_dropdown = dropdown;
  }

  addDropDown(fieldName: any, value: any) {
    let index = -1;
    this.customFields.forEach( (field: any, key: any) => {
      if (field.actual_field_name === fieldName) {
        index = key;
      }
    });
    if (!this.customFields[index].custom_dropdown) {
      this.customFields[index].custom_dropdown = [];
    }
    this.customFields[index].custom_dropdown.push(value);
    const dropdown = this.customFields[index].custom_dropdown;
    this.dataSource.forEach( (field: any, key: any) => {
      if (field.actual_field_name === fieldName) {
        index = key;
      }
    });
    if (!this.dataSource[index].custom_dropdown) {
      this.dataSource[index].custom_dropdown = [];
    }
    this.dataSource[index].custom_dropdown = dropdown;
  }

  async SaveField(fieldData: any): Promise<any> {
    try {
      const response = await this.http.update(fieldData.id, fieldData, {}, 'order/order_field_config');
      if (response.success === true) {
        this.messageService.add({severity:'success', summary: 'Success', detail: 'Fields saved successfully!'});
      }
    } catch (err) {
        this.messageService.add({severity:'error', summary: 'error!', detail: 'Could not save fields!'})
    }
  }

}
