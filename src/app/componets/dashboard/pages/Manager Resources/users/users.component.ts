import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { RoleService } from '../../../../../services/role.service';
import { ApiService } from '../../../../../services/api.service';
import { AuthService } from '../../../../../services/auth.service';
import { UserStoreService } from '../../../../../services/user-store.service';
import { TitleServiceService } from '../../../../../services/title-service.service';
import { PlantService } from '../../../../../services/plant.service';
import { DepartementService } from '../../../../../services/departement.service';
import * as XLSX from 'xlsx';
import { HttpClient } from '@angular/common/http';
import { FormControl } from '@angular/forms';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrl: './users.component.css'
})
export class UsersComponent implements OnInit {
  statusOptions: { label: string, value: string }[] = [
    { label: 'Pending', value: 'pending' },
    { label: 'Active', value: 'active' }
  ];

  first = 0;
  displayModal: boolean = false;
  displayUpdateModal: boolean = false;
  displayViewModal: boolean = false;
  rows = 10;
  loading: boolean = true;
  searchValue: string | undefined;
  activityValues: number[] = [0, 100];
  searchText: string = ''; 


  sortOrder: string = 'asc';
  userId: number = 0;
  selectedUser: any = null;
  showUpdateUserModal: boolean = false;
  editingUserId: number | null = null;
  editUserForm!: FormGroup;
  signupForm!: FormGroup;
  AddNewForm!: FormGroup;
  UpdateUsers!: FormGroup;
  ViewUsers!: FormGroup;
  currentPageRole: number = 1;
  currentPageUser: number = 1;
  rolesPerPage: number = 5; 
  UserPerPage: number = 9; 
  public user: any = [];
  users:any=[];
  roles: any[] = [];
  titles: any[] = []; 

  currentPage: number = 1;
  titlesPerPage: number = 5; // Number of titles to display per page
  public fullName: string = '';
  public searchtext: string = '';
  public searchtextPlant: string = '';
  public searchtextDepartement: string = '';
  public role!: string;
  titleForm!: FormGroup;
  RoleForm!: FormGroup;
  userForm!: FormGroup;
  selectedTitleId: number | null = null;
  selectedPlantId: number | null = null;
  selectedDepartementId: number | null = null;
  selectedRoleId: number | null = null;
  searchTitle: string = '';
  selectedUserId: any = null;
  UUserId:any=null;
  isFormDisabled: boolean = false;
  totalSignupsYesterday: number = 0;
  totalSignupsToday: number = 0;
  totalStatus: number = 0;
  successMessage!: string;
  isAscendingOrder: boolean = true; // Initially set to true for ascending order
  sortedColumn: string = '';
  sortingColumn: string = '';
  sortingOrder: string = 'asc';
  sortBy: string = '';
  sortDirection: number = 1;
  isUserOverlayOpen: boolean = false;
  isimportexportopen: boolean = false;
  showColumns = {
    teid: true,
    Badge_id: false,
    firstName: true,
    lastName: true,
    phone: true,
    role: true,
    job: false,
    email: false,
    plant: true,
    department: true,
    status: true,
    timeOpen: false,
    registerTime: false,
    timeChangePassword: false,
    requestPassword: true
};  
public plantList: any = [];
public departementList: any = [];
columns = ['TE ID','Badge ID', 'Full Name', 'Phone', 'Role', 'Job Title', 'Email', 'Plant', 'Department'];
data = [ ];
searchTerm: string = '';

getFilteredUsers() {
  return this.getDisplayedUsers().filter(user => user.commenterDelete !== null);
}
getFilteredUsersAtive() {
  return this.getDisplayedUsers().filter(user => user.status == "active");
}
getFilteredUsersPending() {
  return this.getDisplayedUsers().filter(user => user.status == "pending");
}
getFilteredUsersRequest() {
  return this.getDisplayedUsers().filter(user => user.request === "pending" );    //|| user.request === "done" || user.request === null
}

  constructor(
    private dialog: MatDialog,
    private roleService: RoleService,
    private fb: FormBuilder,
    private api: ApiService,
    private auth: AuthService,
    private userStore: UserStoreService,
    private titleService: TitleServiceService,
    private router: Router ,
    private plantService :PlantService,
    private departementService :DepartementService,
    private http: HttpClient
  ) {
    this.UpdateUsers = this.fb.group({
      TEID: ['', Validators.required],
      Badge_id:[''],

      FirstName: ['', Validators.required],
      LastName: ['', Validators.required],
      TitleID: ['', Validators.required],
      Email: ['', Validators.required],
      Phone: ['', Validators.required],
      PlantID: ['', Validators.required],
      DepartementID: ['', Validators.required],
      RoleID:['',Validators.required],
      Status:['',Validators.required]
    });
    this.signupForm = this.fb.group({
      TEID: ['', Validators.required],
      Badge_id:[''],

      Password: ['', Validators.required],
      FirstName: ['', Validators.required],
      LastName: ['', Validators.required],
      TitleID: ['', Validators.required],
      Email: ['', Validators.required],
      Phone: ['', Validators.required],
      PlantID: ['', Validators.required],
      DepartementID: ['', Validators.required],
      RoleID:['',Validators.required],
      Status:['',Validators.required]
    });
  }



  searchControl = new FormControl('');
  public searchtextplantadd: string = '';
  public searchtextplantupdate: string = '';

