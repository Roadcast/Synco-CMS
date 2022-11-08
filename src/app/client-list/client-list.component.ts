import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {ApiService} from "../services/api.service";
import {BackgroundDownloaderService} from "../services/background-downloader.service";
// @ts-ignore
import * as FileSaver from 'file-saver';

@Component({
  selector: 'app-client-list',
  templateUrl: './client-list.component.html',
  styleUrls: ['./client-list.component.scss']
})
export class ClientListComponent implements OnInit {

  cities: any;
  selectedRow: any;
  rangeDates: Date[] | undefined;
  data: any[] = [];
  outlets: any[] = [];
  display: boolean = false;
  selectedCity1: any;
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
  constructor(private http: ApiService, private bgDownloader: BackgroundDownloaderService, private cd: ChangeDetectorRef) {
    this.cities = [
      {name: 'SALES'},
      {name: 'SUPPORT'}
    ];
  }

  ngOnInit(): void {
    this.getClients().then();
  }

  async getClients() {
    this.data = (await this.http.query({}, 'partner/outlets')).data;
    this.data.forEach(d => {
      d.brand_created_on = new Date(d.brand_created_on);
      if (d.zomato_integration) {
        d.zomato_integration = new Date(d.zomato_integration);
      }
    })
  }

  async download() {
    if (!this.rangeDates || this.rangeDates?.length < 2) {
      return
    }

    try {
      this.bgDownloader.taskId = (await this.http.query({__retail_shop_id__in: this.outlets.map(o => o.outlet_id),
        __start_date__equal: this.rangeDates[0].toJSON(), __end_date__equal: this.rangeDates[1].toJSON()}, 'partner/outlets/report')).data;
      await this.bgDownloader.start();
    } catch (e) {

    }
  }

  async toggleBrand(status: boolean, brandId: string) {
    try {(await this.http.update(brandId, {is_deactivate: status}, {}, 'partner/status/update'))
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
      }, {}, 'partner/on_boarding/status');
      this.display = false;
      this.agentName = '';
      this.comment = '';
      this.selectedRow = null;
    } catch (e) {

    }
  }

  async getOnBoardingData(row: any) {
    row.logs = (await this.http.get(row.id, {}, 'partner/on_boarding/detail')).data;
  }

  async assignSalePOC(id: string, row: any): Promise<void> {
    (await this.http.update(id, {sale_poc_id: null}, {}, 'partner/on_boarding/brand'))
    row.sale_poc_name = 'Assigned';
    this.cd.detectChanges()
  }
  async assignSupportPOC(id: string, row: any): Promise<void> {
    (await this.http.update(id, {support_poc_id: null}, {}, 'partner/on_boarding/brand'))
    row.support_poc_name = 'Assigned';
    this.cd.detectChanges();
  }

  async onRowEditSave(product: any) {
    if (product.poc_id){
      const id = product.poc_id;
      const type = product.poc_type.name ? product.poc_type.name : product.poc_type;
      (await this.http.update(id, {name: product.poc_name, mobile_number: product.poc_mobile_number, type: type},{},  'partner/on_boarding/update'));
    } else {
      const type = product.poc_type.name ? product.poc_type.name : product.poc_type;
      await this.http.create({
        name: product.poc_name,
        mobile_number: product.poc_mobile_number,
        type: type
      }, {}, 'partner/on_boarding/update')
    }

  }
}
