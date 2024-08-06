import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import ValidateForm from '../../helpers/validateform';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from '../../services/auth.service';
import { NgToastService } from 'ng-angular-popup';
import Swal from 'sweetalert2';
import { UserStoreService } from '../../services/user-store.service';
import { ResetPasswordService } from '../../services/reset-password.service';
import { TitleServiceService } from '../../services/title-service.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  value: string | undefined;
  selectedMethod = 'teidPassword'; // Default login method

  scannedID: string = '';  // Variable to hold scanned ID

  type: string = "password";
  isText: boolean = false;
  eyeIcon: string = "fa-eye-slash ";
  loginForm!: FormGroup;
  Notemial: string = '';
  lang = 'en'; // default language
  dropdownOpen = false; // to track dropdown state
  ResetPasswordForm!: FormGroup;
  public resetPasswordEmail!: string;
  public isValidEmail!: boolean;
  isNotOperatorChecked: boolean = false;
  public teID: string = '';
  public isValidTeid!: boolean;
  isValidTEID: boolean = false;
  public titles: any = [];
  badgeIdDetected: boolean = false; // Flag to indicate badge ID detection
  showModal: boolean = false; // Controls the visibility of the modal
  langOptions = [
    { value: 'en', label: 'English' },
    { value: 'fr', label: 'French' },
    { value: 'es', label: 'Spanish' },
    { value: 'ar', label: 'Arabic' }
  ];
  constructor(
    private http: HttpClient,
    private titleService: TitleServiceService,
    private fb: FormBuilder,
    private translate: TranslateService,

    private auth: AuthService,
    private router: Router,
    private toast: NgToastService,
    private userStore: UserStoreService,
    private resetService: ResetPasswordService
  ) {
    this.translate.setDefaultLang(this.lang);
     this.translate.use(this.lang);
    }

  toggleNotOperator() {
    this.isNotOperatorChecked = !this.isNotOperatorChecked;
    if (this.isNotOperatorChecked) {
      // Clear the email field when "Not Operator" checkbox is checked
      this.ResetPasswordForm.get('Email')?.reset('');
    }
  }

  ngOnInit(): void {
    this.titleService.getAllTitle().subscribe((res) => {
      this.titles = res;
    });

    this.loginForm = this.fb.group({
      loginMethod: ['teidPassword', Validators.required],
      TEID: [''],
      Password: [''],
      Badge_id: ['']
    });

    this.lang = localStorage.getItem('lang') || 'en';

    this.ResetPasswordForm = this.fb.group({
      TEID: ['', Validators.required],
      Email: ['', Validators.required]
    });
  }

  hideShowPass() {
    this.isText = !this.isText;
    this.isText ? this.eyeIcon = " fa-eye" : this.eyeIcon = "fa-eye-slash"
    this.isText ? this.type = "text" : this.type = "password"
  }


  changeLang(event: Event, lang: string) {
    event.stopPropagation(); // Prevent the dropdown from toggling
    this.lang = lang;
    // Change the language using translate service
    this.translate.use(lang);
    // Close the dropdown
    this.dropdownOpen = false;
  }
  
  getFlag(lang: string): string {
    switch(lang) {

      case 'en': return 'assets/flags/uk-flag.png';
      case 'fr': return 'assets/flags/france.png';
      case 'es': return 'assets/flags/spain.png';
      case 'ar': return 'assets/flags/maroc.jpg';
      default: return '';
    }
  }
  getLangName(lang: string): string {
    const option = this.langOptions.find(opt => opt.value === lang);
    return option ? option.label : '';
  }
  
  toggleDropdown() {
    this.dropdownOpen = !this.dropdownOpen;
  }

  closeDropdown() {
    this.dropdownOpen = false;
  }
  isSubmitting = false; // Add this flag
  



  onLogin() {
      
      this.isSubmitting = true; // Disable the button
  
      if (this.selectedMethod === 'teidPassword') {
          this.loginForm.get('TEID')?.setValidators([Validators.required]);
          this.loginForm.get('Password')?.setValidators([Validators.required]);
          this.loginForm.get('Badge_id')?.clearValidators();
      } else if (this.selectedMethod === 'badgeId') {
          this.loginForm.get('TEID')?.clearValidators();
          this.loginForm.get('Password')?.clearValidators();
          this.loginForm.get('Badge_id')?.setValidators([Validators.required]);
      }
      this.loginForm.get('TEID')?.updateValueAndValidity();
      this.loginForm.get('Password')?.updateValueAndValidity();
      this.loginForm.get('Badge_id')?.updateValueAndValidity();
  
      if (this.loginForm.valid) {
          if (this.selectedMethod === 'teidPassword') {
              const teid = this.loginForm.get('TEID')?.value;
              const password = this.loginForm.get('Password')?.value;
              this.auth.login({ teid, password }).subscribe({
                  next: (res) => {
                      this.isSubmitting = false; // Re-enable the button
  
                      // Wait for 4 seconds before showing the next Swal message
                     
                      Swal.close(); // Hide the loading spinner
                      this.loginForm.reset();
                      this.auth.storeToken(res.accessToken);
                      this.auth.storeRefreshToken(res.refreshToken);
                      const tokenPayload = this.auth.decodedToken();
                      if (tokenPayload && tokenPayload.unique_name) {
                          this.userStore.setFullNameForStore(tokenPayload.unique_name);
                          this.userStore.setRoleForStore(tokenPayload.role);
                      }
                      if (res.messager === 'New Password') {
                          this.router.navigate(['NewPassword']);
                      } else {
                          Swal.fire('Done  !!','Welcome !!' ,'success');
                          this.router.navigate(['dashboard']);
                      }
                  },
                  error: (err) => {
                      this.isSubmitting = false; // Re-enable the button
  
                     
                     
                          Swal.close(); // Hide the loading spinner
                          Swal.fire('Error', err?.error.message, 'error');
                     
                  }
              });
          } else if (this.selectedMethod === 'badgeId') {
              const Badge_id = this.loginForm.get('Badge_id')?.value;
              this.auth.login({ Badge_id }).subscribe({
                  next: (res) => {
                      this.isSubmitting = false; // Re-enable the button
  
                      // Wait for 4 seconds before showing the next Swal message
                      
                          Swal.close(); // Hide the loading spinner
                          this.loginForm.reset();
                          this.auth.storeToken(res.accessToken);
                          this.auth.storeRefreshToken(res.refreshToken);
                          const tokenPayload = this.auth.decodedToken();
                          if (tokenPayload && tokenPayload.unique_name) {
                              this.userStore.setFullNameForStore(tokenPayload.unique_name);
                              this.userStore.setRoleForStore(tokenPayload.role);
                          }
                          Swal.fire('Thank you...', res.message, 'success').then(() => {
                              this.router.navigate(['dashboard']);
                          });
                     
                  },
                  error: (err) => {
                      this.isSubmitting = false; // Re-enable the button
                       Swal.fire('Error', err?.error.message, 'error');
                      
                  }
              });
          }
      } else {
          this.isSubmitting = false; // Re-enable the button
  
          // Hide the loading spinner and show error message
          Swal.fire('Form is invalid', 'Please provide the required information', 'error');
          
          ValidateForm.validateAllFormFileds(this.loginForm);
      }
  }
  
  

  checkValidEmail(event: string) {
    const value = event;
    const generalPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const specificPattern = /@gmail\.com$/;
    this.isValidEmail = generalPattern.test(value) && specificPattern.test(value);
    return this.isValidEmail;
  }

  checkTEValid(event: string) {
    const value = event;
    const pattern = /^te\d+$/i;
    this.isValidTEID = pattern.test(value);
    return this.isValidTEID;
  }

confirmToSend() {
  if (this.teID || this.resetPasswordEmail) {
    console.log("TEID:", this.teID);
    console.log("Email:", this.resetPasswordEmail);
    this.resetService.sendRestPasswordLink(this.ResetPasswordForm.value).subscribe({
      next: (res) => {
        Swal.fire(res.message, 'success');
        console.log(res.newPassword)
        this.resetPasswordEmail = "";
        this.teID = "";
        const btnRef = document.getElementById("closeBtn");
        btnRef?.click();
      },
      error: (err) => {
        Swal.fire(err?.error.message, 'error');
      }
    });
  } else {
    console.log("TEID and Email are not provided");
  }
}

  triggerScanner() {
    this.http.get<any>('http://162.109.85.69:1211/api/User/process-badge').subscribe(
      response => {
        this.scannedID = response.message;
        this.badgeIdDetected = true;
        this.showModal = true;
        setTimeout(() => {
          this.hideModal();
        }, 2000);
        console.log('Scanned Badge ID:', response.message);
      },
      error => {
        console.error('Error starting scanner:', error);
      }
    );
  }

  openModal() {
    this.showModal = true;
  }

  hideModal() {
    this.showModal = false;
  }
}
