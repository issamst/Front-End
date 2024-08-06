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

@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrl: './project.component.css'
})
export class ProjectComponent implements OnInit {
  displayModal: boolean = false;
  displayUpdateModal: boolean = false;
  displayViewModal: boolean = false;
  first = 0;

  rows = 10;
  loading: boolean = true;
  searchValue: string | undefined;
  activityValues: number[] = [0, 100];
  public searchtext: string = '';

  isProjectOverlayOpen: boolean = false;

  searchText: string = ''; 

  sortOrder: string = 'asc';
  ProjectId: number = 0;
  selectedProject: any = null;
  showUpdateUplantModal: boolean = false;
  editingplantId: number | null = null;
  editUserForm!: FormGroup;
  ProjectForm!: FormGroup;
  UpdateProjectFrom!: FormGroup;
  ViewProject!: FormGroup;
  currentPageProject: number = 1;

 
  public user: any = [];
  Areas:any=[];
  Projects:any=[];

  currentPage: number = 1;
  ProjectPerPage: number = 5; // Number of titles to display per page

  // public searchtext: string = '';
 
  UbuildingId : any = null;

  selectedProjectId: any = null;


  UProjectId: any = null;
  isFormDisabled: boolean = false;



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
    project_Name: true,
    building_ID: true,
    areaID: true,
    date_Create: true,
    date_Update: true,
    date_delete: true,
};  
public ProjectList: any = [];
plants:any=[];
columns = ['TE ID', 'Full Name', 'Phone', 'Role', 'Job Title', 'Email', 'Plant', 'Department'];
data = [ ];
  constructor(
    private dialog: MatDialog,
    private roleService: RoleService,
    private api: ApiService,
   
    private userStore: UserStoreService,
    private titleService: TitleServiceService,
    private router: Router ,
    private PlantService:PlantService,
    private ProjectService :ProjectService,
    private fb: FormBuilder,
    private AreaService:AreaService
  ) {
   
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
        this.ProjectService.getExportProject().subscribe({
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
                    this.ProjectService.importProject(file).subscribe({
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
    this.isProjectOverlayOpen = !this.isProjectOverlayOpen;
  }
  importexportopen() {
    this.isimportexportopen = !this.isimportexportopen;
  }
  selectedPlants: any[] = [];
  selectedAreaIds: number[] = [];
  onBuildingIDSelected(event: any) {
    const buildingID = event.value;
    this.selectedAreaIds = [];
    if (buildingID) {
      this.PlantService.getPlantByIdBUidinding(buildingID).subscribe((res) => {
        this.IDBuilding = res;
        this.AreasById = [];
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
ngOnInit() {
  
    this.UpdateProjectFrom = this.fb.group({
      project_Name: ['', Validators.required],
      building_ID: ['', Validators.required],
      areaID: ['', Validators.required],
    });

    this.ViewProject = this.fb.group({
      project_Name: [{ value: '', disabled: true }, Validators.required],
      building_ID: [{ value: '', disabled: true }, Validators.required],
      areaID: [{ value: '', disabled: true }, Validators.required],
      commenterDelete:['',Validators.required],
    });

    this.ProjectForm = this.fb.group({
      project_Name: ['', Validators.required],
      building_ID: ['', Validators.required],
      areaID: ['', Validators.required],
    });
  
   this.loadProjects();
    
    
   
  }


loadProjects(){
  this.ProjectService.getAllProject().subscribe((res) => {
    this.loading=true;

    this.Projects = res;
    this.loading=false;

  });

  this.PlantService.getAllPlant().subscribe((res) => {
    this.plants = res;
  });
  
  this.AreaService.getAllArea().subscribe((res) => {
    this.Areas = res;
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

getAreaName(areaID: any): string {
  const selectedArea = this.Areas.find((area: { id: any; }) => area.id === areaID);
  return selectedArea ? selectedArea.name_Area : '';
}
  
clear(dt: any): void {
  dt.clear();
  this.searchText = '';
  this.loadProjects();
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
return this.Projects? this.first === this.Projects.length - this.rows : true;
}

isFirstPage(): boolean {
return this.Projects ? this.first === 0 : true;
}


globalSearch() {
  const searchTerm = this.searchText.toLowerCase();

  this.Projects = this.Projects.filter((project: any) => {
    return Object.values(project).some((value: any) =>

      String(project.name_Area.name_Area).toLowerCase().includes(searchTerm) ||

      String(value).toLowerCase().includes(searchTerm)
    );
  });
}

  

  
changePage(page: number): void {
  this.currentPage = page;
}



  nextPage(): void {
    if (this.currentPage < this.totalProject) {
      this.currentPage++;
    }
  }

prevPage(): void {
  if (this.currentPage > 1) {
    this.currentPage--;
  }
}


  
 
changePageProject(page: number): void {
  this.currentPageProject= page;
}

nextPageProject(): void {
  if (this.currentPageProject < this.totalPagesProject) {
    this.currentPageProject++;
  }
}
  
prevPageProject(): void {
  if (this.currentPageProject > 1) {
    this.currentPageProject--;
  }
}

  
getDisplayedProject(): any[] {
  const startIndex = (this.currentPageProject - 1) * this.ProjectPerPage;
  const endIndex = Math.min(startIndex + this.ProjectPerPage, this.Projects.length);
  return this.Projects.slice(startIndex, endIndex);
}

  
get totalProject():number{
  return this.Projects.length;
}
get totalPagesProject(): number {
  return Math.ceil(this.totalProject / this.ProjectPerPage);
  
}
 

 
get pagesProject(): number[] {
  const pagesArray = [];
  for (let i = 1; i <= this.totalPagesProject; i++) {
    pagesArray.push(i);
  }
  return pagesArray;
}
 
  

updateProject(ProjectId: number, updatedProjectData: any) {
  
  if (ProjectId !== null && this.UpdateProjectFrom.valid) {
          this.ProjectService.updateProject(ProjectId, updatedProjectData).subscribe({
      next :(response) => {
            Swal.fire('Success', 'Project updated successfully:'+response, 'success').then((res)=>{
              window.location.reload();
            });
      },
      error : (error) => {
        Swal.fire('Error', 'Error updating Project:', 'error');

        this.UpdateProjectFrom.reset();
      
        const modal = document.getElementById("myModal");
        if (modal != null) {
          modal.classList.remove('show');
          modal.style.display = 'none';
        }

                }
    });
  } else {
    // Handle null userId or form validation errors
    console.error('Project ID is null or form is invalid');
      Swal.fire('Error', 'An error occurred while deleting the Project', 'error');

    
  }
}

openModelUpdate(ProjectId: any) {
  this.displayUpdateModal = true;

  this.selectedProjectId = ProjectId;  
  this.UbuildingId = ProjectId;
  console.log("selectionProject id :", this.selectedProjectId );
  console.log("Project  id :", ProjectId );
  // Get the modal element
  const modal = document.getElementById("updateProjectModule");
  console.log(ProjectId);
  if (modal != null) {
    
      // Set the user ID in the modal
      // For example, if you have an input field with id="userId" in the modal, you can set its value
      const userIdInput = modal.querySelector('#ProjectId');
      if (userIdInput != null) {
          userIdInput.setAttribute('value', ProjectId);
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
  
openModelView(ProjectId: any) {
  this.displayViewModal = true;

  this.selectedProjectId = ProjectId;  
  this.UbuildingId = ProjectId; 
console.log("selection id :", this.selectedProjectId );
console.log("user  id :", ProjectId );
  // Get the modal element
  const modal = document.getElementById("ViewProjectModule");
  console.log(ProjectId);
  if (modal != null) {
    
      // Set the user ID in the modal
      // For example, if you have an input field with id="userId" in the modal, you can set its value
      const userIdInput = modal.querySelector('#ViewProjectModule');
      if (userIdInput != null) {
          userIdInput.setAttribute('value', ProjectId);
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

  const modal = document.getElementById("AddProject");
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

SaveProject() {
  if (this.ProjectForm.valid) {
    console.log(this.ProjectForm.value)
    
    // Check if the signup form is valid
    this.ProjectService.saveProject(this.ProjectForm.value).subscribe({
      next: (res) => {
        Swal.fire('Done', "Done !!", 'success').then((res)=>{
          window.location.reload();
        });
        
        this.ProjectForm.reset();
       
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

    Swal.fire('Error', 'Please provide valid signup information', 'warning');
  }
}


DeleteProject(ProjectId: number) {
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
          this.ProjectService.deleteProject(ProjectId, commenter).subscribe({
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
IDBuilding: any;
AreasById:any;

selectGetProjectbyid(id: number) {
  this.UProjectId = id;
  this.ProjectService.getProjectById(id).subscribe((Project) => {
    this.UpdateProjectFrom.patchValue({
      project_Name: Project.project_Name,
      areaID: Project.areaID,
      building_ID: Project.building_ID,
      commenterDelete:Project.commenterDelete
    });
    const buildingID = Project.building_ID;
    if (buildingID) {
      this.PlantService.getPlantByIdBUidinding(buildingID).subscribe((res) => {
        this.IDBuilding = res;
        if (this.IDBuilding) {
          this.AreaService.getAreaByIdPlant(this.IDBuilding).subscribe((res) => {
            this.AreasById = res;
          });
        } else {
          console.error('Building details not found');
        }
      });
    }
  });
}
Close(){
  this.ViewProject.reset();
  this.UpdateProjectFrom.reset();
  this.ProjectForm.reset();
  this.AreasById=[]
}
selectView(id: number) {
  this.UProjectId = id;
 
   this.ProjectService.getProjectById(id).subscribe((Project) => {



     this.ViewProject.patchValue({
      project_Name: Project.project_Name,
      areaID: Project.areaID,
      building_ID: Project.building_ID,
      commenterDelete:Project.commenterDelete
     });

    const buildingID = Project.building_ID;
    if (buildingID) {
      this.PlantService.getPlantByIdBUidinding(buildingID).subscribe((res) => {
        this.IDBuilding = res;
        if (this.IDBuilding) {
          this.AreaService.getAreaByIdPlant(this.IDBuilding).subscribe((res) => {
            this.AreasById = res;
          });
        } else {
          console.error('Building details not found');
        }
      });
    }




   });
 }


}