import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { UserService } from 'src/app/services/user.service';

@Component({
    selector: 'app-account',
    templateUrl: './account.component.html',
    styleUrls: ['./account.component.scss']
})
export class AccountComponent implements OnInit {
    route: any = 'Configuration';
    accountTabs = [
        {
            title: this.translateText('Configuration'),
            route: 'configuration',
            //            icon: 'lock-outline',
            responsive: true,
        },
        {
            title: this.translateText('Attendance'),
            route: 'attendance',
            //            icon: 'calendar-outline',
            responsive: true,
        },
        {
            title: this.translateText('Order'),
            route: 'order',
            //            icon: 'briefcase-outline',
            responsive: true,
        },
        {
            title: this.translateText('Reports to Mail'),
            route: 'report',
            //            icon: 'briefcase-outline',
            responsive: true,
        },
    ];

    constructor(private translate: TranslateService, private user: UserService) { }
    translateText(key: string): string {
        let translation: string = '';
        this.translate.get(key).subscribe((res: string) => {
            translation = res;
        });
        return translation;
    }
    ngOnInit() {
        this.route= localStorage.getItem('route')
    }

    // for getting route
    gettingRoute(event: any) {
        this.route = event.title;
        localStorage.setItem('route', this.route);
    }
}
