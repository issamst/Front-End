import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StatusService {
  private baseUrl:string="http://162.109.85.69:1211/api/UserRole";
  constructor(private http: HttpClient) { }

  getAllStatus(): Observable<any> {
    return this.http.get<any[]>(this.baseUrl);
  }

  getStatusById(id: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/${id}`);
    
  }

  addStatus(role: any): Observable<any> {
    return this.http.post<any>(this.baseUrl, role);
  }

  updateStatus(id: number, role: any): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/${id}`, role);
  }

  DisableStatus(id: number,comementer :any): Observable<any> {
    return this.http.delete<any>(this.baseUrl + '/StatusDisable/' + id+'/'+comementer);
  }

}
