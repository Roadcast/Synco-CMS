import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { TranslateService } from "@ngx-translate/core";
import { DataService } from 'src/app/pages/data.service';
import { ToastService } from 'src/app/pages/toast.service';

@Component({
  selector: 'app-reasons',
  templateUrl: './reasons.component.html',
  styleUrls: ['./reasons.component.scss']
})
export class ReasonsComponent  {
  @Input() shareId:any;

  @Output() getLoadingStatus = new EventEmitter<boolean>(); 
  setActiveTab='Rider Rejection Reasons';
  rejectionReasonsTableSettings = {
    add: {
      addButtonContent: '<img src="/assets/images/plus-thin.svg" alt="" width="12">',
      createButtonContent:
        '<img src="/assets/images/icon-check.svg" alt="" width="12">',
      cancelButtonContent:
        '<img src="/assets/images/icon-cancel.svg" alt="" width="11">',
      confirmCreate: true,
    },
    edit: {
      editButtonContent:
        '<img src="/assets/images/icon-edit.svg" alt="" width="16">',
      saveButtonContent:
        '<img src="/assets/images/icon-check.svg" alt="" width="12">',
      cancelButtonContent:
        '<img src="/assets/images/icon-cancel.svg" alt="" width="11">',
      confirmSave: true,
    },
    delete: {
      deleteButtonContent:
        '<img src="/assets/images/icon-remove.svg" alt="" width="16">',
      confirmDelete: true,
    },
    columns: {
      name: {
        title: this.translateText("Reason"),
        type: "text",
        filter: false,
      },
      reason_code: {
        title: this.translateText("Reason code"),
        type: "text",
        filter: false,
        editable: false,
      },
    },
  };
  safetyRejectionReasonsTableSettings = {
    add: {
      addButtonContent: '<img src="/assets/images/plus-thin.svg" alt="" width="12">',
      createButtonContent:
        '<img src="/assets/images/icon-check.svg" alt="" width="12">',
      cancelButtonContent:
        '<img src="/assets/images/icon-cancel.svg" alt="" width="11">',
      confirmCreate: true,
    },
    edit: {
      editButtonContent:
        '<img src="/assets/images/icon-edit.svg" alt="" width="16">',
      saveButtonContent:
        '<img src="/assets/images/icon-check.svg" alt="" width="12">',
      cancelButtonContent:
        '<img src="/assets/images/icon-cancel.svg" alt="" width="11">',
      confirmSave: true,
    },
    delete: {
      deleteButtonContent:
        '<img src="/assets/images/icon-remove.svg" alt="" width="16">',
      confirmDelete: true,
    },
    columns: {
      name: {
        title: this.translateText("Reason"),
        type: "text",
        filter: false,
      },
      reason_code: {
        title: this.translateText("Reason code (100, 101, 103)"),
        type: "text",
        filter: false,
        editable: false,
      },
    },
  };
  reasonCode: null | undefined;
  riderRejectionReasons = new LocalDataSource([]);
  paymentRejectionReasons = new LocalDataSource([]);
  orderRejectionReasons = new LocalDataSource([]);
  orderItemReasons = new LocalDataSource([]);
  riderDisableReasons = new LocalDataSource([]);
  safetyItemReasons = new LocalDataSource([]);
  constructor( private translate: TranslateService,private http: DataService,
    private toaster: ToastService,) { }
  
  ngOnInit(): void {
    this.getLoadingStatus.emit(true)
  }

  translateText(key: string): string {
    let translation: string = "";
    this.translate.get(key).subscribe((res: string) => {
      translation = res;
    });
    return translation;
  }

  //createConfirm
  async onRejectReasonCreate(event:any, type:any) {
    if (!event.newData.reason_code) {
      this.reasonCode = null;
    } else {
      this.reasonCode = event.newData.reason_code;
    }
    if (event.newData.name.length) {
      if (window.confirm("Are you sure you want to Save?")) {
        this.getLoadingStatus.emit(true);
        this.http
          .create(
            {
              type: type,
              name: event.newData.name,
              reason_code: this.reasonCode,
              description: event.newData.name,
              company_id: this.shareId
            },
            {__company_id__equal: this.shareId},
            "order/reason",
          )
          .then(() => { 
            event.confirm.resolve();
            this.toaster.showToast(
              "Reason Added successfully",
              "Success",
              false
            );
            if(this.setActiveTab==='Rider Rejection Reasons'){
              this.fetchRiderRejectReasons().then();
            }else if(this.setActiveTab==='Payment Rejection Reasons'){
              this.fetchPaymentRejectionReasons().then();
            }else if(this.setActiveTab==='Order Cancel Reasons'){
              this.fetchOrderRejectReasons().then();
            }else if(this.setActiveTab==='Order Item Reasons'){
              this.fetchOrderItemReasons().then();
            }else if(this.setActiveTab==='Rider Disable Reasons'){
              this.fetchRiderDisableReasons().then();
            }else if(this.setActiveTab==='Safety Instructions Reasons'){
              this.fetchSafetyItemReasons().then();
            }
          })
          .catch((e) => {
            event.confirm.reject();
            this.getLoadingStatus.emit(false);
            this.toaster.showToast(
              "Error Saving Reason " + e.toString(),
              "Error",
              true,
              e
            );
          });
      } else {
        event.confirm.reject();
        this.getLoadingStatus.emit(false);
      }
    } else {
      this.toaster.showToast("Please add details in reason", "Error", true);
      this.getLoadingStatus.emit(false);
      return;
    }
  }

