import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ResetPassword } from '../models/reset-password.model';

@Injectable({
  providedIn: 'root'
})
export class ResetPasswordService {
  private baseUrl:string = "http://162.109.85.69:1211/api/User";

  constructor(private http: HttpClient) { }
 
  sendRestPasswordLink(userObj:any) {
    return this.http.post<any>(this.baseUrl+'/send-reset-email',userObj);
   
  }

  resetPassword(resetPasswordObj: ResetPassword) {
   
    return this.http.post<any>(this.baseUrl+'/reset-password', resetPasswordObj);
  }
  resetNewPassword(resetPasswordObj: any) {
    return this.http.post<any>(this.baseUrl + '/reset-new-password', resetPasswordObj);
  }



}
