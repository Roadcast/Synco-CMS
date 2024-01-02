import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {ApiService} from "../../services/api.service";
import {BackgroundDownloaderService} from "../../services/background-downloader.service";
// @ts-ignore
import * as FileSaver from 'file-saver';
import {User} from "../../services/user";
import {StorageService} from "../../services/storage.service";
import {MessageService} from "primeng/api";
import {ActivatedRoute, Router} from "@angular/router";
import {UserService} from "../../services/user.service";
import {HttpErrorResponse} from "@angular/common/http";


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
  openPartnerModel: boolean | undefined;

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
  displayPatchPayment: boolean | undefined;
  paymentData: any;
  paymentValue: any;
  displayProductActivateValue: boolean | undefined;
  activateData: any;
  activateValue: any;
  loadTableCheck: boolean = false;
  toggleOptions = [{label: 'Enabled', value: 'enable'}, {label: 'Disabled', value: 'disable'}]
  toggleCompanyDisable: any;
  partners: any = [];
  newPartnerObject = {
    name: '',
    icon: "",
    description: "",
    web_hook_url: "",
    outlet_web_hook_url: "",
    other_web_hook_url: "",
    keys: {}
  }
  constructor(private http: ApiService, private bgDownloader: BackgroundDownloaderService, private cd: ChangeDetectorRef,
              private storage: StorageService, private messageService: MessageService, public router: Router,
              private activatedRoute: ActivatedRoute, private userService: UserService) {
    this.cities = [
      {name: 'Sales'},
      {name: 'Support'}
    ];
  }

  ngOnInit(): void {
    this.getClients().then();
    this.getPartners().then();
    this.getSaleSupportData().then();
  }

  async getSaleSupportData() {
    try {
      const getsupportValue = (await this.http.query({type: 'Support'}, 'auth/partner/poc'));
      this.supportData = getsupportValue[0].data;
      const getsaleValue = (await this.http.query({type: 'Sales'}, 'auth/partner/poc'));
      this.saleData = getsaleValue[0].data;
    } catch (e) {
      console.error(e);
    }
  }

  async getClients() {
    this.loadTableCheck = true;
    try {
      const outletsData = (await this.http.get('', {}, 'auth/partner/outlets')).data;
      console.log(outletsData);
      
      outletsData.forEach((row: any) => {
        row['is_activate'] = !row['is_deactivate'];
        row.sales_poc_name = row.sales_poc_name === null ? 'Not Assign' : row.sales_poc_name;
        row.sales_poc_number = row.sales_poc_number === null ? '' : row.sales_poc_number;
        row.support_poc_name = row.support_poc_name === null ? 'Not Assign' : row.support_poc_name;
        row.support_poc_number = row.support_poc_number === null ? '' : row.support_poc_number;
      })
      this.data = outletsData;
      this.loadTableCheck = false;
    } catch (e: any) {
      if (e.status && (e.status === 403 || e.status === 401)) {
        this.logout();
      }
    }
  }

  async getPartners() {
    try {
      this.partners = (await this.http.query({}, 'integration/partner')).data;
    } catch (e: any) {
      console.error(e);
    }
  }


  async showBasicDialog(product: any) {
    this.displayBasic = true;
    this.orderCount = [];
    const count = (await this.http.query({__company_wise__report:true, __company_id__equal: product.id},
      'reporting/order_count_report')).data;
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
      this.messageService.add({severity:'error', summary: 'error', detail: ''});
    }
  }

  async toggleBrand(status: boolean) {
    if (status){
      const id = this.activateData.company_id;
      const value = this.activateValue;
      try {(await this.http.update(id, {is_deactivate: value}, {}, 'auth/partner/status/update'))
        this.messageService.add({severity:'success', summary: 'Success', detail: ''});
        this.getClients().then()
        this.cd.detectChanges();
      } catch (e) {
        this.messageService.add({severity:'error', summary: 'error', detail: 'Could not perform the action!'});
      }
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
      this.messageService.add({severity:'success', summary: 'Success', detail: ''});
    } catch (e) {
      this.messageService.add({severity:'error', summary: 'error', detail: 'Could not perform the action!'});
    }
  }

  async getOnBoardingData(row: any) {
    row.logs = (await this.http.get(row.id, {}, 'auth/partner/on_boarding/detail')).data;
  }

  async onRowEditSave(product: any) {
    this.query = {
      support_poc_id: '',
      sales_poc_id: '',
    };
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
    try {
      await this.http.update(product.id, this.query, {}, 'auth/partner/poc').then((row: any) =>{
        this.messageService.add({severity:'success', summary: 'Success', detail: row.data});
      })
    } catch (e) {
      this.messageService.add({severity:'error', summary: 'error', detail: ''});
    }
    this.saleId = '';
    this.supportId = '';
    await this.getClients();
  }

  addPoc() {
    this.openpocmodel = true;
  }

  createPoc() {
    try {
      const type = this.type.name;
      this.http.create({
        name: this.name,
        mobile_number: this.number,
        type: type
      }, {}, 'auth/partner/on_boarding/poc').then( (row: any) =>{
        console.log(row[0].message);
        if (row[1] === 400){
          this.messageService.add({severity:'error', summary: 'Error', detail: row[0].message});
        }else{
          this.messageService.add({severity:'success', summary: 'Success', detail: row[0].status});
        }

      })
    } catch (e) {
      this.messageService.add({severity:'error', summary: 'error', detail: 'Could not create POC!'});
      console.log(e);
    }

    this.name = '';
    this.number = '';
    this.type = '';
  }

  async patchPayment(type: any) {
    if (type === true) {
      const data = this.paymentData;
      const value = this.paymentValue;
      await this.http.update(data.company_id, {is_paid: value}, {}, 'auth/partner/payment/update')
      this.messageService.add({severity:'success', summary: 'Success', detail:''});
      await this.getClients();
    }
  }
  onSaleChange(event: any) {
    this.saleId = event.value;
  }

  onSupportChange(event: any) {
    this.supportId = event.value;
  }

  paymentDialog(data: any, value: boolean) {
    this.paymentData = '';
    this.paymentValue = '';
    this.displayPatchPayment = true;
    this.paymentData = data;
    this.paymentValue = value;
  }

  productActivateDialog(product: any, value: boolean) {
    this.activateData = '';
    this.activateValue = '';
    this.displayProductActivateValue = true;
    this.activateData = product;
    this.activateValue = value;
  }

  async config(product: any) {
    console.log(product);
    localStorage.setItem('companyName', product.company);
    const path = 'pages/config'
    this.router.navigate([path + '/'+ (product.company_id ? product.company_id.toString(10) : 'new')], {
       queryParamsHandling: 'merge',
    }).then();
  }

  logout() {
    this.userService.logout().then();
  }

  addPartner() {
    this.openPartnerModel = true;
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
    } catch (e) {
      this.messageService.add({severity:'error', summary: 'error', detail: 'Could not Create New Partner!'});
      console.error(e);
    }
  }

  addNewIntegration(partnerId: string) {
    this.router.navigateByUrl('new-integration/' + partnerId).then();
  }

  }
