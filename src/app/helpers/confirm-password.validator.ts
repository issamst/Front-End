import { FormGroup } from "@angular/forms";

export function  ConfirmPasswordvalidator(controlName :string,matchntrolName: string){
    return(formGroup:FormGroup)=>{


        const passwordControl=formGroup.controls[controlName];
        const confirmPasswordControl=formGroup.controls[matchntrolName];
        if(confirmPasswordControl.errors && confirmPasswordControl.errors['confirmPasswordvalidator']){
            return;

        }

        if(passwordControl.value !=confirmPasswordControl.value){
            confirmPasswordControl.setErrors({confirmPasswordvalidator:true})
        }else{
            confirmPasswordControl.setErrors(null)
        }

    }
}