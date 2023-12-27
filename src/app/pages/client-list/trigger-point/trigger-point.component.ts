import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { DataService } from '../../data.service';
import { MessageService } from 'primeng/api';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-trigger-point',
  templateUrl: './trigger-point.component.html',
  styleUrls: ['./trigger-point.component.scss']
})
export class TriggerPointComponent implements OnInit {

  constructor(private http: DataService,
    private messageService: MessageService,
    private route: ActivatedRoute) { }
  @Output() getLoadingStatus = new EventEmitter<boolean>();
  visibleTriggers:any = [];
  selectedTrigger: any;
  notification: any;
  orderStatus = [];
  outletsData:any;
  selectedOutlet: any;
  selectedOrderStatus: any;
  companyTrigger:any;
  id: any;
  @Input() shareId:any;
  addApiData = {
    triggerName: '',
    triggerService: '',
    eventId: '',
    delayData: 1,
  }
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
    this.route.params.subscribe(params => {
       this.id = params['id'];
    });
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

  triggerData(event: any) {
    console.log(event);
    this.addApiData.triggerName = event.value.name;
    this.addApiData.triggerService = event.value.service;
  }

  eventData(event: any) {
    console.log(event);
    this.addApiData.eventId = event.value.id;
  }

  addTrigger() {
    // const trigger = {
    //   name: this.selectedTrigger,
    //   event: "",
    //   delay: null,
    //   isActive: false,
    //   notification: false,
    // };
    // this.visibleTriggers.push(trigger);
    // this.selectedTrigger = "";
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

  removeRider(event: any) {
    // this.visibleTriggers.splice(index, 1);
    try {
      this.http.delete(event.id, {}, 'order/partner_trigger_point').then();
      this.getTrigger().then();
      this.messageService.add({severity:'success', summary: 'Removed successfully', detail: event.name});

    } catch (e) {
      this.messageService.add({severity:'error', summary: 'error', detail: ''});
    }
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
