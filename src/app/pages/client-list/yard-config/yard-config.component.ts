import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { DataService } from '../../data.service';
import { ToastService } from '../../toast.service';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-yard-config',
  templateUrl: './yard-config.component.html',
  styleUrls: ['./yard-config.component.scss']
})
export class YardConfigComponent implements OnInit {

  @Output() getLoadingStatus = new EventEmitter<boolean>();
  visibleYardConfig = [];
  @Input() shareId: any;

  constructor(
    private http: DataService,
    private toaster: ToastService,
    private router: Router,
    private translate: TranslateService,
    private route: ActivatedRoute,
    private user: UserService
  ) {}

  ngOnInit(): void {
    this.getLoadingStatus.emit(true);
    this.appendAQueryParam();
    this.fetchYardConfig()
      .then()
      .catch((e:any) => {});
      // this.route.paramMap.subscribe(params => {
      //   const id = params.get('id');
      //   console.log('ID from URL:', id);
      // });
  }

  appendAQueryParam() {
    const urlTree = this.router.createUrlTree([], {
      preserveFragment: false,
    });

    this.router.navigateByUrl(urlTree);
  }

  translateText(key: string): string {
    let translation: string ='';
    this.translate.get(key).subscribe((res: string) => {
      translation = res;
    });
    return translation;
  }

  //Get Yard Config
  async fetchYardConfig() {
    try {
      this.visibleYardConfig = (
        await this.http.query({ __company_id__equal: this.shareId }, "yard/trip_type")
      ).data;
      this.getLoadingStatus.emit(false);
    } catch (e:any) {
      this.visibleYardConfig = [];
      this.getLoadingStatus.emit(false);
      if (
        e?.error?.error === true &&
        e?.error?.message === "No Resource Found"
      ) {
        this.toaster.showToast("No Resource found", "Error", true, e);
      }
    }
  }

  //Go tO Add and Edit yard config page
  goToAddEdit(yard?:any) {
    this.router.navigate([
      "pages/config/add/" +
        (yard?.id ? yard.id.toString(10) : "new"),
    ]);
    this.user.company_Id.next(this.shareId);
  }

  //Toggle yard active state True Or False
  toggleYard(event:any, yard:any) {
    this.getLoadingStatus.emit(true);
    try {
      this.http
        .update(
          yard.id,
          {
            active: event,
          },
          {},
          "yard/trip_type",
          // "yard"
        )
        .then((data:any) => {
          this.getLoadingStatus.emit(false);
          let yardConfig = this.visibleYardConfig.find(
            (yardConfig:any) => yardConfig.id == yard.id
          ) as any;
          if (yardConfig) {
            yardConfig.active = event;
          }
          this.toaster.showToast(
            "Yard Config Updated successfully",
            "Success",
            false
          );
        });
    } catch (e:any) {
      this.getLoadingStatus.emit(false);
      this.toaster.showToast("Error Updating", "Error", true, e);
    }
  }

  //Delete yard Config
  async deleteYard(yard:any) {
    this.getLoadingStatus.emit(true);
    try {
      this.http.delete(yard.id, {__company_id__equal: this.shareId}, "yard/trip_type");
      this.visibleYardConfig = this.visibleYardConfig.filter(
        (yardConfig:any) => yardConfig.id != yard.id
      );
      this.toaster.showToast("Config Deleted successfully", "Success", false);
      this.getLoadingStatus.emit(false);
    } catch (e:any) {
      this.toaster.showToast(
        "Error: Cannot delete this config!",
        "Error",
        true,
        e
      );
      this.getLoadingStatus.emit(false);
    }
  }
}
