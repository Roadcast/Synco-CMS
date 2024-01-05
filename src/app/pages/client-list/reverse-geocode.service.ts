import { EventEmitter, Injectable, Output } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { DataService } from '../data.service';

@Injectable({
  providedIn: 'root'
})
export class ReverseGeocodeService {
  addresses :any= {};
  pendingAddresses = new Set<string>();
  isFetching = false;

  @Output()
  addressEmit = new EventEmitter();
  addressSubject = new BehaviorSubject({});
  delay = (ms:any) => new Promise((res) => setTimeout(res, ms));

  constructor(private http: DataService) {}

  getAddress(latitude:any, longitude:any): string | null {
    const lat = parseFloat(latitude).toFixed(3);
    const lon = parseFloat(longitude).toFixed(3);
    const key: string = lat + "-" + lon;
    if (!this.validateCoords(lat, lon)) {
      return "";
    }

    if (this.addresses.hasOwnProperty(key)) {
      return this.addresses[key];
    } else {
      this.pendingAddresses.add(key);
      this.reverseGeoCode().then();
      return null;
    }
  }

  validateCoords(lat:any, lng:any): boolean {
    if (lat === "" || lng === "") {
      return false;
    }
    try {
      if (
        lat !== 0 &&
        lng !== 0 &&
        -90 <= lat &&
        lat <= 90 &&
        -180 <= lng &&
        lng <= 180
      ) {
        return true;
      }
    } catch (e) {}
    return false;
  }

  async reverseGeoCode(): Promise<any> {
    if (this.pendingAddresses.size < 25) {
      await this.delay(10); // to collect more before making first request
    }

    if (!this.pendingAddresses.size || this.isFetching) {
      return;
    }

    this.isFetching = true;
    let i = 0;
    const geoCodeRequestArray = [];

    try {
      const toEmitObject:any = {};
      for (const item of this.pendingAddresses) {
        // Not working from here....
        const latlng = item.split("-");

        if (i < 25) {
          if (this.validateCoords(latlng[0], latlng[1])) {
            geoCodeRequestArray.push({
              id: item,
              lat: latlng[0],
              lng: latlng[1],
            });
          }
        } else {
          break;
        }
        this.pendingAddresses.delete(item);
        i++;
      }
      if (geoCodeRequestArray.length < 1) {
        // this.isFetching = false; after fixing uncomment
        return;
      }
      const resp = await this.http.create(
        geoCodeRequestArray,
        {},
        "geocode",
        // "geocode"
      );

      Object.entries(resp).forEach((entry:any) => {
        this.addresses[entry[0]] = entry[1]["display_name".toString()];
        toEmitObject[entry[0]] = entry[1]["display_name".toString()];
      });
      // console.log('toEmitObject', toEmitObject);
      this.addressSubject.next(this.addresses);
      this.addressEmit.emit(toEmitObject);
    } catch (e) {
      console.error(e);
    }
    this.isFetching = false;
    if (this.pendingAddresses.size) {
      // console.log(this.pendingAddresses.size);
      this.reverseGeoCode().then();
    }
  }
}
