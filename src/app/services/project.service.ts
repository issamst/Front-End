import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  private baseUrl:string="http://162.109.85.69:1211/api/Project";
  constructor(private http: HttpClient
  ) { }


  getAllProject(): Observable<any[]> {
    return this.http.get<any[]>(this.baseUrl);
  }

  getProjectById(id: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/${id}`);
  }
  getProjectByIdName(id: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/AreaName/${id}`);
  }

  getProjectsByAreas(areaIds: number[]): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/ProjectsByAreas`, areaIds);
  }
  saveProject(ProjectObj: any): Observable<any> {
    return this.http.post<any>(this.baseUrl, ProjectObj);
  }



  getProjectIdsByNames(names: string[]): Observable<number[]> {
    return this.http.post<number[]>(`${this.baseUrl}/ProjectIdByName`, names);
}


  deleteProject(ProjectId: any,comementer :any): Observable<any> {
    return this.http.delete<any>(this.baseUrl + '/deleteProject/' + ProjectId+'/'+comementer);
  }

  updateProject(id: number, ProjectObj: any): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/${id}`, ProjectObj);
  }
  
  
  importProject(file: File): Observable<Blob> {
    const formData: FormData = new FormData();
    formData.append('file', file, file.name);
    return this.http.post(this.baseUrl + '/importProject', formData, { responseType: 'blob' });
  }
  getExportProject(): Observable<Blob> {
    return this.http.get(this.baseUrl + '/exportProject', { responseType: 'blob' });
  }
}