  public searchtextdepartmentadd: string = '';
  public searchtextdepartmentupdate: string = '';
  
  public searchtextjobadd: string = '';
  public searchtextjobupdate: string = '';

  public searchtexttitleadd: string = '';
  public searchtexttitleupdate: string = '';



  // --------------------------------------------------------------------

  clear(dt: any): void {
    dt.clear();
    this.searchText = '';
    this.loadUsers();

}
globalSearch() {
  const searchTerm = this.searchText.toLowerCase();

  this.users = this.users.filter((user: any) => {
    return Object.values(user).some((value: any) =>
      String(user.buildingID.buildingID).toLowerCase().includes(searchTerm) ||
      String(user.name_Departement.name_Departement).toLowerCase().includes(searchTerm) ||
      String(user.name_Title.name_Title).toLowerCase().includes(searchTerm) ||
      String(user.name_Role.name_Role).toLowerCase().includes(searchTerm) ||

      String(value).toLowerCase().includes(searchTerm)
    );
  });
}


next() {
  this.first = this.first + this.rows;
}

prev() {
  this.first = this.first - this.rows;
}

reset() {
  this.first = 0;
}

pageChange(event: { first: number; rows: number; }) {
  this.first = event.first;
  this.rows = event.rows;
}

isLastPage(): boolean {
  return this.users ? this.first === this.users.length - this.rows : true;
}

isFirstPage(): boolean {
  return this.users ? this.first === 0 : true;
}




// plant
  selectedPlantIds: number[] = [];
  selectedPlants: any[] = [];
  
  getSelectedPlantsText() {
    return this.selectedPlants.length > 0 && this.selectedPlantIds.length > 0
      ? this.selectedPlants.map(plant => plant.buildingID + ' (' + plant.sapBuildingNumber + ')').join(', ') 
      : 'Choose your plants';
  }
  
  
  isPlantSelected(plant: any): boolean {
    // Check if there are selected plants
    if (this.selectedPlants.length > 0) {
      return this.selectedPlantIds.includes(plant.id);
    }
    return false; // Return false if there are no selected plants
  }
  toggleSelection(plant: any) {
    // Check if the plant is already selected
    const isSelected = this.isPlantSelected(plant);
    
    if (isSelected) {
      // If the plant is already selected, clear the selection
      this.selectedPlantIds = [];
      this.selectedPlants = [];
    } else {
      // If the plant is not selected, select it
      this.selectedPlantIds = [plant.id];
      this.selectedPlants = [plant];
    }
    
    this.signupForm.patchValue({
      PlantID: this.selectedPlantIds
    });

    this.onDepartementIDSelected(plant.id);
  }
  DepartementById:any=[];
  onDepartementIDSelected(Departement:any) {
    
  
    if (Departement) {
      this.departementService.getDepartementByPlant(Departement).subscribe((res) => {
        this.DepartementById = res;
      });
    }
  }
// Departement
selectedDepartementIds: number[] = [];
selectedDepartements: any[] = [];

getSelectedDepartementsText() {
  return this.selectedDepartements.length > 0 && this.selectedDepartementIds.length > 0
    ? this.selectedDepartements.map(Departement => Departement.name_Departement).join(', ') 
    : 'Choose your Departments';
}


isDepartementSelected(Departement: any): boolean {
  // Check if there are selected plants
  if (this.selectedDepartements.length > 0) {
    return this.selectedDepartementIds.includes(Departement.id);
  }
  return false; // Return false if there are no selected plants
}
toggleSelectionDepartement(Departement: any) {
  
  const isSelectedDepartement = this.isDepartementSelected(Departement);
  
  if (isSelectedDepartement) {
    // If the plant is already selected, clear the selection
    this.selectedDepartementIds = [];
    this.selectedDepartements = [];
  } else {
    // If the plant is not selected, select it
    this.selectedDepartementIds = [Departement.id];
    this.selectedDepartements = [Departement];
  }
  
  this.signupForm.patchValue({
    DepartementID: this.selectedDepartementIds
  });
  
}







// title
selectedtitleIds: number[] = [];
selectedtitles: any[] = [];

getSelectedtitlesText() {
  return this.selectedtitles.length > 0 && this.selectedtitleIds.length > 0
    ? this.selectedtitles.map(title => title.name_Title ).join(', ') 
    : 'Choose your Jobs';
}


istitleSelected(title: any): boolean {
  // Check if there are selected plants
  if (this.selectedtitles.length > 0) {
    return this.selectedtitleIds.includes(title.id);
  }
  return false; // Return false if there are no selected plants
}
toggleSelectiontitle(title: any) {
  
  const isSelectedtitle = this.istitleSelected(title);
  
  if (isSelectedtitle) {
    // If the plant is already selected, clear the selection
    this.selectedtitleIds = [];
    this.selectedtitles = [];
  } else {
    // If the plant is not selected, select it
    this.selectedtitleIds = [title.id];
    this.selectedtitles = [title];
  }
  
  this.signupForm.patchValue({
    TitleID: this.selectedtitleIds
  });
  
}










// Roles
selectedroleIds: number[] = [];
selectedroles: any[] = [];

getSelectedrolesText() {
  return this.selectedroles.length > 0 && this.selectedroleIds.length > 0
    ? this.selectedroles.map(role => role.name_Role ).join(', ') 
    : 'Choose your Roles';
}


isroleSelected(role: any): boolean {
  // Check if there are selected plants
  if (this.selectedroles.length > 0) {
    return this.selectedroleIds.includes(role.id);
  }
  return false; // Return false if there are no selected plants
}
toggleSelectionrole(role: any) {
  
  const isSelectedrole = this.isroleSelected(role);
  
  if (isSelectedrole) {
    // If the plant is already selected, clear the selection
    this.selectedroleIds = [];
    this.selectedroles = [];
  } else {
    // If the plant is not selected, select it
    this.selectedroleIds = [role.id];
    this.selectedroles = [role];
  }
  
  this.signupForm.patchValue({
    RoleID: this.selectedroleIds
  });
  
}






















isimportexportopenaddplant: boolean = false;
isimportexportopenupdateplant: boolean = false;

isimportexportopenadddepartement: boolean = false;
isimportexportopenupdatedepartement: boolean = false;


isimportexportopenaddrole: boolean = false;
isimportexportopenupdatrole: boolean = false;

isimportexportopenaddtitle: boolean = false;
isimportexportopenupdatetitle: boolean = false;



importexportopenAddPlant() {
  this.isimportexportopenaddplant = !this.isimportexportopenaddplant;
}
importexportopenAddDepartment() {
  this.isimportexportopenadddepartement = !this.isimportexportopenadddepartement;
}

importexportopenUpdatePlant() {
  this.isimportexportopenupdateplant = !this.isimportexportopenupdateplant;
}
importexportopenUpdaetdepartement() {
  this.isimportexportopenupdatedepartement = !this.isimportexportopenupdatedepartement;
}


importexportopenAddRole() {
  this.isimportexportopenaddrole = !this.isimportexportopenaddrole;
}

importexportopenUpdateRole() {
  this.isimportexportopenupdatrole = !this.isimportexportopenupdatrole;
}
importexportopenAddtitle() {
  this.isimportexportopenaddtitle = !this.isimportexportopenaddtitle;
}

importexportopenUpdatetitle() {
  this.isimportexportopenupdatetitle = !this.isimportexportopenupdatetitle;
}

isActive: boolean = false;
isActiveD: boolean = false;
isActiveC: boolean = false;

changeButtonColor() {
  this.isActive = !this.isActive;
}

changeButtonColorD() {
  this.isActiveD = !this.isActiveD;
}
changeButtonColorC() {
  this.isActiveC = !this.isActiveC;
}








