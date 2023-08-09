import {
    AfterViewInit,
    ChangeDetectorRef,
    Component,
    EventEmitter,
    Input,
    OnInit,
    Output,
    ViewChild,
} from '@angular/core';
import {Subject} from 'rxjs';
import {debounceTime, distinctUntilChanged, map, tap} from 'rxjs/operators';
import {ApiService} from "../../../services/api.service";


@Component({
    selector: 'ngx-type-ahead',
    templateUrl: './type-ahead.component.html',
    styleUrls: ['./type-ahead.component.scss'],
})
export class TypeAheadComponent implements AfterViewInit, OnInit {

    spinner: boolean = false;
    data$: Promise<any[]> | undefined;
    dataInput$ = new Subject<string>();
    dataLoading = false;
    searchFailed: boolean = true;

    @Input() model: any;
    @Input() multiple: boolean = false;
    @Input() riderManage: boolean = false;
    @Input() clearAfterSelection: boolean = false;
    @Input() disabled: boolean = false;
    @Input() filters: any;
    @Input() required = true;
    @Input() basePath: any = 'auth';
    @Input() placeholder: string = 'Search here';
    @Input() url: string = '';
    @Input() text: string = 'name';
    @Input() dataValue: any;
    @Input() value: string = '';
    @Input() searchField: string = '';
    @Input() notifySearchFail: boolean = false;
    @Input() displayNames: string[] = [];
    @Input() selectedItems = [];
    @Input() autoRouteFc: ((id: any) => void) | undefined;
    @Input() autoType = false;
    @Output() searchTerm: EventEmitter<string> = new EventEmitter();
    @Output() send: EventEmitter<any> = new EventEmitter();
    @Output() failed: EventEmitter<string> = new EventEmitter();
    @Output() cleared: EventEmitter<string> = new EventEmitter();
    @Output() onChange: EventEmitter<any> = new EventEmitter<any>();
    @Output() onRemove: EventEmitter<any> = new EventEmitter<any>();
    @ViewChild('selectContent') selectContent: any;
    constructor(private http: ApiService, private cd: ChangeDetectorRef) {
    }

ngOnInit() {
}

    ngAfterViewInit() {
        this.cd.detectChanges();
    }


    async searchApi(event: any): Promise<any[]> {
        const query: any = {};
        query['__limit'] = 80;
        if (this.searchField) {
            query[this.searchField] = event;

        } else {
            if (/^\d+$/.test(event)) {
                query['__phone__contains'] = event;
                query['__mobile_number__contains'] = event;
            } else {
                if (this.url === 'vehicle') {
                    query['__registration_number__contains'] = event;
                } else if (this.url === 'category' && this.riderManage) {
                    query['__limit'] = 300;
                    query['__name__contains'] = event;
                } else if (this.url === 'user_zone') {
                    query['__limit'] = 1500;
                } else if (this.url === 'reason' ) {
                    query['__limit__equal'] = 80;
                } else {
                    query['__name__contains'] = event;
                }
            }
        }

        for (const i in this.filters) {
            if (this.filters.hasOwnProperty(i)) {
                query[i] = this.filters[i];
            }
        }
        try {
            return (await this.http.query(query, this.basePath+'/'+this.url)).data;
        } catch (e) {
            console.error(e);
            return [];
        }

    }

    emitSelected(event: any) {
        if (typeof event === typeof 'str' || !event) {
            this.failed.emit(event);
            return;
        }
        this.placeholder = '';
        if (this.autoType) {
            // @ts-ignore
          this.autoRouteFc(event.id);
        }

        this.send.emit(event);
        this.searchFailed = true;
        this.onChange.emit(event);
        if (this.clearAfterSelection)
            this.selectContent.clearItem(event);
        this.cd.detectChanges();
    }

    selectAll() {
        this.spinner = true;
        // @ts-ignore
      this.data$.then(async (res: any[]) => {
            for (const r of res) {
                this.send.emit(r);
                await this.delay(500);
            }
            this.spinner = false;
        });
    }

    async delay(ms: number) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    resultFormatter(x: { name: string, mobile_number: string, registration_number?: string }) {
        try {
            if (this.displayNames && this.displayNames.length) {
                // @ts-ignore
              return this.displayNames.map(d => x[d]).join(', ');
            }
            if (x.mobile_number) {
                return x.name + ' - ' + x.mobile_number;
            }
            if (x.registration_number) {
                return x.registration_number;
            }
            return x.name ? x.name : x.registration_number;
        } catch (error) {
            return false;
        }
    }

    async loadPeople() {
        try {
            this.data$ = this.searchApi(undefined);
        } catch (e) {
        }
        this.dataInput$.pipe(
            distinctUntilChanged(),
            debounceTime(700),
            tap(() => {
                this.dataLoading = true;
            }),
            map(async term => {
                this.spinner = true;
                return this.searchApi(term);
            })).subscribe(async res => {
            this.data$ = res;
            await res;
            this.spinner = false;
            this.dataLoading = false;
        }, () => {
            this.spinner = false;
            this.dataLoading = false;
        });
    }

    inputInit(event: any) {  // init api call for blank input
        if (event.term === '') {
            try {
                this.data$ = this.searchApi(undefined);
            } catch (e) {
            }
        }
    }
}
