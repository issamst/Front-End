import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DepartementService {

  private baseUrl:string="http://162.109.85.69:1211/api/Departement";
  constructor(private http: HttpClient) { }


  getAlldepartement(): Observable<any[]> {
    return this.http.get<any[]>(this.baseUrl);
  }

  getdepartementById(id: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/${id}`);
  }

  getDepartementByPlant(plantId: any): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/byPlant/${plantId}`);
  }


  savedepartement(departemenObj: any): Observable<any> {
    return this.http.post<any>(this.baseUrl, departemenObj);
  }
  
 
updatedepartement(id: number, departementObj: any): Observable<any> {
  return this.http.put<any>(`${this.baseUrl}/${id}`, departementObj);
}



  deletedepartement(departemenId: any,comementer :any): Observable<any> {
    return this.http.delete<any>(this.baseUrl + '/deleteDepartement/' + departemenId+'/'+comementer);
  }

 

  importDepartement(file: File): Observable<Blob> {
    const formData: FormData = new FormData();
    formData.append('file', file, file.name);
    return this.http.post(this.baseUrl + '/importDepartement', formData, { responseType: 'blob' });
  }
  getExportDepartement(): Observable<Blob> {
    return this.http.get(this.baseUrl + '/exportDepartement', { responseType: 'blob' });
  }


}