  // --------------------------------------------------------------------

  onClose() {
    this.isActive =false;
    this.isActiveD =false;
    this.isActiveC =false;
    this.selectedPlantIds = [];
    this.selectedPlants = [];
    this.DepartementById = [];
    this.selectedDepartementIds = [];
    this.selectedDepartements = [];
    this.selectedtitleIds = [];
    this.selectedtitles = [];
    this.selectedroleIds = [];
    this.selectedroles = [];
  }
  onClear() {
    this.signupForm.reset();
    this.UpdateUsers.reset();
    this.selectedPlantIds=[];
    this.selectedDepartementIds=[];
    this.selectedtitleIds=[];
    this.selectedroleIds=[];
    this.isActive =false;
    this.isActiveD =false;
    this.isActiveC =false;
    this.selectedPlantIds = [];
    this.selectedPlants = [];
    this.DepartementById = [];
    this.selectedDepartementIds = [];
    this.selectedDepartements = [];
    this.selectedtitleIds = [];
    this.selectedtitles = [];
    this.selectedroleIds = [];
    this.selectedroles = [];
  }
  onSignup() {
  
    if (this.signupForm.valid) { 
     
    const { TEID,Badge_id, Password, FirstName ,LastName,TitleID,Email,Phone,PlantID,DepartementID,RoleID,Status} = this.signupForm.value;
    const formData = { 
      TEID:TEID,
      Badge_id:Badge_id,
      Password:Password,
      FirstName:FirstName,
      LastName:LastName,
      TitleID:TitleID,
      Email:Email,
      Phone:Phone,
      PlantID:PlantID,
      DepartementID: DepartementID?.id, // Extracting the id from DepartementID
      RoleID:RoleID,
      Status: Status.value // Extracting the value from Status
    };

    // formData.PlantID=formData.PlantID.building_ID

    console.log("formData being sent:", formData);

      this.auth.Addnew(formData).subscribe({
        next: (res) => {
          Swal.fire('Done', res.message, 'success').then((res)=>{
            window.location.reload();
          });
          // Optionally, you can reset the form after successful signup
          this.signupForm.reset();
         
          const modal = document.getElementById("myModal");
          if (modal != null) {
            modal.classList.remove('show');
            modal.style.display = 'none';
          }
        },
        error: (err) => {
          console.error('Error:', err);
          Swal.fire('Error', 'An error occurred while signing up', 'error');
        },
      });
    } else {
      // Show validation error if the signup form is invalid
      Swal.fire('Error', 'Please provide valid signup information', 'warning');
    }
  }
  Export() {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You will export this user!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, sure!',
      cancelButtonText: 'No, keep it'
    }).then((result) => {
      if (result.isConfirmed) {
        this.auth.getExportUser().subscribe({
          next: (res) => {
            const blob = new Blob([res], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'Users.xlsx';
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
          },
          error: (err) => {
            console.error('Export error:', err);
            Swal.fire('Error', 'An error occurred while exporting users', 'error');
          }
        });
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire('Cancelled', 'User export cancelled', 'info');
      }
    });
  }
  
  Import() {
    const style = document.createElement('style');
    style.textContent = `
        color :#3944BC;
        `;
    // Append the style to the head of the document
    document.head.appendChild(style);

    Swal.fire({
        title: 'Are you sure to import?',
        text: 'You will import the Excel file!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, import it!',
        cancelButtonText: 'No, keep it'
    }).then((result) => {
        if (result.isConfirmed) {
            Swal.fire({
                title: 'Please import an Excel file (.xlsx)',
                input: 'file',
                inputAttributes: {
                    accept: '.xlsx',
                    'aria-label': 'Upload your Excel file'
                },
                showCancelButton: true,
                confirmButtonText: 'Submit',
                cancelButtonText: 'Cancel',
                inputValidator: (file) => {
                    if (!file) {
                        return 'You need to select a file!';                        
                    } else {
                        console.log('Imported file:', file);
                        return null;
                    }
                },
                customClass: {
                    input: 'swal2-file-input',
                    cancelButton: 'swal2-cancel-button',
                    confirmButton: 'swal2-confirm-button'
                }
            }).then((fileResult) => {
                if (fileResult.isConfirmed) {
                    const file = fileResult.value;
                    // Here you can handle the imported file
                    console.log('Imported file:');

                    // Call importUser function from AuthService and pass the file
                    this.auth.importUser(file).subscribe({
                        next: (res) => {
                            // console.log('Import response:', res);
                            // const blob = new Blob([res], { type: 'application/octet-stream' });
                            // const url = window.URL.createObjectURL(blob);
                            // const a = document.createElement('a');
                            // a.href = url;
                            // document.body.appendChild(a);
                            // a.click();
                            // window.URL.revokeObjectURL(url);
                            Swal.fire('Imported!', 'User import done!', 'success').then((res)=>{
                              window.location.reload();
                            });
                        },
                        error: (err) => {
                            console.error('Import error:', err);
                            Swal.fire('Error', 'An error occurred while importing users', 'error');
                        }
                    });
                }
            });
        } else if (result.dismiss === Swal.DismissReason.cancel) {
            Swal.fire('Cancelled', 'File import cancelled', 'info');
        }
    });
}

  

 

  downloadExcel(): void {
    // Convert data to Excel format
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.data, { header: this.columns });
    const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };

    // Save the Excel file
    XLSX.writeFile(workbook, 'User.xlsx');
  }

  toggleDropdown() {
    this.isUserOverlayOpen = !this.isUserOverlayOpen;
  }
  importexportopen() {
    this.isimportexportopen = !this.isimportexportopen;
  }
