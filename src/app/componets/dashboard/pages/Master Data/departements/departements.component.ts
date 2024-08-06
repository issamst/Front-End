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
import { FormControl } from '@angular/forms';
import { debounceTime } from 'rxjs/operators';
import { users } from '../../../../../models/user.model';

// interface User {
//   teid: string;
//   fullName: string;
//   // Add other properties as needed
// }


@Component({
  selector: 'app-departement',
  templateUrl: './departements.component.html',
  styleUrl: './departements.component.css'
})
export class DepartementsComponent implements OnInit {

  
  displayModal: boolean = false;
  displayUpdateModal: boolean = false;
  displayViewModal: boolean = false;
  first = 0;

  rows = 10;
  loading: boolean = true;
  searchValue: string | undefined;
  activityValues: number[] = [0, 100];
  isDepartementOverlayOpen: boolean = false;
  // isimportexportopen: boolean = false;
  
  // userss: User[] = [];

  sortOrder: string = 'asc';
  DepartementId: number = 0;
  selectedDepartement: any = null;
  showUpdateUplantModal: boolean = false;
  editingplantId: number | null = null;
  editUserForm!: FormGroup;
  DepartementForm!: FormGroup;
  UpdateDepartementFrom!: FormGroup;
  ViewDepartement!: FormGroup;
  currentPageDepartement: number = 1;

  users:any=[];
  public user: any = [];
  plants:any=[];
  Departements:any=[];

  currentPage: number = 1;
  DepartementPerPage: number = 5; // Number of titles to display per page

  public searchtext: string = '';
 
  

  selectedDepartementId: any = null;

  UUserId: any = null;
  UDepartementId: any = null;
  isFormDisabled: boolean = false;

  isimportexportopenDep: boolean = false;
 
  successMessage!: string;
  isAscendingOrder: boolean = true; // Initially set to true for ascending order
  sortedColumn: string = '';
  sortingColumn: string = '';
  sortingOrder: string = 'asc';
  sortBy: string = '';
  sortDirection: number = 1;
  isUserOverlayOpen: boolean = false;
 
  showColumns = {
    Building_ID: true,
    name_Departement: true,
    Manager: true,
    Email: true,
    Date_Delete: true,
    Date_Update: true,
    Date_Create: true,
};  
public DepartementList: any = [];

columns = ['Department name', 'TE ID', 'Full Name', 'Manager Email', 'Plant'];
data = [ ];
searchText: string = ''; // NgModel for search text
// Array of users
  selectedUserId: string | null = null; // NgModel for selected user ID

  // Filtered users based on search text
  get filteredUsers(): users {
    console.log('Search text:', this.searchText);
    return this.users.filter((user: users) =>
      user.FullName.toLowerCase().includes(this.searchText.toLowerCase())
    );
  }
  
  constructor(
    private dialog: MatDialog,
    private roleService: RoleService,
    private api: ApiService,
   
    private userStore: UserStoreService,
    private titleService: TitleServiceService,
    private router: Router ,
    
    private departementService :DepartementService,
    private fb: FormBuilder,
    private PlantService:PlantService
  ) {
    this.DepartementForm = this.fb.group({
      name_Departement: ['', Validators.required],
      teid: ['', ],
      fullName: ['', Validators.required],
      manger_Email: ['', Validators.required],
      plantID: ['', Validators.required]
    });

    this.UpdateDepartementFrom = this.fb.group({
      name_Departement: ['', Validators.required],
      teid: ['',],
      fullName: ['', Validators.required],
      manger_Email: ['', Validators.required],
      plantID: ['', Validators.required]
    });
  }

  name_Departement:any[] = [];
  manger_Email:any[] = [];
  onClose(){ this.isActive =false;
    this.isActiveD =false;
    this.isActiveC =false;
    this.DepartementForm.reset();
    this.selectedManagerIds=[];
    this.selectedPlantIds=[];
    this.name_Departement=[];
    this.manger_Email=[];

  }
  onClear(){ this.isActive =false;
    this.isActiveD =false;
    this.isActiveC =false;
    this.DepartementForm.reset();
    this.UpdateDepartementFrom.reset();
    this.selectedManagerIds=[];
    this.selectedPlantIds=[];
    this.name_Departement=[];
    this.manger_Email=[];

  }


  searchControl = new FormControl('');
  public searchtextplantadd: string = '';
  public searchtextplantupdate: string = '';

