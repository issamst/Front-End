import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ResetPassword } from '../../models/reset-password.model';
import { TranslateService } from '@ngx-translate/core';
import ValidateForm from '../../helpers/validateform';
import Swal from 'sweetalert2';
import { ConfirmPasswordvalidator } from '../../helpers/confirm-password.validator';

import { ActivatedRoute, Router } from '@angular/router';
import { ResetPasswordService } from '../../services/reset-password.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {

resetPasswordFrom!:FormGroup;
emailToteid!:string;
emailToReaset!:string;
emailToken!:string;
resetPAsswordObj =new ResetPassword();

type:string="password"; 
lang:string ='';
eyeIcon: string ="fa-eye-slash ";
isText:boolean=false;


constructor(

  private fb:FormBuilder,
  private translateService:TranslateService, 
  private activatedRouter:ActivatedRoute,
  private resetService:ResetPasswordService,
  private router:Router

  ){}
      ngOnInit(): void {
        this.resetPasswordFrom= this.fb.group({
          
          password: [null, Validators.required],
          confirmPassword: [null, Validators.required],
         
        }, { validator: ConfirmPasswordvalidator("password", "confirmPassword") });
        this.activatedRouter.queryParams.subscribe(val=>{
          this.emailToteid=val['teid'];
          this.emailToReaset=val['email'];
          //this.emailToken=val['code'];
          let uriToken= val['code'] ;
          this.emailToken=uriToken.replace(/ /g,'+');
          console.log(" TEID " ,this.emailToteid ,"emil:" ,this.emailToReaset,"code:",this.emailToken);
        }),
              this.lang = localStorage.getItem('lang')|| 'en'
               
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



onReste(){
console.log(this.resetPasswordFrom.value)
 if(this.resetPasswordFrom.valid){

  this.resetPAsswordObj.teid=this.emailToteid;
  this.resetPAsswordObj.email=this.emailToReaset;
  this.resetPAsswordObj.emailToken=this.emailToken;
  this.resetPAsswordObj.newPassword=this.resetPasswordFrom.value.password;
  this.resetPAsswordObj.confirmPassword=this.resetPasswordFrom.value.confirmPassword;

   console.log("teid : ",this.resetPAsswordObj.teid);
   console.log("email : ",this.resetPAsswordObj.email);
   console.log("token : ",this.resetPAsswordObj.emailToken);
   console.log("password : ",this.resetPAsswordObj.newPassword);
   console.log("co pass : ",this.resetPAsswordObj.confirmPassword);


  this.resetService.resetPassword(this.resetPAsswordObj).subscribe({
    
    next:(res)=>{

      Swal.fire( 'Done !!','Password Reset Successfully', 'success');
      this.router.navigate(['/login']);
    },
    error:(err)=>{
      console.log("teid : ",this.resetPAsswordObj.teid);
  console.log("email : ",this.resetPAsswordObj.email);
  console.log("token : ",this.resetPAsswordObj.emailToken);
  console.log("password : ",this.resetPAsswordObj.newPassword);
  console.log("co pass : ",this.resetPAsswordObj.confirmPassword);
 
    console.log("Error:", err); // Log the actual error for debugging
    Swal.fire('Error', err.message || 'Failed to reset password', 'error'); // Display the error message received from the API


    }
  });
  

    
   }else{
    ValidateForm.validateAllFormFileds(this.resetPasswordFrom);

     //alert("You form is invalid");

    Swal.fire('Create new  password', 'error')
   }
}

  
}