ngOnInit() {

    this.loadUsers();

    
    this.searchControl.valueChanges.pipe(
      debounceTime(300)  // Optional: to add a delay before filtering
    ).subscribe(searchTerm => {
      this.plantList(searchTerm ?? ''); // Provide a default value if searchTerm is null
    });

  

    this.ViewUsers = this.fb.group({
      TEID: [{ value: '', disabled: true }, Validators.required],
      Badge_id:[{ value: '', disabled: true }],
      Password: [{ value: '', disabled: true }, Validators.required],
      FirstName: [{ value: '', disabled: true }, Validators.required],
      LastName: [{ value: '', disabled: true }, Validators.required],
      TitleID: [{ value: '', disabled: true }, Validators.required],
      Email: [{ value: '', disabled: true }, Validators.required],
      Phone: [{ value: '', disabled: true }, Validators.required],
      PlantID: [{ value: '', disabled: true }, Validators.required],
      DepartementID: [{ value: '', disabled: true }, Validators.required],
      RoleID:[{ value: '', disabled: true }, Validators.required],
      Status:[{ value: '', disabled: true }, Validators.required],
      commenterDelete:['',Validators.required],
    });
    

    this.titleForm = this.fb.group({
      Name_Title: ['', Validators.required],
    });
    this.RoleForm= this.fb.group({
      Name_Role: ['', Validators.required],
    });
  

    this.calculateSignupsYesterday();
    this.titleService.getAllTitle().subscribe((res) => {
      this.titles = res;
    });
    
    
    
   
  
    this.userStore.getFullNameFromStore().subscribe((val) => {
      const fullNameFromToken = this.auth.getfullNameFromToken();
      this.fullName = val || fullNameFromToken;
    });

    this.userStore.getRoleFromStore().subscribe((val) => {
      const roleFromToken = this.auth.getRoleFromToken();
      this.role = val || roleFromToken;
    });
    this.totalStatus = this.users.length;
  }

