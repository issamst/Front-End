import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ImpactService {

  private baseUrl:string="http://162.109.85.69:1211/api/Impact";
  constructor(private http: HttpClient) { }


  getAllImpact(): Observable<any[]> {
    return this.http.get<any[]>(this.baseUrl);
  }

  getImpactById(id: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/${id}`);
  }

  saveImpact(ImpactObj: any): Observable<any> {
    return this.http.post<any>(this.baseUrl, ImpactObj);
  }

  deleteImpact(ImpactId: any,comementer :any): Observable<any> {
    return this.http.delete<any>(this.baseUrl + '/deleteImpact/' + ImpactId+'/'+comementer);
  }

  updateImpact(id: number, ImpactObj: any): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/${id}`, ImpactObj);
  }
  importImpact(file: File): Observable<Blob> {
    const formData: FormData = new FormData();
    formData.append('file', file, file.name);
    return this.http.post(this.baseUrl + '/importImpact', formData, { responseType: 'blob' });
  }
  getExportImpact(): Observable<Blob> {
    return this.http.get(this.baseUrl + '/exportImpact', { responseType: 'blob' });
  }

}
