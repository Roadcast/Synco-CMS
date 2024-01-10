import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { DataService } from '../../data.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss']
})
export class OrderComponent implements OnInit {
  orderTabs: any;
  generalConfigId: any;
  constructor(private http: DataService,
    private translate: TranslateService,
    private user: UserService) {
    this.getUploadFormatConfig().then();
  }
  ngOnInit(): void {
    this.user.orderTabs$.subscribe((orderTabs) => {
      this.orderTabs = orderTabs;
    });
    this.user.id$.subscribe((res: any) => {
      this.generalConfigId = res;
    })
  }

  formatConfig = {
    id: null,
    key: 'upload_format_auto_route',
    value: {
      shipment_id: 'shipment_id',
      name: 'name',
      phone: 'phone',
      external_id: 'external_id',
      address: 'address',
      pin_code: 'pin_code',
      latitude: 'latitude',
      longitude: 'longitude',
      weight: 'weight',
      split: 'split',
    },
  };

  translateText(key: string): string {
    let translation: string = '';
    this.translate.get(key).subscribe((res: string) => {
      translation = res;
    });
    return translation;
  }

  async getUploadFormatConfig() {
    this.http.query({
      __only: ['id', 'key', 'value'],
      __key__equal: 'upload_format_auto_route',
    }, 'auth/company_config').then(res => {
      this.formatConfig = res.data[0];
    }).catch(() => {});
  }
}
