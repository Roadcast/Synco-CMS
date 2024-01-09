import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-configuration-header',
  templateUrl: './configuration-header.component.html',
  styleUrls: ['./configuration-header.component.scss']
})
export class ConfigurationHeaderComponent implements OnInit {
  companyName:any;
  @Input() routePoint:any;
  constructor(private route: ActivatedRoute, private router:Router, private user: UserService) { }

  ngOnInit(): void {
    this.companyName = localStorage.getItem('companyName')
  }
}
