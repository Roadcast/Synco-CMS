import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { YardData } from 'src/app/models/config-yard';
import { DataService } from 'src/app/pages/data.service';
import { ToastService } from 'src/app/pages/toast.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-yard-config-edit',
  templateUrl: './yard-config-edit.component.html',
  styleUrls: ['./yard-config-edit.component.scss']
})
export class YardConfigEditComponent implements OnInit {

  loading: boolean = false;
  id: any;
  yard: YardData = <YardData>{ name: '', flow: '', description: null, icon: null,};
  updateConfigYard: YardData = <YardData>{};
  _company_Id: any;

  constructor(private activateRoute: ActivatedRoute, private http: DataService, private toaster: ToastService, private router: Router, private translate: TranslateService,
    private user: UserService) {
    this.activateRoute.params.subscribe((res) => {
      this.loading = true;
      if (res['id'] !== 'new') {
        this.id = res['id'];
        this.loading = false;
      } else {
        this.id = 'new';
      }
    });
  }

  ngOnInit(): void {
    if (this.id !== 'new') this.getYardConfigById();
    this.loading = false;
  }
  

  translateText(key: string): string {
    let translation: string = '';
    this.translate.get(key).subscribe((res: string) => {
      translation = res;
    });
    return translation;
  }

  //Get Yard Config by ID
  async getYardConfigById() {
    this._company_Id = localStorage.getItem('company_Id');
    try {
      const response = await this.http.get(
        this.id,
        {__company_id__equal:  this._company_Id},
        "yard/trip_type"
      );
      this.yard = Object.assign({}, response);
      console.log(this.yard);
      
      this.loading = false;
    } catch (e) {
      this.loading = false;
    }
  }

  //When user click on the save button
  async saveYardConfig() {
    this._company_Id = localStorage.getItem('company_Id');
    this.loading = true;
    try {
      if (this.id !== 'new') {
        console.log(this.updateConfigYard);
        if (Object.keys(this.updateConfigYard).length !== 0) {
          this.updateYardConfig();
        } else {
          this.toaster.showToast(this.translateText('Nothing to save or update'), 'Error', true);
          this.loading = false;
        }
      } else {
        this.createYardConfig();
      }
    } catch (e) {
      this.toaster.showToast(this.translateText("Error saving yard config"), "Error", true);
      this.loading = false;
    }
  }

  // create the new yardConfig
  createYardConfig() {
    this._company_Id = localStorage.getItem('company_Id');
    this.yard = {
      ...this.yard,
      company_id: this._company_Id,
    };
    try {
      this.http.create(this.yard, { __company_id__equal: this._company_Id }, 'yard/trip_type')
        .then((yarConfig) => {
          this.id = yarConfig.data[0].id;
          this.router.navigate(['/pages/config/add/' + this.id]);
          this.loading = false;
          this.toaster.showToast('Yard Added successfully', 'Success', false);
          this.updateConfigYard = <YardData>{};
        });
    } catch (error:any) {
      this.toaster.showToast("Error Updating", "Error", true, error);
    }
  }

  // update the new yardConfig
  updateYardConfig() {
    const company_Id = localStorage.getItem('company_Id');
    const res = this.http
      .update(this.id, this.updateConfigYard, {__company_id__equal: this._company_Id}, "yard/trip_type")
      .then(() => {
        this.loading = false;
        this.updateConfigYard = <YardData>{};
        this.toaster.showToast(
          "Yard Config Updated successfully",
          "Success",
          false
        );
      });
  }

  // When ever any values changes only those values will be sending as a request in json
  onchangeofInput(event: Event, type: string) {
    const new_obj = { ...this.updateConfigYard, [type]: event };
    this.updateConfigYard = new_obj;
  }

  goBack(){
    const company_Id = localStorage.getItem('company_Id');
    this.router.navigate(['/pages/config/' + company_Id ]);
  }
}
