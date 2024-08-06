import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SupervisorService {
  private baseUrl: string = "http://162.109.85.69:1211/api/Supervisor";
  constructor(private http: HttpClient
  ) { }
  getAllSupervisor(): Observable<any[]> {
    return this.http.get<any[]>(this.baseUrl);
  }

  getSupervisorById(id: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/${id}`);
  }

  saveSupervisor(supervisor: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}`, supervisor);
  }


  disabledSupervisor(SupervisorID: any,comementer :any): Observable<any> {
    return this.http.delete<any>(this.baseUrl + '/' + SupervisorID+'/'+comementer);
  }

  updateSupervisor(id: number, SupervisorObj: any): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/${id}`, SupervisorObj);
  }
}
