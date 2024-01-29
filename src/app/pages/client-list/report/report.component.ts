import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.scss']
})
export class ReportComponent implements OnInit {

  columns =
  [{
    name: 'user',
    displayName: this.translateText('User Name'),
    displayFn: ((r:any) => r.user ? r.user.name : ''),
  },
    {
      name: 'merchant',
      displayName: this.translateText('Merchant Name'),
      displayFn: ((r:any) => r.merchant ? r.merchant.name : ''),
    },
    {
    name: 'email_to',
    displayName: this.translateText('Email'),
  },
    {
      name: 'email_subject',
      displayName: this.translateText('Email Subject'),
    },
    {
      name: 'recurring_repeat',
      displayName: this.translateText('Repeat'),
    },
    {
      name: 'email_date',
      displayName: this.translateText('Email Date'),
    },
    {
      name: 'email_time',
      displayName: this.translateText('Email Time'),
    },
    ];

constructor(private translate: TranslateService) { }
translateText(key: string): string {
let translation: string = '';
this.translate.get(key).subscribe((res: string) => {
  translation = res;
});
return translation;
}
ngOnInit(): void {
}
}