loadUsers(){
  this.api.getUsers().subscribe((res) => {
    this.loading = true;

    this.users = res;
    this.loading = false;

  });

  this.plantService.getAllPlant().subscribe((res) => {
    this.plantList = res;
  });

  this.departementService.getAlldepartement().subscribe((res) => {
    this.departementList = res;
  });
  this.roleService.getAllRoles().subscribe((res)=>{
    this.roles=res;
  });
}
  sortData(columnName: string) {
    console.log("columnName   : => ",columnName);
    if (this.sortBy === columnName) {
      // Reverse sort direction if same column is clicked again
      this.sortDirection = this.sortDirection === 1 ? -1 : 1;
    } else {
      // Set new column to sort and reset sort direction
      this.sortBy = columnName;
      this.sortDirection = 1;
    }

    // Sort the data based on the selected column and direction
    this.users.sort((a:any, b:any) => {
      if (a[columnName] < b[columnName]) return -1 * this.sortDirection;
      if (a[columnName] > b[columnName]) return 1 * this.sortDirection;
      return 0;
    });
  }
  
  
  getForgotPassworPending(): number {
    const pendingUsers = this.users.filter((user: any) => user.request === 'pending');
    return pendingUsers.length ;
  }

  // Function to calculate the percentage of users with 'done' status
  getForgotPasswordone(): number {
    const doneUsers = this.users.filter((user: any) => user.request === 'active');
    return doneUsers.length ;
  }

  // Function to get the total number of users
  totalForgotPassword(): number {
    return this.users.length;
  }
  TotalStatus():number{
    return this.users.length;
  }
  getStatusPending(): number {
    // Logic to calculate the percentage of pending status
    // For example:
    const pendingUsers = this.users.filter((user: any) => user.status === 'pending');
    return pendingUsers.length;
  }
  getStatusDone(): number {
    // Logic to calculate the percentage of done status
    // For example:
    const doneUsers = this.users.filter((user: any) => user.status === 'active');
    return doneUsers.length ;
  }
  getPercentageChangeToday() {
    const today = new Date();
    let signupsToday = 0; 
    
    this.users.forEach((user: User) => {
        if (user.registerTime) {
            const registrationDate = new Date(user.registerTime);
            if (
                registrationDate.getDate() === today.getDate() &&
                registrationDate.getMonth() === today.getMonth() &&
                registrationDate.getFullYear() === today.getFullYear()
            ) {
                
                signupsToday++;
            }
        }
    });
    
    return signupsToday;
}
getArrowIcon(percentageChange: number): string {
  // Check if the percentage change is positive or negative
  if (percentageChange > 0) {
      return "fas fa-arrow-up text-success"; // Green color for arrow up icon
  } else {
      return "fas fa-arrow-down text-danger"; // Red color for arrow down icon
  }
}


