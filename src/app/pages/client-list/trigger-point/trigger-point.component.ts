import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { DataService } from '../../data.service';

@Component({
  selector: 'app-trigger-point',
  templateUrl: './trigger-point.component.html',
  styleUrls: ['./trigger-point.component.scss']
})
export class TriggerPointComponent implements OnInit {

  constructor(private http: DataService,) { }
  @Output() getLoadingStatus = new EventEmitter<boolean>();  
  visibleTriggers:any = [];
  selectedTrigger: any;
  notification: any;
  orderStatus = [];
  outletsData:any;
  companyTrigger:any;
  @Input() shareId:any;
  triggers = [
    "allot_next_order_mark_free",
    "update_rider_eta",
    "get_estimated_time",
    "order_accept",
    "remove_order",
    "calculate_order_distance",
    "generate_order_otp",
    "order_allocation_algorithm",
    "save_order_elastic",
    "multi_order_accept",
    "cancel_order",
    "mark_rider_on_route",
  ];
  ngOnInit(): void {
    this.getLoadingStatus.emit(true)
    // this.fetchTriggers().then();
    this.fetchOrderStatus().then();
    this.getTrigger().then();
  }

  // async fetchTriggers() {
  //   try {
  //     this.visibleTriggers = (
  //       await this.http.query({}, "order/trigger_point_ref")
  //     ).data;
  //     this.getLoadingStatus.emit(false)
  //   } catch (e) {
  //     this.getLoadingStatus.emit(false)
  //   }
  // }

  addTrigger() {
    const trigger = {
      name: this.selectedTrigger,
      event: "",
      delay: null,
      isActive: false,
      notification: false,
    };
    this.visibleTriggers.push(trigger);
    this.selectedTrigger = "";
  }

  removeRider(index: number) {
    this.visibleTriggers.splice(index, 1);
  }

  showNotifications(check: boolean) {
    this.notification = check;
  }

  async fetchOrderStatus() {
    this.orderStatus = (await this.http.query({}, "order/status")).data;
  }

  keyPressNumbers(event:any) {
    let charCode: any;
    charCode = event.which ? event.which : event.keyCode;
    if (charCode < 48) {
      event.preventDefault();
      // return false;
    }
  }

  async getTrigger() {
    try {
      this.outletsData = (await this.http.get('', {}, 'order/trigger_point_ref')).data;
      this.visibleTriggers = (await this.http.get(this.shareId, {}, 'order/partner_trigger_point')).data;
      this.getLoadingStatus.emit(false)
    } catch (e) {
      console.error(e);
      this.getLoadingStatus.emit(false)
    }
  }
}
