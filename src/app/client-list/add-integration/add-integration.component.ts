import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {ApiService} from "../../services/api.service";
import {MenuItem, MessageService} from "primeng/api";

@Component({
  selector: 'app-add-integration',
  templateUrl: './add-integration.component.html',
  styleUrls: ['./add-integration.component.scss']
})
export class AddIntegrationComponent implements OnInit {
  private partnerId: any;
  integrationSteps: MenuItem[] = [];
  activeIndex: number = 0;
  outlets: any = [];
  selectedOutlets: any = [];
  brandApp: any;
  brandId: any;
  secretKey: any = '';
  accessKey: any = '';

  constructor(private router: Router,private http: ApiService, private activateRoute: ActivatedRoute,
              public messageService: MessageService) {
    this.activateRoute.params.subscribe(res => {
      if (res['id'] !== 'new') {
        this.partnerId = res['id'];
      }
    });
  }

  ngOnInit() {
    this.integrationSteps = [
      {
        label: 'Select a brand',
      },
      {
        label: 'Generate Brand Secret Key',
      },
      {
        label: 'Generate Access Secret Key',
      },
      {
        label: 'Select Outlets',
      }
    ];
  }

  nextStep(event: number) {
    this.activeIndex = event;
  }

  previousStep(event: number) {
    this.activeIndex = event;
  }

  setBrand(event: any) {
    this.brandId = event.id;
    this.getOutlets().then();
  }

  clear() {
    this.brandId = null;
  }

  async getOutlets() {
    this.outlets = (await this.http.query({__only: ['id', 'name'], __brand_id__equal: this.brandId},
      'auth/outlet')).data;
  }

  async enableIntegration() {
    if (!this.brandId) {
      this.messageService.add({severity:'error', summary: 'error', detail: 'Please select Brand!!'});
      return;
    }
    await this.getBrands();
    if (this.brandApp && this.brandApp.length > 0) {
      this.brandApp = this.brandApp[0];
      this.nextStep(1);
    } else {
      try {
        this.brandApp = (await this.http.create({partner_id: this.partnerId, brand_id: this.brandId},
          {__only: ['id', 'brand_key', 'outlet_ids']}, 'integration/brand_integration'))[0];
        if (this.brandApp) {
          this.brandApp.outlet_ids = [];
        }
        this.nextStep(1);
      } catch (e) {
        console.error(e);
        this.messageService.add({severity:'error', summary: 'error', detail: ''});
      }
    }
  }

  async getBrands() {
    try {
      const response = (await this.http.query({
          __only: ['id', 'brand_key', 'outlet_ids'],
          __brand_id__equal: this.brandId,
          __partner_id__equal: this.partnerId,
        },
        'integration/brand_integration'));
      if (response) {
        this.brandApp = response.data;
      }
      if (this.brandApp.outlet_ids && this.brandApp.outlet_ids.length > 0)
        this.selectedOutlets = this.brandApp.outlet_ids;
    } catch (e) {
      this.messageService.add({severity:'error', summary: 'error', detail: 'Could not get brands!'});
      console.error('error', e);
    }
  }


  async generateKey() {
    try {
      this.brandApp.brand_key = (await this.http.update(this.brandApp.id, {}, {
          generate_key: true,
          __only: ['brand_key'],
        },
        'integration/brand_integration')).data.brand_key;
      this.messageService.add({severity:'success', summary: 'Success', detail: 'Key generated!'});
    } catch (e) {
      console.error(e);
      this.messageService.add({severity:'error', summary: 'error', detail: 'Could not generate key'});
    }
  }

  async generateAccessKey() {
    try {
        const response = (await this.http.create({}, {},
          'integration/generate_access_secrete_key/' + this.partnerId)).data;
        this.accessKey = response['access_key'];
        this.secretKey = response['secret_key'];
        this.messageService.add({severity:'success', summary: 'Success', detail: 'Access key generated!'});
    } catch (e) {
      this.messageService.add({severity:'error', summary: 'error', detail: 'Could not generate access key'});
      console.error(e);
    }
  }

  async saveIntegration() {
    try {
      await this.http.update(this.brandApp.id, {outlet_ids: this.selectedOutlets},
        {},
        'integration/brand_integration');
      this.router.navigateByUrl('').then();
      this.messageService.add({severity:'success', summary: 'Success', detail: 'Integration Saved!'});
    } catch (e) {
      console.error(e);
      this.messageService.add({severity:'error', summary: 'error', detail: 'Could not generate access key'});
    }
  }

  async goToHome() {
    this.router.navigateByUrl('').then();
  }

}
