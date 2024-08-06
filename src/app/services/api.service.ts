import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl:string="http://162.109.85.69:1211/api/User";
  constructor(private http: HttpClient) { }
  getUsers() {
    return this.http.get<any>(this.baseUrl);
  }
}
