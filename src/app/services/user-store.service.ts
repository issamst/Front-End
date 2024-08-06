import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserStoreService {
  private fullNameKey = 'userFullName';
  private roleKey = 'userRole';
  private teidKey = 'userTeid';

  private fullName$ = new BehaviorSubject<string>(this.getFullNameFromLocalStorage() || "");
  private role$ = new BehaviorSubject<string>(this.getRoleFromLocalStorage() || "");
  private id$ = new BehaviorSubject<string>(this.getIdFromLocalStorage() || "");
  private teid$ = new BehaviorSubject<string>(this.getTeidFromLocalStorage() || "");

  constructor() { }

  public getRoleFromStore() {
    return this.role$.asObservable();
  }

  public getFullNameFromStore() {
    return this.fullName$.asObservable();
  }

  public getIdFromStore() {
    return this.id$.asObservable();
  }

  public getTeidFromStore() {
    return this.teid$.asObservable();
  }

  public setRoleForStore(role: string) {
    this.role$.next(role);
    localStorage.setItem(this.roleKey, role);
  }

  public setFullNameForStore(fullName: string) {
    this.fullName$.next(fullName);
    localStorage.setItem(this.fullNameKey, fullName);
  }

  public setIdForStore(id: string) {
    this.id$.next(id);
    localStorage.setItem(this.teidKey, id);
  }

  public setTeidForStore(teid: string) {
    this.teid$.next(teid);
    localStorage.setItem(this.teidKey, teid);
  }

  private getFullNameFromLocalStorage(): string | null {
    return localStorage.getItem(this.fullNameKey);
  }

  private getRoleFromLocalStorage(): string | null {
    return localStorage.getItem(this.roleKey);
  }

  private getIdFromLocalStorage(): string | null {
    return localStorage.getItem(this.teidKey);
  }

  private getTeidFromLocalStorage(): string | null {
    return localStorage.getItem(this.teidKey);
  }
}
