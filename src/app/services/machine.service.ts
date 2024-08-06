import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MachineService {

  private baseUrl:string="http://162.109.85.69:1211/api/Machine";
  constructor(private http: HttpClient
  ) { }


  getAllMachine(): Observable<any[]> {
    return this.http.get<any[]>(this.baseUrl);
  }

  getMachineById(id: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/${id}`);
  }

  saveMachine(MachineObj: any): Observable<any> {
    return this.http.post<any>(this.baseUrl, MachineObj);
  }

  deleteMachine(MachineId: any,comementer :any): Observable<any> {
    return this.http.delete<any>(this.baseUrl + '/deleteMachine/' + MachineId+'/'+comementer);
  }

  updateMachine(id: number, MachineObj: any): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/${id}`, MachineObj);
  }
  importMachine(file: File): Observable<Blob> {
    const formData: FormData = new FormData();
    formData.append('file', file, file.name);
    return this.http.post(this.baseUrl + '/importMachine', formData, { responseType: 'blob' });
  }
  getExportMachine(): Observable<Blob> {
    return this.http.get(this.baseUrl + '/exportMachine', { responseType: 'blob' });
  }

  
  getMachineByAreas(ProjectIds: number[]): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/getMachinesByProject`, ProjectIds);
  }

  

}
