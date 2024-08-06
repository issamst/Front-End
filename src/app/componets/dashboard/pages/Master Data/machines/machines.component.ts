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
import { ProjectService } from '../../../../../services/project.service';
import { AreaService } from '../../../../../services/area.service';
import { MachineService } from '../../../../../services/machine.service';

@Component({
  selector: 'app-machines',
  templateUrl: './machines.component.html',
  styleUrl: './machines.component.css'
})
export class MachinesComponent implements OnInit {
  displayModal: boolean = false;
  displayUpdateModal: boolean = false;
  displayViewModal: boolean = false;

  first = 0;
  rows = 10;
  loading: boolean = true;
  searchValue: string | undefined;
  activityValues: number[] = [0, 100];
  searchText: string = ''; 
  isMachinesOverlayOpen: boolean = false;
  isimportexportopen: boolean = false;


  sortOrder: string = 'asc';
  MachineId: number = 0;
  selectedMachine: any = null;
  showUpdateUplantModal: boolean = false;
  editingplantId: number | null = null;
  editUserForm!: FormGroup;
  MachineForm!: FormGroup;
  UpdateMachineFrom!: FormGroup;
  ViewMachine!: FormGroup;
  currentPageMachine: number = 1;

 
  public user: any = [];
  Projects:any=[];
  Machines:any=[];

  currentPage: number = 1;
  MachinePerPage: number = 5; // Number of titles to display per page

  public searchtext: string = '';
 
  

  selectedMachineId: any = null;


  UMachineId: any = null;
  UareaIDId: any = null;
  UbuildingId: any = null;
  isFormDisabled: boolean = false;

  plants:any=[];

  successMessage!: string;
  isAscendingOrder: boolean = true; // Initially set to true for ascending order
  sortedColumn: string = '';
  sortingColumn: string = '';
  sortingOrder: string = 'asc';
  sortBy: string = '';
  sortDirection: number = 1;
  isUserOverlayOpen: boolean = false;

