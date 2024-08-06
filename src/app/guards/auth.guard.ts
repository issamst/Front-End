import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { NgToastService } from 'ng-angular-popup';
import Swal from 'sweetalert2';


@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    private auth : AuthService,
     private router: Router,
      private toast: NgToastService
    ){}

  canActivate(): boolean {
    if(this.auth.isLoggedIn()){
      console.log('User is logged in.');
      return true;
    }else{
      console.log('User is not logged in. Redirecting to login.');
       Swal.fire('Hi how are you hhhhhhhhh!! ', 'Please Login First!', 'error');

       this.router.navigate(['login']);
       return false;
    }
  }

}
