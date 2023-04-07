import {StorageMap} from '@ngx-pwa/local-storage';
import {Injectable} from '@angular/core';
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  constructor(private storage: StorageMap) {
  }

  async getItem(key: string): Promise<any> {
    return await this.storage.get(key).toPromise();
  }

  async setItem(key: string, value: any) {
    await this.storage.set(key, value).toPromise();
    await this.getItem('token');
  }

  async clearItem(key: string) {
     return await this.storage.delete(key).toPromise();
  }

  async clearAll() {
     return this.storage.clear();
  }

  watch(key: string): Observable<any> {
    return this.storage.watch(key);
  }
}
