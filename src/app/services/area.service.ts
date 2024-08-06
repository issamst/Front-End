import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AreaService {

  private baseUrl:string="http://162.109.85.69:1211/api/Area";
  constructor(private http: HttpClient
  ) { }


  getAllArea(): Observable<any[]> {
    return this.http.get<any[]>(this.baseUrl);
  }

  getAreaById(id: any): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/${id}`);
  }
  getAreaByIdPlant(plantId: any): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/plant/${plantId}`);
  }
  saveArea(AreaObj: any): Observable<any> {
    return this.http.post<any>(this.baseUrl, AreaObj);
  }










  
  updateArea(id: number, formData: any): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/${id}`, formData);
  }
  getAreaByIdName_M(id: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/getIdByName/${id}`);
  }
  getAreaIdsByNames(names: any[]): Observable<number[]> {
    return this.http.post<number[]>(`${this.baseUrl}/getIdsByNames`, names);
}

  deleteArea(AreaId: any,comementer :any): Observable<any> {
    return this.http.delete<any>(this.baseUrl + '/deleteArea/' + AreaId+'/'+comementer);
  }

 
  


  getExportArea(): Observable<Blob> {
    return this.http.get(this.baseUrl + '/exportArea', { responseType: 'blob' });
  }
  importArea(file: File): Observable<Blob> {
    const formData: FormData = new FormData();
    formData.append('file', file, file.name);
    return this.http.post(this.baseUrl + '/importArea', formData, { responseType: 'blob' });
  }
}
