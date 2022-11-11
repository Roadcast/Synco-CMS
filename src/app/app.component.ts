import { Component } from '@angular/core';
import {MessageService, PrimeNGConfig} from "primeng/api";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [MessageService]

})
export class AppComponent {
  title = 'synco-client-management';
  constructor(private messageService: MessageService, private primengConfig: PrimeNGConfig ) {
  }
  ngOnInit() {
    this.primengConfig.ripple = true;
  }
}
