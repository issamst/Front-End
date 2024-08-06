import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TitleServiceService {

  private baseUrl:string="http://162.109.85.69:1211/api/UserTitle";
  constructor(private http: HttpClient) { }
  
  getAllTitle(): Observable<any[]> {
    return this.http.get<any[]>(this.baseUrl);
  }

  getTitleById(id: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/${id}`);
  }

  saveTitle(titleObj: any): Observable<any> {
    return this.http.post<any>(this.baseUrl, titleObj);
  }

  deleteTitle(id: number,comementer :any): Observable<any> {
    return this.http.delete<any>(this.baseUrl + '/TitleUser/' + id+'/'+comementer);
  }
  
  updateTitle(id: number, titleObj: any): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/${id}`, titleObj);
  }

  importTitle(file: File): Observable<Blob> {
    const formData: FormData = new FormData();
    formData.append('file', file, file.name);
    return this.http.post(this.baseUrl + '/importTitle', formData, { responseType: 'blob' });
  }
  getExportTitle(): Observable<Blob> {
    return this.http.get(this.baseUrl + '/exportTitle', { responseType: 'blob' });
  }
}
