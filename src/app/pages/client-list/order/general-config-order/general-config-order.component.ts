import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { DataService } from 'src/app/pages/data.service';
import { PagesService } from 'src/app/pages/pages.service';
import { ToastService } from 'src/app/pages/toast.service';

@Component({
  selector: 'app-general-config-order',
  templateUrl: './general-config-order.component.html',
  styleUrls: ['./general-config-order.component.scss']
})
export class GeneralConfigOrderComponent implements OnInit {

  generalConfigObj: any = {
    auto_cancel_mins: 0,
    auto_cancel_order: false,
    auto_complete_mins: 0,
    auto_delivered: false,
    auto_dispatch: false,
    auto_geo_fence_radius: 0,
    auto_reached_destination: false,
    auto_reached_pick_up: false,
    auto_switch_rider_no_accept_mins: 0,
    batch_search_distance: 0,
    calculate_distance_with_filter: false,
    cancel_order_by_rider: false,
    cash_management_config: false,
    check_geofence_for_order_update: false,
    company_id: '',
    create_multi_order: false,
    create_single_order: false,
    created_on: '',
    delivery_after_all_picked_up: false,
    enable_order_live_temperature: false,
    estimated_distance_payout: false,
    estimated_distance_payout_value: {},
    google_api_for_distance_calculation: false,
    id: '',
    is_default_form: false,
    items_check_required: false,
    manual_assign_rider_daily_limit: null,
    max_batch_count: 0,
    multi_order_deliver_option: false,
    multiple_order_assign: false,
    order_location_confirmation_radius: false,
    order_location_confirmation_screen: false,
    order_tabs: [],
    proof_of_delivery_picture: false,
    proof_of_delivery_scanner: false,
    proof_of_delivery_signature: false,
    proof_of_pick_up_picture: false,
    proof_of_pick_up_scanner: false,
    proof_of_pick_up_signature: false,
    qr_code_scan_for_order_delivered: false,
    qr_code_scan_for_order_reach_pick_up: false,
    reach_on_geo_fence_mins: 0,
    rider_cash_in_hand_limit: 0,
    rider_search_distance: 0,
    running_auto_assign_algorithm_min: 0,
    schedule_order_before_time_min: 0,
    should_at_customer_location: false,
    should_at_customer_location_radius: 0,
    should_at_delivery_location: false,
    should_at_delivery_location_radius: 0,
    should_at_dispatch_location: false,
    should_at_dispatch_location_radius: 0,
    should_at_pick_up_location: false,
    should_at_pick_up_location_radius: 0,
    show_duty_order: false,
    show_free_riders_only: false,
    show_lat_lng: false,
    show_mark_in_riders_only: false,
    show_on_duty_riders_only: false,
    show_order_cancel_option: false,
    show_schedule_order: false,
    show_single_order: false,
    stop_auto_assign_without_delivery_geom: false,
    use_google: false,
  };

  generalConfig: any = {};
  orderTabs: any = [];
  addJsonFormatValue = {
    estimated_distance_payout_value: {},
  };
  updatedValue: any = {};

  constructor(private http: DataService, private toast: ToastService,
    private translate: TranslateService, private pagesService: PagesService) {
    this.getGeneralConfig().then();
  }

  ngOnInit(): void {
  }

  translateText(key: string): string {
    let translation: string='';
    this.translate.get(key).subscribe((res: string) => {
      translation = res;
    });
    return translation;
  }

  async getGeneralConfig() {
    try {
      this.generalConfig = (await this.http.query({}, 'order/order_config', 'order')).data[0];
      this.generalConfigObj = Object.assign({}, this.generalConfig);
      this.orderTabs = this.generalConfig['order_tabs'];
    } catch (err) { }
  }

  changePod(type: string) {
    switch (type) {
      case 'pod_signature':
        this.generalConfigObj['proof_of_delivery_picture'] = false;
        this.generalConfigObj['proof_of_delivery_signature'] = true;
        break;
      case 'pod_picture':
        this.generalConfigObj['proof_of_delivery_picture'] = true;
        this.generalConfigObj['proof_of_delivery_signature'] = false;
    }
  }

  changePoP(type: string) {
    switch (type) {
      case 'pop_picture':
        this.generalConfigObj['proof_of_pick_up_picture'] = true;
        break;
      case 'pop_signature':
        this.generalConfigObj['proof_of_pick_up_signature'] = true;
        break;
      case 'pop_scanner':
        this.generalConfigObj['proof_of_pick_up_scanner'] = true;
        break;
    }
  }

  async deleteJSONValue(keyName: any, jsonKey: any): Promise<any> {
    delete this.generalConfigObj[keyName][jsonKey];
    await this.http.update(this.generalConfigObj['id'], {estimated_distance_payout_value: this.generalConfigObj[keyName]}, {},
        'order/order_config');
  }

  addJSONValue(keyName: string, key: string, value: string) {
    if (key.length > 0 && value) {
      let jsonValue:any = {};
      if (this.generalConfigObj[keyName]) {
        this.generalConfigObj[keyName][key] = Number(value);
        jsonValue = this.generalConfigObj[keyName].value;
      } else {
        jsonValue[key] = value;
        this.generalConfigObj[keyName] = jsonValue;
      }
      this.addJsonFormatValue.estimated_distance_payout_value = this.generalConfigObj[keyName];
       this.http.update(this.generalConfigObj['id'], this.addJsonFormatValue , {}, 'order/order_config').then();
    }
  }

  keyPressNumbers(event:any) {
    console.log(event); 
    let charCode: any;
    charCode = (event.which) ? event.which : event.keyCode;
    if ((charCode < 48)) {
      event.preventDefault();
      // return false;
    }
  }

  async saveConfig() {
    try {
      this.updatedValue = this.pagesService.Compare(this.generalConfig , this.generalConfigObj);
      if (this.generalConfig['id']) {
        if (Object.keys(this.updatedValue).length) {
          await this.http.update(this.generalConfig['id'], this.updatedValue, {}, 'order/order_config').
          then(() => {
            this.updatedValue = {};
            this.getGeneralConfig();
            this.toast.showToast('Order config Updated Successfully', 'Success', false);
          });
        }
      } else {
        await this.http.create(this.generalConfig, {}, 'order/order_config');
        this.toast.showToast('Order config Created Successfully', 'Success', false);
      }
    } catch (e) {
      console.error(e);
      this.toast.showToast('Order config not able to update', 'Error', true);
    }
  }
}