  //On Edit any table 
  async onEdit(event:any) {
    if (window.confirm("Are you sure you want to Update?")) {
      this.http
        .update(
          event.data.id,
          {
            name: event.newData.name,
            reason_code: event.newData.reason_code,
            description: event.newData.name,
          },
          {__company_id__equal: this.shareId},
          "order/reason",
        )
        .then(() => {
          event.confirm.resolve();
          this.getLoadingStatus.emit(true);
          if(this.setActiveTab==='Rider Rejection Reasons'){
            this.toaster.showToast(
              "Rider Rejection Reasons Updated successfully",
              "Success",
              false
            );
            this.fetchRiderRejectReasons().then();
          }else if(this.setActiveTab==='Payment Rejection Reasons'){
            this.toaster.showToast(
              "Payment Rejection Reasons Updated successfully",
              "Success",
              false
            );
            this.fetchPaymentRejectionReasons().then();
          }else if(this.setActiveTab==='Order Cancel Reasons'){
            this.toaster.showToast(
              "Order Cancel Reasons Updated successfully",
              "Success",
              false
            );
            this.fetchOrderRejectReasons().then();
          }else if(this.setActiveTab==='Order Item Reasons'){
            this.toaster.showToast(
              "Order Item Reasons Updated successfully",
              "Success",
              false
            );
            this.fetchOrderItemReasons().then();
          }else if(this.setActiveTab==='Rider Disable Reasons'){
            this.toaster.showToast(
              "Rider Disable Updated successfully",
              "Success",
              false
            );
            this.fetchRiderDisableReasons().then();
          }else if(this.setActiveTab==='Safety Instructions Reasons'){
            this.toaster.showToast(
              "Safety Instructions Updated successfully",
              "Success",
              false
            );
            this.fetchSafetyItemReasons().then();
          }
        })
        .catch((e) => {
          event.confirm.reject();
          this.getLoadingStatus.emit(false);
          this.toaster.showToast(
            "Error Updating " + e.toString(),
            "Error",
            true,
            e
          );
        });
    } else {
      event.confirm.reject();
    }
  }

  //On Delete any table 
  async onDelete(event:any) {
    console.log(event);
    if (window.confirm("Are you sure you want to delete?")) {
      this.getLoadingStatus.emit(true);
      this.http
        .delete(event.data.id, {}, "order/reason")
        .then(() => {
          event.confirm.resolve();
          if(this.setActiveTab==='Rider Rejection Reasons'){
            this.toaster.showToast(
              "Rider Rejection Reasons Deleted successfully",
              "Success",
              false
            );
            this.fetchRiderRejectReasons().then();
          }else if(this.setActiveTab==='Payment Rejection Reasons'){
            this.toaster.showToast(
              "Payment Rejection Reasons Deleted successfully",
              "Success",
              false
            );
            this.fetchPaymentRejectionReasons().then();
          }else if(this.setActiveTab==='Order Cancel Reasons'){
            this.toaster.showToast(
              "Order Cancel Reasons Deleted successfully",
              "Success",
              false
            );
            this.fetchOrderRejectReasons().then();
          }else if(this.setActiveTab==='Order Item Reasons'){
            this.toaster.showToast(
              "Order Item Reasons Deleted successfully",
              "Success",
              false
            );
            this.fetchOrderItemReasons().then();
          }else if(this.setActiveTab==='Rider Disable Reasons'){
            this.toaster.showToast(
              "Rider Disable Deleted successfully",
              "Success",
              false
            );
            this.fetchRiderDisableReasons().then();
          }else if(this.setActiveTab==='Safety Instructions Reasons'){
            this.toaster.showToast(
              "Safety Instructions Deleted successfully",
              "Success",
              false
            );
            this.fetchSafetyItemReasons().then();
          }
        })
        .catch((e) => {
          event.confirm.reject();
          this.getLoadingStatus.emit(false);
          this.toaster.showToast(
            "Reason already linked to an order",
            "Error: Cannot delete this reason!",
            true,
            e
          );
        });
    } else {
      event.confirm.reject();
      this.getLoadingStatus.emit(false);
    }
  }

