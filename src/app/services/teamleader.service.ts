import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TeamLeaderService {
  private baseUrl = 'http://162.109.85.69:1211/api/TeamLeaders'; 

  constructor(private http: HttpClient) {}

  getAllTeamLeaders(): Observable<any> {
    return this.http.get<any>(this.baseUrl);
  }

  // addTeamLeaders(teamLeaderData: any) {
  //   const userIds = teamLeaderData.userID;
  //   const requests = teamLeaderData;
  //   // console.log(teamLeaderData)
  //   // const requests = userIds.map((userId: number) => {
  //   //   const data = {
  //   //     ...teamLeaderData,
  //   //     userID: userId
  //   //   };
  //   //   console.log("team leader : ",data)

  //     return this.http.post(this.baseUrl, teamLeaderData);

  //   return requests;
  // }




  // createTeamLeader(TeamLeaderData: any): Observable<any> {
  //   return this.http.post(this.baseUrl, TeamLeaderData);
  // }
  // updateTeamLeader(id: number, TeamLeaderData: any): Observable<any> {
  //   return this.http.put(`${this.baseUrl}/${id}`, TeamLeaderData);
  // }
  
  importTeamLeader(file: File): Observable<Blob> {
    const formData: FormData = new FormData();
    formData.append('file', file, file.name);
    return this.http.post(this.baseUrl + 'importTeamLeader', formData, { responseType: 'blob' });
  }
  
  
  
  getExportTeamLeader(): Observable<Blob> {
    return this.http.get(this.baseUrl + 'exportTeamLeader', { responseType: 'blob' });
  }
  deleteTeamLeaders(TeamLeaderId: number,comment: any): Observable<any> {
    console.log("deleteobject : " , TeamLeaderId,comment)

    return this.http.delete<any>(this.baseUrl + '/deleteTeamleader/' + TeamLeaderId+'/'+comment);
  }

//   disableTeamLeaders(TeamLeaderId: number, comment: string): Observable<any> {
//     return this.http.delete<any>(`${this.baseUrl}/disableTeamLeader/${TeamLeaderId}/${comment}`, {});
// }

  
  
  getTeamLeadersById(id: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/${id}`);
  }

  saveTeamLeaders(TeamLeadersObj: any): Observable<any> {
    console.log("postobject : " , TeamLeadersObj)
    
    return this.http.post<any>(this.baseUrl, TeamLeadersObj);
  }

  // deleteTeamLeaders(TeamLeadersId: any,comment :any): Observable<any> {
  //   return this.http.delete<any>(this.baseUrl + '/deleteTeamLeaders/' + TeamLeadersId+'/'+comment);
  // }
  

  updateTeamLeaders(id: number, TeamLeaderData: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/${id}`, TeamLeaderData);
  }
  
  importTeamLeaders(file: File): Observable<Blob> {
    const formData: FormData = new FormData();
    formData.append('file', file, file.name);
    return this.http.post(this.baseUrl + '/importTeamLeaders', formData, { responseType: 'blob' });
  }
  getExportTeamLeaders(): Observable<Blob> {
    return this.http.get(this.baseUrl + '/exportTeamLeaders', { responseType: 'blob' });
  }

}



