import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { TokenApiModel } from '../models/token-api.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl: string = "http://162.109.85.69:1211/api/User/";
  private userPayload: any;

  constructor(private http: HttpClient, private router: Router) {
    this.userPayload = this.decodedToken();
  }

  signUp(userObj: any) {
    return this.http.post<any>(this.baseUrl + 'register', userObj);
  }

  Addnew(userObj: any) {
    return this.http.post<any>(this.baseUrl + 'AddNew', userObj);
  }

  login(loginObj: any) {
    return this.http.post<any>(this.baseUrl + 'authenticate', loginObj);
  }

  Request(id: any) {
    return this.http.get<any>(`${this.baseUrl + 'request'}/${id}`);
  }

  signOut() {
    localStorage.clear();
    this.userPayload = null; // Clear the user payload
    this.router.navigate(['login']);
  }

  storeToken(tokenValue: string) {
    localStorage.setItem('usertoken', tokenValue);
    this.userPayload = this.decodedToken(); // Update the user payload
  }

  getToken() {
    return localStorage.getItem('usertoken');
  }

  getUserById(userId: number): Observable<any> {
    return this.http.get<any>(this.baseUrl + 'getUserbyid/' + userId);
  }

  updateUser(userId: number, updatedUserData: any): Observable<any> {
    return this.http.put<any>(this.baseUrl + 'updateUser/' + userId, updatedUserData);
  }

  deleteUser(userId: number, commenter: string): Observable<any> {
    return this.http.delete<any>(this.baseUrl + 'deleteUser/' + userId + '/' + commenter);
  }

  importUser(file: File): Observable<Blob> {
    const formData: FormData = new FormData();
    formData.append('file', file, file.name);
    return this.http.post(this.baseUrl + 'importUser', formData, { responseType: 'blob' });
  }

  getExportUser(): Observable<Blob> {
    return this.http.get(this.baseUrl + 'exportUser', { responseType: 'blob' });
  }

  storeRefreshToken(tokenValue: string) {
    localStorage.setItem('refreshToken', tokenValue);
  }

  getRefreshToken() {
    return localStorage.getItem('refreshToken');
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('usertoken');
  }

  decodedToken() {
    const jwtHelper = new JwtHelperService();
    const token = this.getToken();
    return token ? jwtHelper.decodeToken(token) : null;
  }

  getfullNameFromToken() {
    return this.userPayload ? this.userPayload.unique_name : null;
  }

  getRoleFromToken() {
    return this.userPayload ? this.userPayload.role : null;
  }

  getidFromToken() {
    return this.userPayload ? this.userPayload.Id : null;
  }

  getTeidFromToken() {
    return this.userPayload ? this.userPayload.Teid : null;
  }

  renewToken(tokenApi: TokenApiModel) {
    return this.http.post<any>(this.baseUrl + 'refresh', tokenApi);
  }
}
