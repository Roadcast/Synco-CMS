import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { DataService } from 'src/app/pages/data.service';
import { ToastService } from 'src/app/pages/toast.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-upload-format',
  templateUrl: './upload-format.component.html',
  styleUrls: ['./upload-format.component.scss']
})
export class UploadFormatComponent implements OnInit {
  @Output() close: EventEmitter<any> = new EventEmitter<any>();
  @Input()
  formatConfig: any;
  loading!: boolean;
  auto_route_default_parameters: any;
  routing = {
    riders: null,
    avg_speed: null,
    vehicle_capacity: null,
    max_time_minute: null,
    max_travel_km: undefined,
  };
  constructor(private http: DataService, private userService: UserService, private toast: ToastService) { }

  ngOnInit(): void {
    this.getDefaultAutoRouteParameters().then();
  }

  async getDefaultAutoRouteParameters() {
    this.loading = true;
    this.http.query({
      __only: ['id', 'key', 'value'],
      __key__equal: 'auto_route_default_parameters',
    }, 'auth/company_config').then(res => {
      if (res.data.length > 0) {
        this.auto_route_default_parameters = res.data[0].id;
        this.routing.riders = res.data[0].value.riders ? res.data[0].value.riders : null;
        this.routing.avg_speed = res.data[0].value.avg_speed ? res.data[0].value.avg_speed : null;
        this.routing.vehicle_capacity = res.data[0].value.vehicle_capacity ? res.data[0].value.vehicle_capacity : null;
        this.routing.max_time_minute = res.data[0].value.max_time_minute ? res.data[0].value.max_time_minute : null;
        this.routing.max_travel_km = res.data[0].value.max_travel_km ? res.data[0].value.max_travel_km : null;
      }
      this.loading = false;
    }).catch(() => {
      this.loading = false;
    });
  }


  async saveUploadFormatConfig() {
    this.loading = true;
    if (this.formatConfig.id) {
      this.http.update(this.formatConfig.id, this.formatConfig, {},
        'auth/company_config').then(() => {
          this.toast.showToast('Successfully Updated', 'Success', false);
          this.loading = false;
          this.close.emit(this.formatConfig);
        }).catch((e) => {
          this.toast.showToast('Error Saving Config', 'Error', true, e);
          this.loading = false;
        });
    } else {
      delete this.formatConfig.id;
      this.http.create(this.formatConfig, {},
        'auth/company_config').then(() => {
          this.toast.showToast('Successfully Updated', 'Success', false);
          this.loading = false;
          this.close.emit(this.formatConfig);
        }).catch((e) => {
          this.toast.showToast('Error Saving Config', 'Error', true, e);
          this.loading = false;
        });
    }
  }

  async saveDefaultParametersConfig() {
    this.loading = true;
    if (this.auto_route_default_parameters) {
      this.http.update(this.auto_route_default_parameters, {
        value: this.routing,
      }, {},
        'auth/company_config').then(() => {
          this.toast.showToast('Successfully Updated', 'Success', false);
          this.loading = false;
          this.close.emit(this.formatConfig);
        }).catch((e) => {
          this.toast.showToast('Error Saving  Parameters', 'Error', true, e);
          this.loading = false;
        });
    } else {
      this.http.create({
        value: this.routing,
        key: 'auto_route_default_parameters',
      }, {},
        'auth/company_config').then(() => {
          this.toast.showToast('Successfully Updated', 'Success', false);
          this.loading = false;
          this.close.emit(this.formatConfig);
        }).catch((e) => {
          this.toast.showToast('Error Saving Config', 'Error', true, e);
          this.loading = false;
        });
    }
  }
}