getPercentageChangeWeek() {
  const Week = new Date();
  Week.setDate(Week.getDate() - 7); 
  
  let signupsWeek = 0; 
  
  this.users.forEach((user: User) => {
      if (user.registerTime) {
          const registrationDate = new Date(user.registerTime);
          if (
              registrationDate.getDate() === Week.getDate() &&
              registrationDate.getMonth() === Week.getMonth() &&
              registrationDate.getFullYear() === Week.getFullYear()
          ) {
              // Increment the count if the registration date matches yesterday's date
              signupsWeek++;
          }
      }
  });
  
  return signupsWeek;
}
getPercentageChangeMonths() {
  const Months = new Date();
  Months.setDate(Months.getDate() - 30); 
  
  let signupsMonths = 0; 
  
  this.users.forEach((user: User) => {
      if (user.registerTime) {
          const registrationDate = new Date(user.registerTime);
          if (
              registrationDate.getDate() === Months.getDate() &&
              registrationDate.getMonth() === Months.getMonth() &&
              registrationDate.getFullYear() === Months.getFullYear()
          ) {
              // Increment the count if the registration date matches yesterday's date
              signupsMonths++;
          }
      }
  });
  
  return signupsMonths;
}
  toggleFormControls() {
    this.isFormDisabled = !this.isFormDisabled;
  }
  setSelectedUserId(userId: string | number) {
    this.selectedUserId = userId;
  }
  get totalTitles(): number {
    return this.titles.length;
  }

  get totalPages(): number {
    return Math.ceil(this.totalTitles / this.titlesPerPage);
  }

  get pages(): number[] {
    const pagesArray = [];
    for (let i = 1; i <= this.totalPages; i++) {
      pagesArray.push(i);
    }
    return pagesArray;
  }

  changePage(page: number): void {
    this.currentPage = page;
  }


  request(id: number) {
    console.log("id :", id)
    this.auth.Request(id).subscribe({
        next: (res) => {
            Swal.fire({
                title: 'Request created successfully',
                html: `
                    <style>
                        .swal2-popup {
                            padding: 20px;
                        }
                        .copy-text {
                            display: flex;
                            align-items: center;
                            gap: 10px; /* Adds space between input and button */
                            background: #fff;
                            border: 1px solid #ddd;
                            border-radius: 10px;
                            padding: 10px;
                        }
                        .copy-text input.text {
                            flex: 1;
                            padding: 10px;
                            font-size: 18px;
                            color: #555;
                            border: none;
                            outline: none;
                            font-weight: bold;
                            font-size: 24px;
                        }
                        .copy-text button {
                            padding: 10px;
                            background: #5784f5;
                            color: #fff;
                            font-size: 18px;
                            border: none;
                            outline: none;
                            border-radius: 10px;
                            cursor: pointer;
                        }
                        .copy-text button:active {
                            background: #809ce2;
                        }
                        .copy-text button:before {
                            content: "Copied";
                            position: absolute;
                            top: -45px;
                            right: 0px;
                            background: #5c81dc;
                            padding: 8px 10px;
                            border-radius: 20px;
                            font-size: 15px;
                            display: none;
                        }
                        .copy-text button:after {
                            content: "";
                            position: absolute;
                            top: -20px;
                            right: 25px;
                            width: 10px;
                            height: 10px;
                            background: #5c81dc;
                            transform: rotate(45deg);
                            display: none;
                        }
                        .copy-text.active button:before,
                        .copy-text.active button:after {
                            display: block;
                        }
                    </style>
                    <div class="container" style="display: flex; flex-direction: column; align-items: center;">
                        <div class="copy-text">
                            <input type="text" class="text" id="swal-input" value="${res.message}" />
                            <button id="copy-button"><i class="fa fa-clone"></i></button>
                        </div>
                    </div>
                `,
                showCancelButton: true,
                confirmButtonText: 'Submit',
                cancelButtonText: 'Cancel',
                didOpen: () => {
                    const copyButton = document.getElementById('copy-button') as HTMLElement | null;
                    if (copyButton) {
                        copyButton.addEventListener('click', () => {
                            const inputField = document.getElementById('swal-input') as HTMLInputElement | null;
                            if (inputField) {
                                navigator.clipboard.writeText(inputField.value).then(() => {
                                    Swal.fire('Copied!', 'The text has been copied to clipboard.', 'success');
                                }).catch(err => {
                                    Swal.fire('Error', 'Failed to copy text to clipboard.', 'error');
                                });
                            }
                        });
                    }
                }
            }).then((res) => {
                if (res.isConfirmed) {
                    window.location.reload();
                }
            });
        },
        error: (error) => {
            // Handle error response
            Swal.fire('Error', error.error.Message || 'An error occurred', 'error');
        },
    });
}




  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }

  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  getDisplayedTitles(): any[] {
    const startIndex = (this.currentPage - 1) * this.titlesPerPage;
    const endIndex = Math.min(startIndex + this.titlesPerPage, this.totalTitles);
    return this.titles.slice(startIndex, endIndex);
  }
  
  changePageRole(page: number): void {
    this.currentPageRole = page;
  }
  changePageUser(page: number): void {
    this.currentPageUser = page;
  }
  nextPageRole(): void {
    if (this.currentPageRole < this.totalPagesRole) {
      this.currentPageRole++;
    }
  }
  nextPageUser(): void {
    if (this.currentPageUser < this.totalPagesUser) {
      this.currentPageUser++;
    }
  }
  prevPageRole(): void {
    if (this.currentPageRole > 1) {
      this.currentPageRole--;
    }
  }
  prevPageUser(): void {
    if (this.currentPageUser > 1) {
      this.currentPageUser--;
    }
  }
  
  getDisplayedRoles(): any[] {
    const startIndex = (this.currentPageRole - 1) * this.rolesPerPage;
    const endIndex = Math.min(startIndex + this.rolesPerPage, this.roles.length);
    return this.roles.slice(startIndex, endIndex);
  }
  getDisplayedUsers(): any[] {
    const startIndex = (this.currentPageUser - 1) * this.UserPerPage;
    const endIndex = Math.min(startIndex + this.UserPerPage, this.users.length);
    return this.users.slice(startIndex, endIndex);
  }
  
  get totalRoles(): number {
    return this.roles.length;
  }
  get totalUses():number{
    return this.users.length;
  }
  
  get totalPagesRole(): number {
    return Math.ceil(this.totalRoles / this.rolesPerPage);
  }
  get totalPagesUser(): number {
    return Math.ceil(this.totalUses / this.UserPerPage);
   
  }
  get pagesRole(): number[] {
    const pagesArray = [];
    for (let i = 1; i <= this.totalPagesRole; i++) {
      pagesArray.push(i);
    }
    return pagesArray;
  }
  get pagesUser(): number[] {
    const pagesArray = [];
    for (let i = 1; i <= this.totalPagesUser; i++) {
      pagesArray.push(i);
    }
    return pagesArray;
  }
 
  

  UpdateUser(userId: number, updatedUserData: any) {
    
    if (userId !== null && this.UpdateUsers.valid) {
      // const selectedPlants = this.selectedPlants[0]?.id;
      // const selectedDepartements = this.selectedDepartements[0]?.id;
      // const selectedtitles = this.selectedtitles[0]?.id;
      // const selectedroles = this.selectedroles[0]?.id;

     
      // this.UpdateUsers.patchValue({
         
      //   PlantID:selectedPlants,
      //   DepartementID:selectedDepartements,
      //   TitleID:selectedtitles,
      //   RoleID:selectedroles
      // });

    const { TEID,Badge_id, FirstName ,LastName,TitleID,Email,Phone,PlantID,DepartementID,RoleID,Status} = this.UpdateUsers.value;
    const formData = { 
      TEID:TEID,
      Badge_id:Badge_id,
      FirstName:FirstName,
      LastName:LastName,
      TitleID:TitleID,
      Email:Email,
      Phone:Phone,
      PlantID:PlantID,
      DepartementID:DepartementID,
      RoleID:RoleID,
      Status: Status
    };

    console.log("formData being sent:", formData);
           this.auth.updateUser(userId, formData).subscribe({
        next :(response) => {
              Swal.fire('Success', 'User updated successfully:'+response, 'success').then((res)=>{
                window.location.reload();
              });
        },
       error : (error) => {
         Swal.fire('Error', 'Error updating user:', 'error');

         this.UpdateUsers.reset();
       
         const modal = document.getElementById("myModal");
         if (modal != null) {
           modal.classList.remove('show');
           modal.style.display = 'none';
         }

                  }
      });
    } else {
      // Handle null userId or form validation errors
      console.error('User ID is null or form is invalid');
        Swal.fire('Error', 'An error occurred while deleting the title', 'error');

      
    }
  }

  openModelUpdate(userId: any) {
    this.displayUpdateModal = true;

    this.selectedUserId = userId;  
   
  console.log("selection id :", this.selectedUserId );
  console.log("user  id :", userId );
    // Get the modal element
    const modal = document.getElementById("updateUser");
    console.log(userId);
    if (modal != null) {
      
        // Set the user ID in the modal
        // For example, if you have an input field with id="userId" in the modal, you can set its value
        const userIdInput = modal.querySelector('#userId');
        if (userIdInput != null) {
            userIdInput.setAttribute('value', userId);
        }
  
        // Show the modal
        modal.classList.add('show');
        modal.style.display = 'block';
        
        // Add event listeners to close the modal
        const modalCloseButton = modal.querySelector('.modal-header .btn-close');
        if (modalCloseButton != null) {
            modalCloseButton.addEventListener('click', () => {
                modal.classList.remove('show');
                modal.style.display = 'none';
            });
        }
  
        const closeButton = modal.querySelector('.modal-footer .btn-danger');
        if (closeButton != null) {
            closeButton.addEventListener('click', () => {
                modal.classList.remove('show');
                modal.style.display = 'none';
            });
        }
  
        const modalBackdrop = modal.querySelector('.modal-backdrop');
        if (modalBackdrop != null) {
            modalBackdrop.addEventListener('click', () => {
                modal.classList.remove('show');
                modal.style.display = 'none';
            });
        }
    }
  }
  
  openModelView(userId: any) {
    this.displayViewModal = true;

    this.selectedUserId = userId;  
   
  console.log("selection id :", this.selectedUserId );
  console.log("user  id :", userId );
    // Get the modal element
    const modal = document.getElementById("ViewUser");
    console.log(userId);
    if (modal != null) {
      
        // Set the user ID in the modal
        // For example, if you have an input field with id="userId" in the modal, you can set its value
        const userIdInput = modal.querySelector('#ViewUser');
        if (userIdInput != null) {
            userIdInput.setAttribute('value', userId);
        }
  
        // Show the modal
        modal.classList.add('show');
        modal.style.display = 'block';
        
        // Add event listeners to close the modal
        const modalCloseButton = modal.querySelector('.modal-header .btn-close');
        if (modalCloseButton != null) {
            modalCloseButton.addEventListener('click', () => {
                modal.classList.remove('show');
                modal.style.display = 'none';
            });
        }
  
        const closeButton = modal.querySelector('.modal-footer .btn-danger');
        if (closeButton != null) {
            closeButton.addEventListener('click', () => {
                modal.classList.remove('show');
                modal.style.display = 'none';
            });
        }
  
        const modalBackdrop = modal.querySelector('.modal-backdrop');
        if (modalBackdrop != null) {
            modalBackdrop.addEventListener('click', () => {
                modal.classList.remove('show');
                modal.style.display = 'none';
            });
        }
    }
  }
  
  openModelImportExcelUser() {
   
    
    // Get the modal element
    const modal = document.getElementById("ImportExcelUser");
   
    if (modal != null) {
      
        // Set the user ID in the modal
        // For example, if you have an input field with id="userId" in the modal, you can set its value
        const userIdInput = modal.querySelector('#ImportExcelUser');
        
        // Show the modal
        modal.classList.add('show');
        modal.style.display = 'block';
        
        // Add event listeners to close the modal
        const modalCloseButton = modal.querySelector('.modal-header .btn-close');
        if (modalCloseButton != null) {
            modalCloseButton.addEventListener('click', () => {
                modal.classList.remove('show');
                modal.style.display = 'none';
            });
        }
  
        const closeButton = modal.querySelector('.modal-footer .btn-danger');
        if (closeButton != null) {
            closeButton.addEventListener('click', () => {
                modal.classList.remove('show');
                modal.style.display = 'none';
            });
        }
  
        const modalBackdrop = modal.querySelector('.modal-backdrop');
        if (modalBackdrop != null) {
            modalBackdrop.addEventListener('click', () => {
                modal.classList.remove('show');
                modal.style.display = 'none';
            });
        }
    }
  }

