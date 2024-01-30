import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Subject, debounceTime, distinctUntilChanged, map, tap } from 'rxjs';
import { DataService } from '../../data.service';
interface MyObjectType {
  name: string;
  mobile_number: string;
  registration_number?: string;
  financial_year_start?: string;
  [key: string]: string | undefined; // Index signature
}

@Component({
  selector: 'app-type-ahead',
  templateUrl: './type-ahead.component.html',
  styleUrls: ['./type-ahead.component.scss']
})
export class TypeAheadComponent implements OnInit {
  spinner: boolean = false;
  data$!: Promise<any[]>;
  dataInput$ = new Subject<string>();
  dataLoading = false;
  searchFailed: boolean = true;

  @Input() model: any;
  @Input() multiple: boolean = false;
  @Input() riderManage: boolean = false;
  @Input() clearAfterSelection: boolean = false;
  @Input() disabled: any;
  @Input() filters: any;
  @Input() required = true;
  @Input() basePath: any = "auth";
  @Input() placeholder: string = "Search Here";
  @Input() url!: string;
  @Input() text: string = "name";
  @Input() dataValue: any;
  @Input() value!: string;
  @Input() searchField!: string;
  @Input() notifySearchFail: boolean = false;
  @Input() displayNames: string[] = [];
  @Input() selectedItems = [];
  @Input() autoRouteFc!: (id: any) => void;
  @Input() autoType = false;
  @Input() failedEmit: boolean = false;
  @Output() searchTerm: EventEmitter<string> = new EventEmitter();
  @Output() send: EventEmitter<any> = new EventEmitter();
  @Output() failed: EventEmitter<string> = new EventEmitter();
  @Output() cleared: EventEmitter<string> = new EventEmitter();
  @Output() onChange: EventEmitter<any> = new EventEmitter<any>();
  @Output() onRemove: EventEmitter<any> = new EventEmitter<any>();
  @ViewChild("selectContent") selectContent: any;
  constructor(private translate: TranslateService
,    private http: DataService, private cd: ChangeDetectorRef) {}

  ngOnInit() {
    // const riderFilter = document.querySelector('.ng-select .ng-select-container');
    // const riderFilterContainer = document.querySelector('.ng-value-container');
    // if (riderFilter) {
    //     this.renderer.setStyle(riderFilter, 'overflow', 'unset');
    // } else if (riderFilterContainer) {
    //     this.renderer.setStyle(riderFilterContainer, 'height', '44px');
    // }
  }
  translateText(key: string): string {
        let translation: string = '';
        this.translate.get(key).subscribe((res: string) => {
            translation = res;
        });
        return translation;
    }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes?.['failedEmit']) {
      if (changes?.['failedEmit'].currentValue === true) {
        this.selectedItems = [];
      }
    }
  }

  ngAfterViewInit() {
    this.cd.detectChanges(); 
  }

  async searchApi(event:any): Promise<any[]> {
    const query:any = {};
    query["__limit"] = 80;
    if (this.searchField) {
      query[this.searchField] = event;
    } else {
      if (/^\d+$/.test(event)) {
        query["__phone__contains"] = event;
        query["__mobile_number__contains"] = event;
      } else {
        if (this.url === "vehicle") {
          query["__registration_number__contains"] = event;
        } else if (this.url === "category" && this.riderManage) {
          query["__limit"] = 300;
          query["__name__contains"] = event;
        } else if (this.url === "user_zone") {
          query["__limit"] = 1500;
        } else if (this.url === "reason") {
          query["__limit__equal"] = 80;
        } else {
          query["__name__contains"] = event;
        }
      }
    }

    for (const i in this.filters) {
      if (this.filters.hasOwnProperty(i)) {
        query[i] = this.filters[i];
      }
    }
    try {
      return (await this.http.query(query, this.url, this.basePath)).data;
    } catch (e) {
      console.error(e);
      return [];
    }
  }

  emitSelected(event:any) {
    console.log(event);
    this.failedEmit = false;
    if (typeof event === typeof "str" || !event) {
      this.failed.emit(event);
      return;
    }
    if (this.autoType) {
      this.autoRouteFc(event.id);
    }

    this.send.emit(event);
    this.searchFailed = true;
    this.onChange.emit(event);
    if (this.clearAfterSelection) this.selectContent.clearItem(event);
    this.cd.detectChanges();
  }

  selectAll() {
    this.spinner = true;
    this.data$.then(async (res: any[]) => {
      for (const r of res) {
        this.send.emit(r);
        await this.delay(500);
      }
      this.spinner = false;
    });
  }

  async delay(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  resultFormatter(x: MyObjectType) {
    try {
      if (this.displayNames && this.displayNames.length) {
        if (this.basePath === "attendance") {
          return this.displayNames.map((d) => (x[d] as any)).join("- ");
        } else {
          return this.displayNames.map((d) => (x[d] as any)).join(", ");
        }
      }
      if (x.mobile_number) {
        return x.name + " - " + x.mobile_number;
      }
      if (x.registration_number) {
        return x.registration_number;
      }
      if (x.financial_year_start) {
        return x.financial_year_start;
      }
      return x.name ? x.name : x.registration_number;
    } catch (error) {
      return;
    }
  }

  async loadPeople() {
    try {
      this.data$ = this.searchApi(undefined);
    } catch (e) {}
    this.dataInput$
      .pipe(
        distinctUntilChanged(),
        debounceTime(700),
        tap(() => {
          this.dataLoading = true;
        }),
        map(async (term) => {
          this.spinner = true;
          return this.searchApi(term);
        })
      )
      .subscribe(
        async (res) => {
          this.data$ = res;
          await res;
          this.spinner = false;
          this.dataLoading = false;
        },
        () => {
          this.spinner = false;
          this.dataLoading = false;
        }
      );
  }

  inputInit(event:any) {
    // init api call for blank input
    if (event.term === "") {
      try {
        this.data$ = this.searchApi(undefined);
      } catch (e) {}
    }
  }
}
