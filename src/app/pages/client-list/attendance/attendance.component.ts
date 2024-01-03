import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-attendance',
  templateUrl: './attendance.component.html',
  styleUrls: ['./attendance.component.scss']
})
export class AttendanceComponent implements OnInit {

  constructor(private translate: TranslateService) { }
  translateText(key: string): string {
    let translation: string='';
    this.translate.get(key).subscribe((res: string) => {
      translation = res;
    });
    return translation;
  }
  ngOnInit() {
  }
}
