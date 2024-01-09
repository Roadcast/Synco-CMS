import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.scss']
})
export class ReportComponent implements OnInit {

  constructor(private translate: TranslateService) { }

  ngOnInit(): void {
  }
  translateText(key: string): string {
    let translation: string ='';
    this.translate.get(key).subscribe((res: string) => {
      translation = res;
    });
    return translation;
  }

}
