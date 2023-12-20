import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-integration',
  templateUrl: './integration.component.html',
  styleUrls: ['./integration.component.scss']
})
export class IntegrationComponent implements OnInit {

  partners: any;

  constructor(private http: ApiService) { }

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
}
