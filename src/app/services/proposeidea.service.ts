import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProposeideaService {
  private baseUrl: string = "http://162.109.85.69:1211/api/Idea";
  private baseUrl_upload: string = "http://162.109.85.69:1211/api/Idea";
  constructor(private http: HttpClient) { }

  getAllProposeidea(): Observable<any[]> {
    return this.http.get<any[]>(this.baseUrl);
  }

  getAllProposeideaByTeid(teid: any): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/teid/${teid}`);
  }

  getProposeideaById(id: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/ideaByid/${id}`);
  }
  GetAllIdeas(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}`);
  }
  saveIdea(IdeatObj: any): Observable<any> {
    return this.http.post<any>(this.baseUrl_upload, IdeatObj);
  }



  deleteProposeidea(ideaid: any,comementer :any): Observable<any> {
    return this.http.delete<any>(this.baseUrl + '/DisabledIdea/' + ideaid+'/'+comementer);
  }
  updateProposeidea(id: number, IdeatObj: any): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/${id}`, IdeatObj);
  }
  

  updateMachine(id: number, MachineObj: any): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/${id}`, MachineObj);
  }


 

  getFileIdea(fileName: string): Observable<Blob> {
    return this.http.get(`${this.baseUrl}/FileIdea/${fileName}`, { responseType: 'blob' });
  }
  

  
  getFileSituation(fileName: string): Observable<Blob> {
    return this.http.get(`${this.baseUrl}/FileSituation/${fileName}`, { responseType: 'blob' });
  }

  
  getFileSolution(fileName: string): Observable<Blob> {
    return this.http.get(`${this.baseUrl}/FileSolution/${fileName}`, { responseType: 'blob' });
  }


//TL
  TeamLeaderAnswer(id: any, userId: any, response: string,comment: string): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/Team_Leader/Answer/${id}/${userId}/${response}/${comment}`, {} );
  }
  //Committe
  CommitteeAnswer(id: any, userId: any, response: string,comment:string): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/Committee/Answer/${id}/${userId}/${response}/${comment}`, {} );
  }
  









}