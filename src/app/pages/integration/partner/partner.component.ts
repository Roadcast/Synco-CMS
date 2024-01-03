import { Component, OnInit, ViewChild } from '@angular/core';
import { MessageService } from 'primeng/api';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-partner',
  templateUrl: './partner.component.html',
  styleUrls: ['./partner.component.scss']
})
export class PartnerComponent implements OnInit {
  @ViewChild('partnerForm') partnerForm: any;
  partners: any = [];
  fileSelected: boolean = false;
  openPartnerModel: boolean | undefined;
  newPartnerObject = {
    name: '',
    icon: "",
    description: "",
    web_hook_url: "",
    outlet_web_hook_url: "",
    other_web_hook_url: "",
    keys: {}
  }
  constructor(private http: ApiService,
    private messageService: MessageService,
     ) { }

  ngOnInit(): void {
    this.getPartners().then();
  }

  async getPartners() {
    try {
      this.partners = (await this.http.query({}, 'integration/partner')).data;
    } catch (e: any) {
      console.error(e);
    }
  }

  addPartner() {
    this.openPartnerModel = true;
    this.partnerReset();
  }

  async createPartner() {
    try {
      await this.http.create(this.newPartnerObject, {}, 'integration/partner');
      this.newPartnerObject = {
        name: '',
        icon: "",
        description: "",
        web_hook_url: "",
        outlet_web_hook_url: "",
        other_web_hook_url: "",
        keys: {}
      }
      this.getPartners().then();
    } catch (e) {
      this.messageService.add({ severity: 'error', summary: 'error', detail: 'Could not create new partner!' });
      console.error(e);
    }
  }

  onchangeofInput(event: Event, type: string) {
    const new_obj = { ...this.newPartnerObject, [type]: event };
    this.newPartnerObject = new_obj;
  }

  handleImageError(event: any) {
    const tdElement = event.target.parentElement;
    tdElement.innerHTML = 'N/A';
  }

  private partnerReset() {
    this.resetForm();
  }

  resetForm() {
    // Reset form values
    this.newPartnerObject = {
      name: '',
      description: '',
      web_hook_url: '',
      outlet_web_hook_url: '',
      other_web_hook_url: '',
      icon: '',
      keys: {}
    };

    // Reset fileSelected flag
    this.fileSelected = false;

    // Reset the form validation state
    if (this.partnerForm) {
      this.partnerForm.resetForm();
    }
  }
}
