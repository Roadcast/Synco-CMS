import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {ApiService} from "../../services/api.service";

@Component({
  selector: 'app-config-setting',
  templateUrl: './config-setting.component.html',
  styleUrls: ['./config-setting.component.scss']
})
export class ConfigSettingComponent implements OnInit {
  checked: boolean | undefined;
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

  constructor(private router: Router,private http: ApiService, private activateRoute: ActivatedRoute) {
    this.activateRoute.params.subscribe(res => {
      if (res['id'] !== 'new') {
        this.id = res['id'];
      }
    });
  }

  ngOnInit(): void {
    this.getTrigger().then();
    this.getStatus().then();
  }
   async getTrigger() {
     this.outletsData = (await this.http.get('', {}, 'order/trigger_point_ref')).data;
     this.companyTrigger = (await this.http.get(this.id, {}, 'order/partner_trigger_point')).data;

   }
  async getStatus() {
    this.statusData = (await this.http.get('', {}, 'order/status')).data;
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
    this.http.create({
      name: this.addApiData.triggerName,
      delay: this.addApiData.delayData,
      service: this.addApiData.triggerService,
      status_id: this.addApiData.eventId
    }, {}, 'order/partner_trigger_point/' + this.id).then();
    this.getTrigger().then()
  }

  delTrigger(event: any) {
    this.http.delete(event.id, {}, 'order/partner_trigger_point').then();
    this.getTrigger().then()
  }
}