  public searchtextmanageradd: string = '';
  public searchtextmanagerupdate: string = '';


// ------------------------------------------------------

clear(dt: any): void {
  dt.clear();
  this.searchText = '';
  this.loadDepartement();
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
return this.Departements? this.first === this.Departements.length - this.rows : true;
}

isFirstPage(): boolean {
return this.Departements ? this.first === 0 : true;
}


 
globalSearch() {
  const searchTerm = this.searchText.toLowerCase();

  this.Departements = this.Departements.filter((departement: any) => {
    return Object.values(departement).some((value: any) =>
      String(departement.buildingID.buildingID).toLowerCase().includes(searchTerm) ||

      String(value).toLowerCase().includes(searchTerm)
    );
    
  });
}



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
    
    this.DepartementForm.patchValue({
      plantID: this.selectedPlantIds
    });
    
  }


// Selection functions
selectedManagerIds: number[] = [];
selectedManagers: any[] = [];

getSelectedManagerText() {
  return this.selectedManagers.length > 0 && this.selectedManagerIds.length > 0
    ? this.selectedManagers.map(user => user.teid + ' (' + user.fullName + ')').join(', ') 
    : 'Choose Your Responsible';
}

isManagerSelected(Manager: any): boolean {
  return this.selectedManagers.some(mgr => mgr.teid === Manager.teid);
}

toggleManagerSelection(Manager: any) {
  const isSelected = this.isManagerSelected(Manager);

  if (isSelected) {
    this.selectedManagerIds = [];
    this.selectedManagers = [];
  } else {
    this.selectedManagerIds = [Manager.teid];
    this.selectedManagers = [Manager];
  }

  // this.DepartementForm.patchValue({
  //   teid: this.selectedManagerIds,
  //   fullName: this.selectedManagers.map(mgr => mgr.fullName)
  // });
}




isimportexportopenaddplant: boolean = false;
isimportexportopenaddmanager: boolean = false;
isimportexportopenupdateplant: boolean = false;
isimportexportopenupdatemanagaer: boolean = false;
isimportexportopen: boolean = false;



importexportopen() {
  this.isimportexportopen = !this.isimportexportopen;
}
importexportopenAddPlant() {
  this.isimportexportopenaddplant = !this.isimportexportopenaddplant;
}

importexportopenAddManager() {
  this.isimportexportopenaddmanager = !this.isimportexportopenaddmanager;
}

