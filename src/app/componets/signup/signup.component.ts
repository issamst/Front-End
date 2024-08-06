import { Component,OnInit} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from '../../services/auth.service';
import Swal from 'sweetalert2';
import ValidateForm from '../../helpers/validateform';
import { TitleServiceService } from '../../services/title-service.service';
import { HttpClient } from '@angular/common/http';
import { PlantService } from '../../services/plant.service';
import { DepartementService } from '../../services/departement.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  scannedID: string = ''; 
  Badge_id:string = ''; 
  type: string = "password";
  isText: boolean = false;
  eyeIcon: string = "fa-eye-slash";
  signupForm!: FormGroup;
  lang = 'en'; // default language
  dropdownOpen = false; // to track dropdown state
  isNotOperatorChecked: boolean = false;
  passwordStrengthMessage: string = '';
  public titles: any = [];
  public plantList: any = [];
  public departementList: any = [];
  badgeIdDetected: boolean = false; // Flag to indicate badge ID detection
  showModal: boolean = false; // Contrôle la visibilité du modal
  //showCheckmark: boolean=false;
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
   // private translateService: TranslateService, 
    private translate: TranslateService,
    private auth: AuthService, 
    private router: Router,
    private plantService :PlantService,
    private departementService :DepartementService
  ) { 
     this.translate.setDefaultLang(this.lang);
     this.translate.use(this.lang);
    }

  toggleNotOperator() {
    this.isNotOperatorChecked = !this.isNotOperatorChecked;
    if (this.isNotOperatorChecked) {
      // Clear the email field when "Not Operator" checkbox is checked
      this.signupForm.get('Email')?.reset('');
    }
  }

  ngOnInit(): void {
    this.titleService.getAllTitle().subscribe((res) => {
      this.titles = res;
  });

  this.plantService.getAllPlant().subscribe((res) => {
    this.plantList = res;
});

this.departementService.getAlldepartement().subscribe((res) => {
  this.departementList = res;
});
    this.signupForm = this.fb.group({
      TEID: ['', Validators.required],
      Badge_id: ['', Validators.required],
      Password: ['', Validators.required],
      FirstName: ['', Validators.required],
      LastName: ['', Validators.required],
      TitleID: ['', Validators.required],
      Email: ['', Validators.required],
      Phone: ['', Validators.required],
      PlantID: ['', Validators.required],
      DepartementID: ['', Validators.required]
    });

    this.lang = localStorage.getItem('lang') || 'en';

    // Subscribe to changes in the password field to check its strength
    this.signupForm.get('Password')?.valueChanges.subscribe(value => {
      this.passwordStrengthMessage = this.CheckPasswordStrength(value);
    });
  }

  hideShowPass() {
    this.isText = !this.isText;
    this.isText ? this.eyeIcon = " fa-eye" : this.eyeIcon = "fa-eye-slash";
    this.isText ? this.type = "text" : this.type = "password";
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
      case 'fr': return 'assets/flags/flag-france.png';
      case 'es': return 'assets/flags/spain-flag.png';
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
  // ChangeLang(lang: any) {
  //   const selectedLanguage = lang.target.value;
  //   localStorage.setItem('lang', selectedLanguage);
  //   this.translateService.use(selectedLanguage);
  // }
  isSubmitting = false;


  onSignup() {
      // Show the Swal loading spinner
     
  
      this.isSubmitting = true; // Disable the button
  
      const signUpObservable = this.isNotOperatorChecked
          ? this.auth.signUp(this.getSignUpDataWithoutEmail())
          : this.auth.signUp(this.signupForm.value);
  
      signUpObservable.subscribe({
          next: (res) => {
              // Ensure the spinner is shown for at least 4 seconds
             
                  this.isSubmitting = false; // Re-enable the button
                  Swal.close(); // Hide the loading spinner
                  this.signupForm.reset(); // Use Angular's Router.navigate method
                  this.router.navigate(['login']);
                  Swal.fire('Thank you...', res.message, 'success');
             
          },
          error: (err) => {
              // Ensure the spinner is shown for at least 4 seconds
             
                  this.isSubmitting = false; // Re-enable the button
                  Swal.close(); // Hide the loading spinner
                  Swal.fire('Error', err?.error.message, 'warning');
             
          }
      });
  }
  
  getSignUpDataWithoutEmail() {
      const { Email, ...formData } = this.signupForm.value;
      return formData;
  }
  
  private CheckPasswordStrength(password: string): string {
    let message = '';
    if (password.length < 8)
      message += " Minimum password length should be 8.\n";

    if (!(new RegExp("[a-z]").test(password) && new RegExp("[A-Z]").test(password) && new RegExp("[0-9]").test(password)))
      message += " Password should be Alphanumeric.\n";

    if (!(/[@!#$%^&*()_+{}\[\]:;|'\\,.\/~`\-=?]/.test(password)))
      message += " Password should contain special characters.\n";

    return message;
  }
  
  triggerScanner() {
    // Send HTTP GET request to start scanner
    this.http.get<any>('http://162.109.85.69:1211/api/User/process-badge').subscribe(
      response => {
        this.scannedID = response.message; // Update scanned ID
        this.badgeIdDetected = true; // Set flag for badge ID detection
        this.showModal = true; // Show the modal
  

        this.signupForm.patchValue({
          Badge_id: response.message
        });
        setTimeout(() => {
          this.hideModal(); // Hide the modal after 2 seconds
        }, 2000); // 2000 milliseconds = 2 seconds
        console.log('Scanned Badge ID:', response.message);
      },
      error => {
        console.error('Error starting scanner:', error);
      }
    );
  }
  
  openModal() {
    this.showModal = true; // Show the modal
  }

  hideModal() {
    this.showModal = false; // Hide the modal
  }




}