  showColumns = {
    machine_Name: true,
    projectID: true,
    Building_ID: true,
    areaID: true,
    date_Create: true,
    date_Update: true,
    date_delete: true,
};  
public ProjectList: any = [];
Areas:any=[];
columns = ['TE ID', 'Full Name', 'Phone', 'Role', 'Job Title', 'Email', 'Plant', 'Department'];
data = [ ];
selectedPlantId: number | null = null;
selectedAreaId: number | null = null;
  constructor(
    private dialog: MatDialog,
    private roleService: RoleService,
    private api: ApiService,
    
    private userStore: UserStoreService,
    private titleService: TitleServiceService,
    private router: Router ,
    private PlantService:PlantService,
    private MachineService : MachineService,
    private fb: FormBuilder,
    private ProjeService:ProjectService,
    private AreaService:AreaService
  ) {
   
  }
//  ----------------------------------

Close(){
  this.ViewMachine.reset();
  this.UpdateMachineFrom.reset();
  this.MachineForm.reset();
  this.AreasById=[]

  this.ProjectById=[]
  this.IDBuilding=[]
  this.IDNameArea=[]
}
ProjectById: any = [];
AreasById: any = [];
IDBuilding: any;
IDNameArea: any;
onBuildingIDSelected(buildingID: any) {
  if (buildingID) {
    this.PlantService.getPlantByIdBUidinding(buildingID).subscribe((res) => {
      this.IDBuilding = res;
      this.AreasById = [];
      this.ProjectById = [];
      if (this.IDBuilding) {
        this.AreaService.getAreaByIdPlant(this.IDBuilding).subscribe((res) => {
          this.AreasById = res;
        });
      } else {
        console.error('Building details not found');
      }
    });
  }
}

onAreIDSelected(areaID: any) {
  if (areaID) {
    this.AreaService.getAreaByIdName_M(areaID).subscribe((res) => {
      this.IDNameArea = res;
      if (this.IDNameArea) {
        this.ProjeService.getProjectByIdName(this.IDNameArea).subscribe((res) => {
          this.ProjectById = res;
        });
      } else {
        console.error('Area details not found');
      }
    });
  }
}


//  ----------------------------------
  
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
        this.MachineService.getExportMachine().subscribe({
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
                    this.MachineService.importMachine(file).subscribe({
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
    this.isMachinesOverlayOpen = !this.isMachinesOverlayOpen;
  }
  importexportopen() {
    this.isimportexportopen = !this.isimportexportopen;
  }
ngOnInit() {
    this.UpdateMachineFrom = this.fb.group({
      machine_Name: ['', Validators.required],
      projectID: ['', Validators.required],
      building_ID: ['', Validators.required],
      areaID: ['', Validators.required],
    });

    this.ViewMachine = this.fb.group({
      machine_Name: [{ value: '', disabled: true }, Validators.required],
      projectID: [{ value: '', disabled: true }, Validators.required],
      building_ID: [{ value: '', disabled: true }, Validators.required],
      areaID: [{ value: '', disabled: true }, Validators.required],
      commenterDelete:['',Validators.required],
    });

    this.MachineForm = this.fb.group({
      machine_Name: ['', Validators.required],
      projectID: ['', Validators.required],
      building_ID: ['', Validators.required],
      areaID: ['', Validators.required],
    });

  
   this.loadMachines();
    
   
  }


    loadMachines(){
     this.loading = true;
     this.MachineService.getAllMachine().subscribe((res) => {
     this.Machines = res;
     this.loading = false;

     });
       this.PlantService.getAllPlant().subscribe((res) => {
      this.plants = res;
     });
      this.AreaService.getAllArea().subscribe((res) => {
      this.Areas = res;
     });
      this.ProjeService.getAllProject().subscribe((res) => {
      this.Projects = res;
     });
  }


  getProjectName(projectID: any): string {
    const selectedProject = this.Projects.find((project: { id: any; }) => project.id === projectID);
    // return selectedProject ? `${selectedProject.project_Name} (${selectedProject.building_ID})` : '';
    return selectedProject ? selectedProject.project_Name : '';

  }
  
clear(dt: any): void {
  dt.clear();
  this.searchText = '';
  this.loadMachines();
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
return this.Machines? this.first === this.Machines.length - this.rows : true;
}

isFirstPage(): boolean {
return this.Machines ? this.first === 0 : true;
}


 
globalSearch() {
  const searchTerm = this.searchText.toLowerCase();

  this.Machines = this.Machines.filter((Machine: any) => {
    return Object.values(Machine).some((value: any) =>
      String(value).toLowerCase().includes(searchTerm)
    );
  });
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
    this.Projects.sort((a:any, b:any) => {
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
    if (this.currentPage < this.totalMachine) {
      this.currentPage++;
    }
  }

prevPage(): void {
  if (this.currentPage > 1) {
    this.currentPage--;
  }
}


  
 
changePageMachine(page: number): void {
  this.currentPageMachine= page;
}

nextPageMachine(): void {
  if (this.currentPageMachine < this.totalPagesMachine) {
    this.currentPageMachine++;
  }
}
  
prevPageMachine(): void {
  if (this.currentPageMachine > 1) {
    this.currentPageMachine--;
  }
}

  
getDisplayedMachine(): any[] {
  const startIndex = (this.currentPageMachine - 1) * this.MachinePerPage;
  const endIndex = Math.min(startIndex + this.MachinePerPage, this.Machines.length);
  return this.Machines.slice(startIndex, endIndex);
}

  
get totalMachine():number{
  return this.Machines.length;
}
get totalPagesMachine(): number {
  return Math.ceil(this.totalMachine / this.MachinePerPage);
  
}
 

 
get pagesMachine(): number[] {
  const pagesArray = [];
  for (let i = 1; i <= this.totalPagesMachine; i++) {
    pagesArray.push(i);
  }
  return pagesArray;
}
 
  
updateMachine(MachineId: number, updatedMachineData: any) {
  if (MachineId !== null && this.UpdateMachineFrom.valid) {
    this.MachineService.updateMachine(MachineId, updatedMachineData).subscribe({
      next: (response) => {
        Swal.fire('Success', 'Machine updated successfully: ' + response, 'success').then((res) => {
          window.location.reload();
        });
      },
      error: (error) => {
        Swal.fire('Error', 'Error updating Machine: ' + error.message, 'error');
        this.UpdateMachineFrom.reset();
        const modal = document.getElementById("updateMachineModule");
        if (modal != null) {
          modal.classList.remove('show');
          modal.style.display = 'none';
        }
      }
    });
  } else {
    // Handle null MachineId or form validation errors
    console.error('Machine ID is null or form is invalid');
    Swal.fire('Error', 'An error occurred while updating the Machine', 'error');
  }
}



closeModal() {
  const modal = document.getElementById('updateMachineModule');
  if (modal != null) {
    modal.classList.remove('show');
    modal.style.display = 'none';
  }
}
openModelUpdate(MachineId: any) {
  this.displayUpdateModal = true;

  this.selectedMachineId = MachineId;
  this.UbuildingId=MachineId;
  this.UareaIDId=MachineId;  
  
  console.log("selected Machine id :", this.selectedMachineId );
  console.log("Machine id :", MachineId );
  // Get the modal element
  const modal = document.getElementById("updateMachineModule");
  console.log(MachineId);
  if (modal != null) {
    
      // Set the user ID in the modal
      // For example, if you have an input field with id="userId" in the modal, you can set its value
      const userIdInput = modal.querySelector('#MachineId');
      if (userIdInput != null) {
          userIdInput.setAttribute('value', MachineId);
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
  
openModelView(MachineId: any) {
  this.displayViewModal = true;

  this.selectedMachineId = MachineId;  
  this.UbuildingId=MachineId;
  this.UareaIDId=MachineId;
console.log("selection id :", this.selectedMachineId );
console.log("user  id :", MachineId );
  // Get the modal element
  const modal = document.getElementById("ViewMachineModule");
  console.log(MachineId);
  if (modal != null) {
    
      // Set the user ID in the modal
      // For example, if you have an input field with id="userId" in the modal, you can set its value
      const userIdInput = modal.querySelector('#ViewMachineModule');
      if (userIdInput != null) {
          userIdInput.setAttribute('value', MachineId);
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

  const modal = document.getElementById("AddMachine");
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


// SaveMachine() {
//   if (this.MachineForm.valid) {
//     const formData = this.MachineForm.value;
//     console.log('Form Data before API call:', formData);

//     // Extract the IDs from nested objects
//     const formattedData = {
//       ...formData,
//       projectID: formData.projectID.project_Name,
//       building_ID: formData.building_ID.buildingID,
//       areaID: formData.areaID.name_Area
//     };

//     console.log('Formatted Data before API call:', formattedData);

//     this.MachineService.saveMachine(formattedData).subscribe({
//       next: (res) => {
//         Swal.fire('Done', "Done !!", 'success').then((res) => {
//           window.location.reload();
//         });
//         this.MachineForm.reset();
//         this.displayModal = false;
//       },
//       error: (err) => {
//         console.error('Error:', err);
//         Swal.fire('Error', 'An error occurred while saving the machine', 'error');
//       }
//     });
//   } else {
//     Swal.fire('Error', 'Please provide valid signup information', 'warning');
//   }
// }

SaveMachine() {
  if (this.MachineForm.valid) {
    const formData = this.MachineForm.value;
    console.log('Form Data before API call:', formData);

    // Ensure projectID is a number
    formData.projectID = Number(formData.projectID);

    this.MachineService.saveMachine(formData).subscribe({
      next: (res) => {
        Swal.fire('Done', "Done !!", 'success').then((res) => {
          window.location.reload();
        });
        this.MachineForm.reset();
        this.displayModal = false;
      },
      error: (err) => {
        console.error('Error:', err);
        Swal.fire('Error', 'An error occurred while saving the machine', 'error');
      }
    });
  } else {
    Swal.fire('Error', 'Please provide valid signup information', 'warning');
  }
}


DeleteMachine(MachineId: number) {
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
          this.MachineService.deleteMachine(MachineId, commenter).subscribe({
            next: (res) => {
              // Handle success response
              Swal.fire('Deleted!', 'User has been deleted.', 'success').then((res)=>{
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






  

 



selectGetMachinebyid(id: number) {
  this.UMachineId = id;
 

 
  this.MachineService.getMachineById(id).subscribe((Machine) => {
    this.UpdateMachineFrom.patchValue({
      machine_Name: Machine.machine_Name,
      projectID: Machine.projectID,
      areaID:Machine.areaID,
      building_ID:Machine.building_ID,
      commenterDelete:Machine.commenterDelete
    });
    this.onBuildingIDSelected(Machine.building_ID);
    this.onAreIDSelected(Machine.areaID);
  });
}
selectView(id: number) {
  this.UMachineId = id;
  
   this.MachineService.getMachineById(id).subscribe((Machine) => {
     this.ViewMachine.patchValue({
      machine_Name: Machine.machine_Name,
      projectID: Machine.projectID,
      areaID:Machine.areaID,
      building_ID:Machine.building_ID,
      commenterDelete:Machine.commenterDelete
     });
     this.onBuildingIDSelected(Machine.building_ID);
    this.onAreIDSelected(Machine.areaID);
   });
 }


}