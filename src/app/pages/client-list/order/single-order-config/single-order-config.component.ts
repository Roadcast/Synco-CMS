import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { DataService } from 'src/app/pages/data.service';
import { ToastService } from 'src/app/pages/toast.service';

@Component({
  selector: 'app-single-order-config',
  templateUrl: './single-order-config.component.html',
  styleUrls: ['./single-order-config.component.scss']
})
export class SingleOrderConfigComponent implements OnInit {

  constructor(private http: DataService, private toast: ToastService,
    private translate: TranslateService) { }
  dataSource: any;
  customFields: any;
  loader = true;

  ngOnInit(): void {
    this.dataSource = [];
    this.customFields = [];
    this.fetchOrderFieldConfig().then();
  }

  translateText(key: string): string {
    let translation: string = '';
    this.translate.get(key).subscribe((res: string) => {
      translation = res;
    });
    return translation;
  }

  async fetchOrderFieldConfig(): Promise<any> {
    try {
      const fieldConfig = (await this.http.query({}, 'order/order_field_config')).data;
      this.dataSource = [];
      this.customFields = [];
      this.dataSource = fieldConfig;
      fieldConfig.forEach((field: any) => {
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

}