openModel() {
  this.displayModal = true;

  this.DepartementById=[];

  const modal = document.getElementById("myModal");
  if (modal != null) {
    modal.classList.add('show'); // Add 'show' class to display the modal
    modal.style.display = 'block';
  }

  // Add event listener to the close button
  const closeButton = document.querySelector('.modal-footer .btn-danger');
  if (closeButton != null) {
    closeButton.addEventListener('click', () => {
      if (modal != null) {
        modal.classList.remove('show'); // Remove 'show' class to hide the modal
        modal.style.display = 'none';
      }
    });
  }

  // Add event listener to the modal backdrop to close the modal when clicked outside the modal
  const modalBackdrop = document.querySelector('.modal-backdrop');
  if (modalBackdrop != null) {
    modalBackdrop.addEventListener('click', () => {
      if (modal != null) {
        modal.classList.remove('show'); // Remove 'show' class to hide the modal
        modal.style.display = 'none';
      }
    });
  }

  // Add event listener to the close button in the modal header
  const modalCloseButton = document.querySelector('.modal-header .btn-close');
  if (modalCloseButton != null) {
    modalCloseButton.addEventListener('click', () => {
      if (modal != null) {
        modal.classList.remove('show'); // Remove 'show' class to hide the modal
        modal.style.display = 'none';
      }
    });
  }
}