  //OnChange Of tabSet
  onChangeOfTabset(event:any){
    this.getLoadingStatus.emit(true)
    this.setActiveTab=event.tabTitle;
    if(this.setActiveTab==='Rider Rejection Reasons'){
      this.fetchRiderRejectReasons().then();
    }else if(this.setActiveTab==='Payment Rejection Reasons'){
      this.fetchPaymentRejectionReasons().then();
    }else if(this.setActiveTab==='Order Cancel Reasons'){
      this.fetchOrderRejectReasons().then();
    }else if(this.setActiveTab==='Order Item Reasons'){
      this.fetchOrderItemReasons().then();
    }else if(this.setActiveTab==='Rider Disable Reasons'){
      this.fetchRiderDisableReasons().then();
    }else if(this.setActiveTab==='Safety Instructions Reasons'){
      this.fetchSafetyItemReasons().then();
    }
  }

  //Rider Rejection Reasons
  async fetchRiderRejectReasons() {
    try {
    this.riderRejectionReasons = new LocalDataSource(
      (
        await this.http.query(
          {
            __type__equal: "T",
            __company_id__equal: this.shareId
          },
          "order/reason",
        )
      ).data
    );
    this.getLoadingStatus.emit(false);
  } catch (e:any) {this.getLoadingStatus.emit(false);
    if(e?.error?.error===true && e?.error?.message==='No Resource Found'){
      this.toaster.showToast("No Resource found", "Error", true, e);
    }
  }
  }

  //Payment Rejection Reasons
  async fetchPaymentRejectionReasons() {
    try {
    this.paymentRejectionReasons = new LocalDataSource(
      (
        await this.http.query(
          {
            __type__equal: "P",
            __company_id__equal: this.shareId
          },
          "order/reason",
        )
      ).data
    );
    this.getLoadingStatus.emit(false);
  } catch (e:any) {this.getLoadingStatus.emit(false);
    if(e?.error?.error===true && e?.error?.message==='No Resource Found'){
      this.toaster.showToast("No Resource found", "Error", true, e);
    }
  }
  }

  //Order Cancel Reasons
  async fetchOrderRejectReasons() {
    try {
    this.orderRejectionReasons = new LocalDataSource(
      (
        await this.http.query(
          {
            __type__equal: "O",
            __company_id__equal: this.shareId
          },
          "order/reason",
        )
      ).data
    );
    this.getLoadingStatus.emit(false);
  } catch (e:any) {this.getLoadingStatus.emit(false);
    if(e?.error?.error===true && e?.error?.message==='No Resource Found'){
      this.toaster.showToast("No Resource found", "Error", true, e);
    }
  }
  }

  //Order Item Reasons
  async fetchOrderItemReasons() {
    try {
    this.orderItemReasons = new LocalDataSource(
      (
        await this.http.query(
          {
            __type__equal: "I",
            __company_id__equal: this.shareId
          },
          "order/reason",
        )
      ).data
    );
    this.getLoadingStatus.emit(false);
  } catch (e:any) {this.getLoadingStatus.emit(false);
    if(e?.error?.error===true && e?.error?.message==='No Resource Found'){
      this.toaster.showToast("No Resource found", "Error", true, e);
    }
  }
  }

  //Rider Disable Reasons
  async fetchRiderDisableReasons() {
    try {
    this.riderDisableReasons = new LocalDataSource(
      (
        await this.http.query(
          {
            __type__equal: "R",
            __company_id__equal: this.shareId
          },
          "order/reason",
        )
      ).data
    );
    this.getLoadingStatus.emit(false);
  } catch (e:any) {this.getLoadingStatus.emit(false);
    if(e?.error?.error===true && e?.error?.message==='No Resource Found'){
      this.toaster.showToast("No Resource found", "Error", true, e);
    }
  }
  }

  //Safety Instructions Reasons
  async fetchSafetyItemReasons() {
    try {
    this.safetyItemReasons = new LocalDataSource(
      (
        await this.http.query(
          {
            __type__equal: "Z",
            __company_id__equal: this.shareId
          },
          "order/reason",
        )
      ).data
    );
    this.getLoadingStatus.emit(false);
  } catch (e:any) {this.getLoadingStatus.emit(false);
    if(e?.error?.error===true && e?.error?.message==='No Resource Found'){
      this.toaster.showToast("No Resource found", "Error", true, e);
    }
  }
  }
}

