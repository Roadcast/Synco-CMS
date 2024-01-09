import { Injectable } from '@angular/core';
import { Company } from '../models/Company';
import { DataService } from './data.service';

@Injectable({
  providedIn: 'root'
})
export class PagesService {
  companyInfo!: Company;

  constructor(private http: DataService) {}

  async getCompanyInfo() {
    try {
      this.companyInfo = (await this.http.query({}, "company", "auth")).data[0];
      // return this.companyInfo;
    } catch (e) {
      console.error(e);
    }
  }

  Compare(oldData:any, newData:any) {
    const modifiedObj:any = {};
    for (const [key] of Object.entries(oldData)) {
      if (oldData[key] === newData[key]) {
        const oldKeys = Object.keys(oldData);
        const newKeys = Object.keys(newData);
        // tslint:disable-next-line:no-shadowed-variable
        const addedKeys = newKeys.filter((key) => !oldKeys.includes(key));
        if (addedKeys.length > 0) {
          // tslint:disable-next-line:no-shadowed-variable
          addedKeys.forEach((key) => {
            modifiedObj[key] = newData[key];
          });
        } else {
        }
      } else {
        modifiedObj[key] = newData[key];
      }
    }
    return modifiedObj;
  }

  checkNewElements(oldObject: any, newObject: any): boolean {
    const oldKeys = Object.keys(oldObject);
    const newKeys = Object.keys(newObject);

    for (const key of newKeys) {
      if (!oldKeys.includes(key)) {
        return true; // New element added
      }
    }

    return false; // No new element added
  }

  getAddedElements(oldObj: any, newObj: any): string[] {
    const addedElements: string[] = [];

    for (const key in newObj) {
      if (!oldObj.hasOwnProperty(key)) {
        addedElements.push(key);
      }
    }

    return addedElements;
  }
}