onDeleteUser(userId: number) {
  // Assuming you have a confirmation dialog before deleting the user
  Swal.fire({
    title: 'Are you sure?',
    text: 'You will not be able to recover this user!',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Yes, delete it!',
    cancelButtonText: 'No, keep it'
  }).then((result) => {
    if (result.isConfirmed) {
      // Prompt user for commenter before deleting
      Swal.fire({
        title: 'Please provide your name or a commenter for deletion',
        input: 'textarea',
        inputPlaceholder: 'Enter your name or a commenter here...',
        showCancelButton: true,
        confirmButtonText: 'Submit',
        cancelButtonText: 'Cancel',
        inputValidator: (value) => {
          if (!value) {
            return 'You need to provide a commenter!';
          }
          // Add a return statement here to handle the case where validation passes
          return null;
        }

      }).then((commenterResult) => {
        if (commenterResult.isConfirmed) {
          // If user provides a commenter and confirms deletion, send delete request to backend
          const commenter = commenterResult.value;
          this.auth.deleteUser(userId, commenter).subscribe({
            next: (res) => {
              // Handle success response
              Swal.fire('Deactivate!', 'User has been Deactivate.', 'success').then((res)=>{
                window.location.reload();
              })

              // Optionally, you can refresh the user list or perform any other action
              
            },
            error: (err) => {
              // Handle error response
              console.error('Error:', err);
              Swal.fire('Error', 'An error occurred while deleting the user', 'error');
            }
          });
        }
      });
    } else if (result.dismiss === Swal.DismissReason.cancel) {
      // If user cancels deletion, show a message
      Swal.fire('Cancelled', 'User deletion cancelled', 'info');
    }
  });
}





  
  calculateSignupsYesterday() {
    console.log("Users array:", this.users);
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
  
    const signupsYesterday = this.users.filter((user: User) => {
      console.log("User:", user);
      if (user.registerTime) {
        const registrationDate = new Date(user.registerTime);
        console.log("Registration Date:", registrationDate);
        return registrationDate.getDate() === yesterday.getDate() &&
               registrationDate.getMonth() === yesterday.getMonth() &&
               registrationDate.getFullYear() === yesterday.getFullYear();
      }
      return false;
    });
  
    this.totalSignupsYesterday = signupsYesterday.length;
  }
  
  

 




selectGetUSerbyid(id: number) {
  this.UUserId = id;
 
  this.auth.getUserById(id).subscribe((user) => {
    this.selectedPlantIds = [user.plantID];
    this.selectedPlants = this.plantList.filter((plant: any) => plant.id === user.plantID);

    this.selectedDepartementIds = [user.departementID];
    this.selectedDepartements = this.departementList.filter((Departement: any) => Departement.id === user.departementID);

    this.selectedtitleIds = [user.titleID];
    this.selectedtitles = this.titles.filter((title: any) => title.id === user.titleID);

    this.selectedroleIds = [user.roleID];
    this.selectedroles = this.roles.filter((Role: any) => Role.id === user.roleID);

    this.UpdateUsers.patchValue({
      TEID: user.teid,
      Badge_id: user.badge_id,

      FirstName: user.firstName,
      LastName: user.lastName,
      Phone: user.phone,
      Email: user.email,
      PlantID: user.buildingID.id,
      DepartementID: user.name_Departement.id,
      TitleID: user.name_Title.id, 
      RoleID: user.name_Role.id,
      Status: user.status,
      commenterDelete:user.commenterDelete
    });
  });
}
selectView(id: number) {
  this.UUserId = id;
 
  this.auth.getUserById(id).subscribe((user) => {
    this.selectedPlantIds = [user.plantID];
    this.selectedPlants = this.plantList.filter((plant: any) => plant.id === user.plantID);

    this.selectedDepartementIds = [user.departementID];
    this.selectedDepartements = this.departementList.filter((Departement: any) => Departement.id === user.departementID);

    this.selectedtitleIds = [user.titleID];
    this.selectedtitles = this.titles.filter((title: any) => title.id === user.titleID);

    this.selectedroleIds = [user.roleID];
    this.selectedroles = this.roles.filter((Role: any) => Role.id === user.roleID);


    this.ViewUsers.patchValue({
      TEID: user.teid,
      Badge_id: user.badge_id,

      FirstName: user.firstName,
      LastName: user.lastName,
      Phone: user.phone,
      Email: user.email,
      PlantID: user.buildingID.id,
      DepartementID: user.name_Departement.id,
      TitleID: user.name_Title.id, 
      RoleID: user.name_Role.id,
      Status: user.status,
      commenterDelete:user.commenterDelete
    });
    this.onDepartementIDSelected(this.selectedDepartementIds);
  });
  console.log(this.ViewUsers);
}



selectDepartement(departementID: number) {
  this.selectedDepartementId = null;
  const selectedDepartement = this.users.find((departement: any)=>departement.id=== departementID);
  if (selectedDepartement) {
    selectedDepartement.isEditing = true;
  }
}






}
interface User {
 
  registerTime: string;
}


