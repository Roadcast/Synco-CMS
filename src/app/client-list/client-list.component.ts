import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {ApiService} from "../services/api.service";
import {BackgroundDownloaderService} from "../services/background-downloader.service";
// @ts-ignore
import * as FileSaver from 'file-saver';
import {User} from "../services/user";
import {StorageService} from "../services/storage.service";
@Component({
  selector: 'app-client-list',
  templateUrl: './client-list.component.html',
  styleUrls: ['./client-list.component.scss']
})
export class ClientListComponent implements OnInit {
  user: User = {} as User;

  cities: any;
  selectedRow: any;
  rangeDates: Date[] | undefined;
  data: any[] = [];
  outlets: any[] = [];
  display: boolean = false;
  selectedCity1: any;
  displayBasic: boolean | undefined;
  openpocmodel: boolean | undefined;

  exportColumns = [
    {title: 'Boarding Date', dataKey: 'brand_created_on'},
    {title: 'Company', dataKey: 'brand_name'},
    {title: 'Status', dataKey: 'is_deactivate'},
    {title: 'Payment', dataKey: 'is_paid'},
    {title: 'Outlet', dataKey: 'outlet_name'},
    {title: 'Location', dataKey: 'outlet_identity'},
    {title: 'Orders', dataKey: 'current_month_orders'},
    {title: 'Total Orders', dataKey: 'total_orders'},
    {title: 'Zomato', dataKey: 'is_integrated'},
  ]

  actions = [{name: 'Call 1'}, {name: 'Call 2'}, {name: 'Call 3'}, {name: 'Training'}, {name: 'Integration'}];
  action: string | null = 'Call 1';
  statuses = [{name: 'Completed'}, {name: 'Rescheduled'}, {name: 'No Response'}, {name: 'Not Interested'}]
  status: string | null = 'Completed';
  agentName: string = '';
  comment: string = ''
  orderCount: any = [];
  supportData: any;
  saleData: any;
  created: any;
  name: any;
  number: any;
  type: any;
  query: any;
  saleId: any;
  supportId: any;
  constructor(private http: ApiService, private bgDownloader: BackgroundDownloaderService, private cd: ChangeDetectorRef, private storage: StorageService,) {
    this.cities = [
      {name: 'SALES'},
      {name: 'SUPPORT'}
    ];
  }

  ngOnInit(): void {
    this.getClients().then();
    this.getSaleSupportData().then();
  }
  async getSaleSupportData() {
    const getsupportValue = (await this.http.query({type: 'SUPPORT'}, 'auth/partner/poc'));
    this.supportData = getsupportValue[0].data;
    const getsaleValue = (await this.http.query({type: 'SALES'}, 'auth/partner/poc'));
    this.saleData = getsaleValue[0].data;
  }

  async getClients() {
    const outletsData = (await this.http.get('', {}, 'auth/partner/outlets')).data;
    outletsData.forEach( (row: any) =>{
    row.sales_poc_name = row.sales_poc_name === null ? 'Not Assign' : row.sales_poc_name;
    row.sales_poc_number = row.sales_poc_number === null ? '' : row.sales_poc_number;
    row.support_poc_name = row.support_poc_name === null ? 'Not Assign' : row.support_poc_name;
    row.support_poc_number = row.support_poc_number === null ? '' : row.support_poc_number;
    })
    this.data = outletsData;
  }


  async showBasicDialog(product: any) {
    this.displayBasic = true;
    this.orderCount = [];
    const count = (await this.http.query({__company_wise__report:true, __company_id__equal: product.id}, 'reporting/order_count_report')).data;
    this.orderCount.push(count);

  }

  async download() {
    if (!this.rangeDates || this.rangeDates?.length < 2) {
      return
    }

    try {
      this.bgDownloader.taskId = (await this.http.query({__retail_shop_id__in: this.outlets.map(o => o.outlet_id),
        __start_date__equal: this.rangeDates[0].toJSON(), __end_date__equal: this.rangeDates[1].toJSON()}, 'auth/partner/outlets/report')).data;
      await this.bgDownloader.start();
    } catch (e) {

    }
  }

  async toggleBrand(status: boolean, brandId: string) {
    try {(await this.http.update(brandId, {is_deactivate: status}, {}, 'auth/partner/status/update'))
      this.data.forEach(d => {
        if (d.brand_id === brandId) {
          d.is_deactivate = status;
        }
      })
      this.cd.detectChanges();
    } catch (e) {
      this.data.forEach(d => {
        if (d.brand_id === brandId) {
          d.is_deactivate = !status;
        }
      })
    }
  }

  exportExcel() {
    import('xlsx').then(xlsx => {
      const worksheet = xlsx.utils.json_to_sheet(this.data);
      const workbook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
      const excelBuffer: any = xlsx.write(workbook, { bookType: 'xlsx', type: 'array' });
      this.saveAsExcelFile(excelBuffer, 'products');
    });
  }

  saveAsExcelFile(buffer: any, fileName: string): void {
    let EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    let EXCEL_EXTENSION = '.xlsx';
    const data: Blob = new Blob([buffer], {
      type: EXCEL_TYPE
    });
    FileSaver.saveAs(data, fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION);
  }

  showDialog(row: any) {
    this.display = true;
    this.selectedRow = row;
  }

  async submit() {
    try {
      await this.http.create({
        status: this.status,
        action: this.action,
        comment: this.comment,
        brand_id: this.selectedRow.id,
        company_id: this.selectedRow.id,
      }, {}, 'auth/partner/on_boarding/status');
      this.display = false;
      this.agentName = '';
      this.comment = '';
      this.selectedRow = null;
    } catch (e) {

    }
  }

  async getOnBoardingData(row: any) {
    row.logs = (await this.http.get(row.id, {}, 'auth/partner/on_boarding/detail')).data;
  }

  async onRowEditSave(product: any) {
    const sale_id = this.saleId ? this.saleId.poc_id : '';
    const support_id = this.supportId ? this.supportId.poc_id : '' ;
    if (support_id && sale_id) {
      this.query = {
        support_poc_id: support_id,
        sales_poc_id: sale_id,
      }
    } else if (support_id){
      this.query = {
        support_poc_id: support_id,
      }
    } else if(sale_id){
      this.query = {
        sales_poc_id: sale_id,
      }
    } else {
      this.query = {
        support_poc_id: '',
        sales_poc_id: '',
      }
    }
     await this.http.update(product.id, this.query, {}, 'auth/partner/poc')
  }

  addPoc() {
    this.openpocmodel = true
  }

  createPoc() {
    const type = this.type.name;
    this.http.create({
      name: this.name,
      mobile_number: this.number,
      type: type
    }, {}, 'auth/partner/on_boarding/update').then()
  }

  async patchPayment(data: any, value: boolean) {
    await this.http.update(data.id, {is_paid: value}, {}, 'auth/partner/payment/update')
    await this.getClients();
  }
  //
  // async logOut() {
  //   await this.query({}, 'auth/logout/');
  //   this.user = {} as User;
  //   return await this.storage.clearAll();
  // }
}