importexportopenUpdatePlant() {
  this.isimportexportopenupdateplant = !this.isimportexportopenupdateplant;
}
importexportopenUpdaetManager() {
  this.isimportexportopenupdatemanagaer = !this.isimportexportopenupdatemanagaer;
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

// -------------------------------------------------------------------------

  Export() {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You will export this Departments!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, sure!',
      cancelButtonText: 'No, keep it'
    }).then((result) => {
      if (result.isConfirmed) {
        this.departementService.getExportDepartement().subscribe({
          next: (res) => {
            const blob = new Blob([res], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'Departements.xlsx';
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
                    this.departementService.importDepartement(file).subscribe({
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
    this.isDepartementOverlayOpen = !this.isDepartementOverlayOpen;
  }
  
  ngOnInit() {
    this.searchControl.valueChanges.pipe(
      debounceTime(300)  // Optional: to add a delay before filtering
    ).subscribe(searchTerm => {
      this.plants(searchTerm ?? ''); // Provide a default value if searchTerm is null
    });
    this.searchControl.valueChanges.pipe(
      debounceTime(300)  // Optional: to add a delay before filtering
    ).subscribe(searchTerm => {
      this.users(searchTerm ?? ''); // Provide a default value if searchTerm is null
    });
    this.api.getUsers().subscribe((res) => {
      this.users = res;
    });
    

    this.ViewDepartement = this.fb.group({
      name_Departement: [{ value: '', disabled: true }, Validators.required],
      teid: [{ value: '', disabled: true }, Validators.required],

      fullName: [{ value: '', disabled: true }, Validators.required],
      manger_Email:  [{ value: '', disabled: true }, Validators.required],
      plantID: [{ value: '', disabled: true }, Validators.required],
      commenterDelete:['',Validators.required],
    });

    
   
   this.loadDepartement();
   
  }


loadDepartement(){
  this.PlantService.getAllPlant().subscribe((res) => {
    this.plants = res;
  });
 
    this.loading = true;
    this.departementService.getAlldepartement().subscribe((res) => {
    this.Departements = res;
    this.loading = false;

  });
}

getPlantName(plantID: any): string {
  const selectedPlant = this.plants.find((plant: { id: any; }) => plant.id === plantID);
  return selectedPlant ? `${selectedPlant.buildingID} (${selectedPlant.sapBuildingNumber})` : '';
}
getUserName(fullName: any): string {
  const selectedUser = this.users.find((user: { id: any; }) => user.id === fullName);
  return selectedUser ? `${selectedUser.fullName} (${selectedUser.teid})` : '';
}


  sortData(columnName: string) {
    console.log("columnName   : => ",columnName);
    if (this.sortBy === columnName) {
     
      this.sortDirection = this.sortDirection === 1 ? -1 : 1;
    } else {
      
      this.sortBy = columnName;
      this.sortDirection = 1;
    }

    // Sort the data based on the selected column and direction
    this.plants.sort((a:any, b:any) => {
      if (a[columnName] < b[columnName]) return -1 * this.sortDirection;
      if (a[columnName] > b[columnName]) return 1 * this.sortDirection;
      return 0;
    });
  }
  
 
getArrowIcon(percentageChange: number): string {
  // Check if the percentage change is positive or negative
  if (percentageChange > 0) {
      return "fas fa-arrow-up text-success"; // Green color for arrow up icon
  } else {
      return "fas fa-arrow-down text-danger"; // Red color for arrow down icon
  }
}

  

  
  
changePage(page: number): void {
  this.currentPage = page;
}




  nextPage(): void {
    if (this.currentPage < this.totalDepartement) {
      this.currentPage++;
    }
  }

prevPage(): void {
  if (this.currentPage > 1) {
    this.currentPage--;
  }
}


  
 
changePageDepartement(page: number): void {
  this.currentPageDepartement = page;
}

nextPageDepartement(): void {
  if (this.currentPageDepartement < this.totalPagesDepartement) {
    this.currentPageDepartement++;
  }
}
  
prevPageDepartement(): void {
  if (this.currentPageDepartement > 1) {
    this.currentPageDepartement--;
  }
}
  
  
getDisplayedDepartement(): any[] {
  const startIndex = (this.currentPageDepartement - 1) * this.DepartementPerPage;
  const endIndex = Math.min(startIndex + this.DepartementPerPage, this.Departements.length);
  return this.Departements.slice(startIndex, endIndex);
}

  
get totalDepartement():number{
  return this.Departements.length;
}
get totalPagesDepartement(): number {
  return Math.ceil(this.totalDepartement / this.DepartementPerPage);
  
}
 

 
get pagesDepartement(): number[] {
  const pagesArray = [];
  for (let i = 1; i <= this.totalPagesDepartement; i++) {
    pagesArray.push(i);
  }
  return pagesArray;
}
 
updateDepartement(DepartementId: number, updatedDepartementData: any) {
  // console.log("formUpdate : ", this.DepartementForm)
  console.log('UpdatedDep Daaaaaaata',updatedDepartementData);

  if (DepartementId !== null && this.UpdateDepartementFrom.valid) {
   
    const { name_Departement, teid, fullName, manger_Email, plantID } = this.UpdateDepartementFrom.value;

    const formData = { name_Departement, teid, fullName, manger_Email, plantID };
    formData.name_Departement = formData.name_Departement
    formData.manger_Email = formData.manger_Email

    formData.teid = formData.teid
    formData.fullName = formData.fullName
    formData.plantID = formData.plantID
    console.log("formData Of update", formData);

    // const selectedPlantId = this.selectedPlants[0]?.id;
    // const selectedManagerId = this.selectedManagers[0]?.teid;
    // const selectedManagerFullName = this.selectedManagers[0]?.fullName;
    
    // this.UpdateDepartementFrom.patchValue({
    //   plantID: selectedPlantId,
    //   teid: selectedManagerId,
    //   fullName: selectedManagerFullName
    // });
    
      this.departementService.updatedepartement(DepartementId, formData).subscribe({
          next: (response) => {
              Swal.fire('Success', 'Departement updated successfully', 'success').then((res) => {
                  window.location.reload();
              });
          },
          error: (error) => {
              Swal.fire('Error', 'Error updating departement', 'error');
              this.UpdateDepartementFrom.reset();
              const modal = document.getElementById("myModal");
              if (modal != null) {
                  modal.classList.remove('show');
                  modal.style.display = 'none';
              }
          }
      });
  } else {
    console.log("formDathis.UpdateDepartementFrom.valid ta", this.UpdateDepartementFrom.value);
      console.error('Departement ID is null or form is invalid');
      Swal.fire('Error', 'An error occurred while updating the departement', 'error');
  }
}


openModelUpdate(DepartementId: any) {
  this.displayUpdateModal = true;

  this.selectedDepartementId = DepartementId;  
console.log("selection id :", this.selectedDepartementId );
console.log("departement  id :", DepartementId );
  // Get the modal element
  const modal = document.getElementById("updateDepartementModule");
  console.log(DepartementId);
  if (modal != null) {
    
      // Set the user ID in the modal
      // For example, if you have an input field with id="userId" in the modal, you can set its value
      const userIdInput = modal.querySelector('#DepartementId');
      if (userIdInput != null) {
          userIdInput.setAttribute('value', DepartementId);
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
  
openModelView(DepartementIdId: any,UserId :any) {
  this.displayViewModal = true;

  this.selectedDepartementId = DepartementIdId;  
  this.selectedUserId=UserId;
console.log("selection id :", this.selectedDepartementId );
console.log("user  id :", DepartementIdId );
  // Get the modal element
  const modal = document.getElementById("ViewDepartementModule");
  console.log(DepartementIdId);
  if (modal != null) {
    
      // Set the user ID in the modal
      // For example, if you have an input field with id="userId" in the modal, you can set its value
      const userIdInput = modal.querySelector('#ViewDepartementModule');
      if (userIdInput != null) {
          userIdInput.setAttribute('value', DepartementIdId);
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

  console.log(this.users);
  const modal = document.getElementById("AddDepartement");
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

SaveDepartement() {

  console.log("form : ", this.DepartementForm)

  console.log(this.DepartementForm.valid)
  if (this.DepartementForm.valid) {
    // const selectedPlantId = this.selectedPlants[0]?.id;
    // const selectedManagerId = this.selectedManagers[0]?.teid;
    // const selectedManagerFullName = this.selectedManagers[0]?.fullName;

    // this.DepartementForm.patchValue({
    //   plantID: selectedPlantId,
    //   teid: selectedManagerId,
    //   fullName: selectedManagerFullName
    // });



    const { name_Departement, teid, fullName, manger_Email, plantID } = this.DepartementForm.value;

    const formData = { name_Departement, teid, fullName, manger_Email, plantID };
    formData.teid = formData.fullName.teid
    formData.fullName = formData.fullName.fullName
    formData.plantID = formData.plantID.id
    console.log("formData Of Save", formData);
    this.departementService.savedepartement(formData).subscribe({
      next: (res) => {
        Swal.fire('Done', "Done !!", 'success').then(() => {
          window.location.reload();
        });
        this.DepartementForm.reset();
        const modal = document.getElementById("myModal");
        if (modal != null) {
          modal.classList.remove('show');
          modal.style.display = 'none';
        }
      },
      error: (err) => {
        console.error('Error:', err);
        Swal.fire('Error', 'Not done !!', 'error');
      },
    });
  } else {
    Swal.fire('Error', 'Please provide valid information', 'warning');
  }
}





DeleteDepartement(DepartementId: number) {
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
          this.departementService.deletedepartement(DepartementId, commenter).subscribe({
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






  

 




selectGetDepartementbyid(id: number) {
  this.selectedDepartementId  = id;
  this.departementService.getdepartementById(id).subscribe((Departement) => {
    // this.selectedPlantIds = [Departement.plantID];
    // this.selectedPlants = this.plants.filter((plant: any) => plant.id === Departement.plantID);

    // this.selectedManagerIds=[Departement.teid];
    // this.selectedManagers=this.users.filter((user: any) => user.teid === Departement.teid);
    console.log("department ID: ", id)
    this.UpdateDepartementFrom.patchValue({
      name_Departement: Departement.name_Departement,
      teid: Departement.teid,
      manger_Email: Departement.manger_Email,
      fullName:Departement.fullName,
      plantID: Departement.plantID,
      commenterDelete:Departement.commenterDelete
    });
    console.log("hhhhhhhhhhh",this.UpdateDepartementFrom.value) 
    console.log("hhhhhhhezdgvsfxghhhh",Departement.fullName) 

  });
}
selectView(id: number) {


  this.selectedDepartementId = id;
  
  this.departementService.getdepartementById(id).subscribe((Departement) => {
    this.selectedPlantIds = [Departement.plantID];
    this.selectedPlants = this.plants.filter((plant: any) => plant.id === Departement.plantID);
    this.selectedManagerIds=[Departement.teid];
    this.selectedManagers=this.users.filter((user: any) => user.teid === Departement.teid);
    this.ViewDepartement.patchValue({
      name_Departement: Departement.name_Departement,
      fullName: Departement.fullName,
      manger_Email: Departement.manger_Email,
      plantID: Departement.plantID,
      commenterDelete:Departement.commenterDelete
    });
  });

 }


}