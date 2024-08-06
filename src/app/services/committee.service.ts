
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CommitteeService {
  private baseUrl = 'http://162.109.85.69:1211/api/Committees'; 

  constructor(private http: HttpClient) {}

  getAllCommittees(): Observable<any> {
    return this.http.get<any>(this.baseUrl);
  }


  // createCommittee(committeeData: any): Observable<any> {
  //   return this.http.post(this.baseUrl, committeeData);
  // }
  // updateCommittee(id: number, committeeData: any): Observable<any> {
  //   return this.http.put(`${this.baseUrl}/${id}`, committeeData);
  // }
  
  importCommittee(file: File): Observable<Blob> {
    const formData: FormData = new FormData();
    formData.append('file', file, file.name);
    return this.http.post(this.baseUrl + 'importCommittee', formData, { responseType: 'blob' });
  }
  
  
  
  getExportCommittee(): Observable<Blob> {
    return this.http.get(this.baseUrl + 'exportCommittee', { responseType: 'blob' });
  }
  deleteCommittee(CommitteeId: number,comment :any): Observable<any> {
    return this.http.delete<any>(this.baseUrl + '/deleteCommittee/' + CommitteeId+'/'+comment);
  }
  
  
  getCommitteesById(id: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/${id}`);
  }

  saveCommittees(CommitteesObj: any): Observable<any> {
    return this.http.post<any>(this.baseUrl, CommitteesObj);
  }

  // deleteCommittees(CommitteesId: any,comment :any): Observable<any> {
  //   return this.http.delete<any>(this.baseUrl + '/deleteCommittees/' + CommitteesId+'/'+comment);
  // }

  updateCommittee(id: number, committeeData: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/${id}`, committeeData);
  }
  
  importCommittees(file: File): Observable<Blob> {
    const formData: FormData = new FormData();
    formData.append('file', file, file.name);
    return this.http.post(this.baseUrl + '/importCommittees', formData, { responseType: 'blob' });
  }
  getExportCommittees(): Observable<Blob> {
    return this.http.get(this.baseUrl + '/exportCommittees', { responseType: 'blob' });
  }

}

