import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { DataService } from '../../data.service';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss']
})
export class OrderComponent implements OnInit {

  constructor(private http: DataService,
    private translate: TranslateService) {

}
  ngOnInit(): void {
  }

  translateText(key: string): string {
    let translation: string = '';
    this.translate.get(key).subscribe((res: string) => {
      translation = res;
    });
    return translation;
  }
}
