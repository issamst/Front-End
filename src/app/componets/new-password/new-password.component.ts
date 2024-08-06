import { Component, Input,OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ResetPassword } from '../../models/reset-password.model';
import { TranslateService } from '@ngx-translate/core';
import ValidateForm from '../../helpers/validateform';
import Swal from 'sweetalert2';
import { ConfirmPasswordvalidator } from '../../helpers/confirm-password.validator';

import { ActivatedRoute, Router } from '@angular/router';
import { ResetPasswordService } from '../../services/reset-password.service';
import { UserStoreService } from '../../services/user-store.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-new-password',
  templateUrl: './new-password.component.html',
  styleUrl: './new-password.component.css'
})
export class NewPasswordComponent implements OnInit {

  resetNewPasswordForm!:FormGroup;
  emailToteid!:string;
  emailToReaset!:string;
  emailToken!:string;
  resetPAsswordObj =new ResetPassword();
  
  type:string="password"; 
  lang:string ='';
  eyeIcon: string ="fa-eye-slash ";
  isText:boolean=false;
  @Input() fullName: string = '';
  @Input() teid : string = '';
  constructor(
    private userStore: UserStoreService,
    private auth: AuthService,
    private fb:FormBuilder,
    private translateService:TranslateService, 
    private activatedRouter:ActivatedRoute,
    private resetService:ResetPasswordService,
    private router:Router
  
    ){}
    ngOnInit(): void {
      this.userStore.getFullNameFromStore().subscribe((val) => {
          const fullNameFromToken = this.auth.getfullNameFromToken();
          this.fullName = val || fullNameFromToken;
      });
  
      this.userStore.getTeidFromStore().subscribe((val) => {
          const teidFromToken = this.auth.getTeidFromToken();
          this.teid = val || teidFromToken;
      });
  
      this.resetNewPasswordForm = this.fb.group({
          TEID: [this.teid, Validators.required],
          FullName: [this.fullName, Validators.required],
          password: [null, Validators.required],
          confirmPassword: [null, Validators.required],
      }, { validator: ConfirmPasswordvalidator('password', 'confirmPassword') });
  
      this.lang = localStorage.getItem('lang') || 'en';
  }
  
  
  
  
  
  hideShowPass(){
    this.isText= !this.isText;
    this.isText ? this.eyeIcon=" fa-eye":this.eyeIcon="fa-eye-slash"
    this.isText ? this.type="text" :this.type="password"
  
  }
  
  

  
  ChangeLang(lang:any){
    const selectedLanguage = lang.target.value;
  
    localStorage.setItem('lang',selectedLanguage);
  
    this.translateService.use(selectedLanguage);
  
  }
  
  
  
  onReset() {
    if (this.resetNewPasswordForm.valid) {
       
        this.resetService.resetNewPassword(this.resetNewPasswordForm.value).subscribe({
            next: (res) => {
                Swal.fire('Done !!', 'Password Reset Successfully', 'success');
                this.router.navigate(['/login']);
            },
            error: (err) => {
              console.log(this.resetNewPasswordForm.value);
                Swal.fire('Error', err.error.message || 'Failed to reset password', 'error');
            }
        });
    } else {
        Swal.fire('Error', 'Please fill out all required fields and ensure passwords match', 'error');
    }
}


  
    
}
  
