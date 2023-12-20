import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {

  constructor() { }
  underscoreConvert(string:any): string {
    return string.replace(/_/g, ' ');
  }
}
