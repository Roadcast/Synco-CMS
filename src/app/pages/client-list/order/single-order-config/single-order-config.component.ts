import { Component, Input, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { DataService } from 'src/app/pages/data.service';
import { ToastService } from 'src/app/pages/toast.service';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';


@Component({
  selector: 'app-single-order-config',
  templateUrl: './single-order-config.component.html',
  styleUrls: ['./single-order-config.component.scss']
})
export class SingleOrderConfigComponent implements OnInit {
  dataSource: any;
  customFields: any;
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
  loader = true;
  customType = '';
  @Input() orderTabs!: any;;
  @Input() configId!: any;
  status = [];
  infoPopup = 'NOTE: Only the last custom field can be deleted!';

  constructor( private http: DataService, private toast: ToastService,
               private translate: TranslateService) { }
  translateText(key: string): string {
    let translation: string='';
    this.translate.get(key).subscribe((res: string) => {
      translation = res;
    });
    return translation;
  }
  ngOnInit() {
    this.dataSource = [];
    this.customFields = [];
    this.fetchOrderFieldConfig().then();
    this.getStatus().then();
  }

  async fetchOrderFieldConfig(): Promise<any> {
    try {
      const fieldConfig = (await this.http.query({}, 'order/order_field_config')).data;
      this.dataSource = [];
      this.customFields = [];
      this.dataSource = fieldConfig;
      fieldConfig.forEach(( field:any) => {
        if (field.is_custom === true) {
          this.customFields.push(field);
        }
      });
      if (this.dataSource) {
        this.loader = false;
      }
    } catch (err) {
      this.loader = false;
    }
  }

  async addNewField(): Promise<any> {
    if (this.customType) {
      if (this.customFields.length < 10) {
        this.newField.actual_field_name = 'field' + (this.customFields.length + 1);
        this.newField.custom_type = this.customType;
        this.customFields.push(this.newField);
        this.dataSource.push(this.newField);
        this.customType = '';
        await this.http.create(this.newField, {}, 'order/order_field_config');
        this.toast.showToast(this.translateText('Field added successfully!'), 'Added', false);
        this.fetchOrderFieldConfig().then();
      } else {
        this.toast.showToast(this.translateText('Custom field max limit(10) reached!'), 'Warning', true);
      }
    } else {
      this.toast.showToast(this.translateText('Provide all details'), 'Warning', true);
    }
  }

  async removeField(fieldId:any) {
    try {
      await this.http.delete(fieldId, {}, 'order/order_field_config');
        this.toast.showToast(this.translateText('Field deleted successfully!'), 'Success', false);
        this.fetchOrderFieldConfig().then();
    } catch (err:any) {
      this.toast.showToast(err.message, 'Error!', true);
    }
  }

  deleteDropDown(fieldName:any, value:any) {
    let index :any;
    this.customFields.forEach( (field:any, key:any) => {
      if (field.actual_field_name === fieldName) {
        index = key;
      }
    });
    const index2 = this.customFields[index].custom_dropdown.indexOf(value);
    this.customFields[index].custom_dropdown.splice(index2, 1);
    const dropdown = this.customFields[index].custom_dropdown;
    this.dataSource.forEach( (field:any, key:any) => {
      if (field.actual_field_name === fieldName) {
        index = key;
      }
    });
    this.dataSource[index].custom_dropdown = dropdown;
  }

  addDropDown(fieldName:any, value:any) {
    let index:any;
    this.customFields.forEach( (field:any, key:any) => {
      if (field.actual_field_name === fieldName) {
        index = key;
      }
    });
    if (!this.customFields[index].custom_dropdown) {
      this.customFields[index].custom_dropdown = [];
    }
    this.customFields[index].custom_dropdown.push(value);
    const dropdown = this.customFields[index].custom_dropdown;
    this.dataSource.forEach( (field:any, key:any) => {
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
        this.toast.showToast(this.translateText('Field updated successfully.'), 'Success', false);
      }
    } catch (err:any) {
      this.toast.showToast(err.message, 'Error!', true);
    }
  }

  async save(data: any) {
    try {
      const response = await this.http.update(data.id, data, {}, 'order/order_field_config');
      if (response.success === true) {
        this.toast.showToast(this.translateText('Field updated successfully.'), 'Success', false);
      }
    } catch (err:any) {
      this.toast.showToast(err.message, 'Error!', true);
    }
  }

  async saveTabs() {
    try {
      this.status.forEach((stats:any) => {
        if (stats.active) {
          const data = {
            show_name: stats.show_name,
            status_id: stats.id,
          };
          this.orderTabs.push(data);
        }
      });
      await this.http.update(this.configId, {order_tabs: this.orderTabs}, {}, 'order/order_config');
      this.toast.showToast(this.translateText('Status updated successfully'), 'Updated!', false);
      this.orderTabs = [];
    } catch (e:any) {
      this.toast.showToast(e.message, 'Error!', true);
    }
  }

  async getStatus() {
    console.log(this.orderTabs);
    try {
      this.status = (await this.http.query({
        __order_by: 'code',
      }, 'order/status', 'order')).data;
      console.log(this.status);
      this.status = this.status.filter((stats:any) => stats.code);
      console.log(this.status);
      this.status.forEach((stats:any) => {
        this.orderTabs.find((tab:any) => {
          if (tab.status_id === stats.id) {
            stats.active = true;
            stats.show_name = tab.show_name;
            tab.name = stats.name;
          }
        });
      console.log(this.status);
      });
      this.orderTabs = [];
    } catch (e) {
    }
  }

  drop2(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.status, event.previousIndex, event.currentIndex);
  }

  drop1(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.dataSource, event.previousIndex, event.currentIndex);
    this.dataSource.forEach((data:any, index:any) => {
      data.show_sequence = index + 1;
    });
  }
}