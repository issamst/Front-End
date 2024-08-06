import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RoleService {

  private baseUrl:string="http://162.109.85.69:1211/api/UserRole";
  constructor(private http: HttpClient) { }

  getAllRoles(): Observable<any> {
    return this.http.get<any[]>(this.baseUrl);
  }

  getRoleById(id: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/${id}`);
    
  }

  addRole(role: any): Observable<any> {
    return this.http.post<any>(this.baseUrl, role);
  }

  updateRole(id: number, role: any): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/${id}`, role);
  }

  deleteRole(id: number,comementer :any): Observable<any> {
    return this.http.delete<any>(this.baseUrl + '/RoleUser/' + id+'/'+comementer);
  }

  
  importRole(file: File): Observable<Blob> {
    const formData: FormData = new FormData();
    formData.append('file', file, file.name);
    return this.http.post(this.baseUrl + '/importRole', formData, { responseType: 'blob' });
  }
  getExportRole(): Observable<Blob> {
    return this.http.get(this.baseUrl + '/exportRole', { responseType: 'blob' });
  }
  
}
