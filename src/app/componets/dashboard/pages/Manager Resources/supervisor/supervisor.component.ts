
import { Component, OnInit  } from '@angular/core';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { RoleService } from '../../../../../services/role.service';
import { ApiService } from '../../../../../services/api.service';
import { AuthService } from '../../../../../services/auth.service';
import { UserStoreService } from '../../../../../services/user-store.service';
import { TitleServiceService } from '../../../../../services/title-service.service';
import { PlantService } from '../../../../../services/plant.service';
import { DepartementService } from '../../../../../services/departement.service';
import * as XLSX from 'xlsx';
import { CommitteeService } from '../../../../../services/committee.service';
import { AreaService } from '../../../../../services/area.service';
import { SupervisorService } from '../../../../../services/supervisor.service';

interface User {
  teid: string;
  fullName: string;
}
@Component({
  selector: 'app-supervisor',
  templateUrl: './supervisor.component.html',
  styleUrl: './supervisor.component.css'
})
export class SupervisorComponent implements OnInit {
  first = 0;
  displayModal: boolean = false;
  displayUpdateModal: boolean = false;
  displayViewModal: boolean = false;
  rows = 10;
  loading: boolean = true;
  searchValue: string | undefined;
  activityValues: number[] = [0, 100];


userss: User[] = [];

  editUserForm!: FormGroup;

  committeesId: number = 0;
  selectedSupervisorId: any  = null;
  users:any=[];
  departements:any=[];
  Supervisor: any = [];
  areas:any=[];
  plants:any=[];
  titles:any=[];

  UuserID: any = null;
  columns = ['Committee', 'Responsible Name', 'Replacement', 'Area', 'Job Title', 'Email', 'Plant', 'Departement'];
  data = [ ];

  USupervisorId: any = null;
  sortedColumn: string = '';
  sortingColumn: string = '';
  sortingOrder: string = 'asc';
  sortBy: string = '';
  sortDirection: number = 1;
  currentPage: number = 1;
  CommitteePerPage: number = 5; 
  currentPageCommittee: number = 1;

  isCommitteeOverlayOpen: boolean = false;
  isimportexportopen: boolean = false;

  public searchtext: string = '';
 
 
  searchText: string = ''; 
  selectedPlantId: number | null = null;
  editingplantID: number | null = null;
  supervisorForm !: FormGroup;
  supervisorUpdateFrom !: FormGroup;
  ViewSupervisor!: FormGroup;

  ViewTeamLeaders!: FormGroup;


   showColumns = {
    speciality: true,
    responsible:true,
    replacement:true,
    departement: true,
    plant: true,
    area: true,   
    responsibleTitle:true,
    Date_Delete: true,
    Date_Update: true,
    Date_Create: true,
   };  

  constructor(
    private userStore: UserStoreService,
    private api: ApiService,
    private TitleService:TitleServiceService,
    private committeeService: CommitteeService,
    private fb: FormBuilder,
    private PlantService:PlantService,
    private AreaService :AreaService,
    private DepartementService :DepartementService,
    private SupervisorService :SupervisorService,
    private AuthService :AuthService,

  ) {}


    get UsersList(): User[] {
    console.log('Search text:', this.searchText);
    return this.users.filter((user: User) =>
      user.fullName.toLowerCase().includes(this.searchText.toLowerCase())
    );
  }
  

  downloadExcel(): void {
    // Convert data to Excel format
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.data, { header: this.columns });
    const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };

    // Save the Excel file
    XLSX.writeFile(workbook, 'User.xlsx');
  }




  toggleDropdown() {
    this.isCommitteeOverlayOpen = !this.isCommitteeOverlayOpen;
  }
  importexportopen() {
    this.isimportexportopen = !this.isimportexportopen;
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
        this.committeeService.getExportCommittee().subscribe({
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
                    this.committeeService.importCommittee(file).subscribe({
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


  ngOnInit(): void {
  
   this.loadCommittees();

      this.supervisorUpdateFrom = this.fb.group({
        speciality: ['', Validators.required],
        userID: ['', Validators.required]
      
      });


      this.ViewSupervisor = this.fb.group({
        speciality: ['', Validators.required],
        userID: ['', Validators.required],
        commenterDisabled: ['', Validators.required]
      });

        this.ViewTeamLeaders = this.fb.group({
          speciality: [{ value: '', disabled: true }, Validators.required],
          userID: [{ value: '', disabled: true }, Validators.required], 
        });

        this.supervisorForm = this.fb.group({
          speciality: ['', Validators.required], 
          userID: ['', Validators.required],
      });
      
    }

    loadCommittees(){
      this.loading = true;
      this.SupervisorService.getAllSupervisor().subscribe((data: any) => {
      this.Supervisor = data;
      this.loading = false;

      console.log(data);
    });
    this.PlantService.getAllPlant().subscribe((res) => {
      this.plants = res;
    });

    this.TitleService.getAllTitle().subscribe((res) => {
      this.titles = res;
    });
    this.AreaService.getAllArea().subscribe((res) => {
      this.areas = res;
    });
    this.DepartementService.getAlldepartement().subscribe((res) => {
      this.departements = res;
    });
  
    this.api.getUsers().subscribe((res) => {
      this.users = res;
    });
  } 
  getAreaName(areaID: any): string {
    const selectedArea = this.areas.find((area: { id: any; }) => area.id === areaID);
    return selectedArea ? selectedArea.name_Area : '';
  }
  getTitleName(titleID: any): string {
    const selectedTitle = this.titles.find((title: { id: any; }) => title.id === titleID);
    return selectedTitle ? selectedTitle.name_Title : '';
  }



  getDepartementName(departementID: any): string {
    const selectedDepartment = this.departements.find((departement: { id: any; }) => departement.id === departementID);
    return selectedDepartment ? selectedDepartment.name_Departement : '';
  }

  getUserName(userID: any): string {
    const selectedUser = this.users.find((user: { id: any; }) => user.id === userID);
    return selectedUser ? `${selectedUser.fullName} (${selectedUser.teid})` : '';
  }

clear(dt: any): void {
  dt.clear();
  this.searchText = '';
  this.loadCommittees();
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
      return this.Supervisor? this.first === this.Supervisor.length - this.rows : true;
  }

  isFirstPage(): boolean {
      return this.Supervisor ? this.first === 0 : true;
  }







  deleteCommittees(CommitteeId: number) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You will not be able to recover this Committee!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it'
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: 'Please provide your name or a comment for the delete',
          input: 'textarea',
          inputPlaceholder: 'Enter your name or a comment here...',
          showCancelButton: true,
          confirmButtonText: 'Submit',
          cancelButtonText: 'Cancel',
          inputValidator: (value) => {
            if (!value) {
              return 'You need to provide a comment!';
            }
            return null;
          }
  
        }).then((commenterResult) => {
          if (commenterResult.isConfirmed) {
            // If user provides a commenter and confirms deletion, send delete request to backend
            const commenter = commenterResult.value;
            this.SupervisorService.disabledSupervisor(CommitteeId,commenter).subscribe({
              next: (res) => {
                // Handle success response
                Swal.fire('Deleted!', 'Committee has been deleted.', 'success').then((res)=>{
                  window.location.reload();
                })
  
                // Optionally, you can refresh the user list or perform any other action
                
              },
              error: (err) => {
                // Handle error response
                console.error('Error:', err);
                Swal.fire('Error', 'An error occurred while deleting the Committee', 'error');
              }
            });
          }
        });
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        // If user cancels deletion, show a message
        Swal.fire('Cancelled', 'Committee delete cancelled', 'info');
      }
    });
  }

  updateCommittee(SupervisorId: number, updatedSupervisorData: any) {
  
    if (SupervisorId !== null && this.supervisorUpdateFrom.valid) {
            this.SupervisorService.updateSupervisor(SupervisorId, updatedSupervisorData).subscribe({
        next :(response) => {
              Swal.fire('Success', 'Supervisor Updated Successfully', 'success').then((res)=>{
                window.location.reload();
              });
        },
        error : (error) => {
          Swal.fire('Error', 'Error updating Supervisor:', 'error');
  
          this.supervisorUpdateFrom.reset();
        
          const modal = document.getElementById("myModal");
          if (modal != null) {
            modal.classList.remove('show');
            modal.style.display = 'none';
          }
  
                  }
      });
    } else {
      // Handle null userId or form validation errors
      console.error('Committee ID is null or form is invalid');
        Swal.fire('Error', 'An error occurred while deleting the Committee', 'error');
  
      
    }
  }
  


  
changePage(page: number): void {
  this.currentPage = page;
}




  nextPage(): void {
    if (this.currentPage < this.totalCommittee) {
      this.currentPage++;
    }
  }

prevPage(): void {
  if (this.currentPage > 1) {
    this.currentPage--;
  }
}


  
 
changePageCommittee(page: number): void {
  this.currentPageCommittee = page;
}

nextPageCommittee(): void {
  if (this.currentPageCommittee < this.totalPagesCommittee) {
    this.currentPageCommittee++;
  }
}
  
prevPageCommittee(): void {
  if (this.currentPageCommittee > 1) {
    this.currentPageCommittee--;
  }
}
  
  
getDisplayedCommittee(): any[] {
  const startIndex = (this.currentPageCommittee - 1) * this.CommitteePerPage;
  const endIndex = Math.min(startIndex + this.CommitteePerPage, this.Supervisor.length);
  return this.Supervisor.slice(startIndex, endIndex);
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
  this.Supervisor.sort((a:any, b:any) => {
    if (a[columnName] < b[columnName]) return -1 * this.sortDirection;
    if (a[columnName] > b[columnName]) return 1 * this.sortDirection;
    return 0;
  });
}

  
get totalCommittee():number{
  return this.Supervisor.length;
}
get totalPagesCommittee(): number {
  return Math.ceil(this.totalCommittee / this.CommitteePerPage);
  
}
 



globalSearch() {
  console.log('Search Term:', this.searchText);
  const searchTerm = this.searchText.toLowerCase();

  console.log('Current Team Leaders:', this.Supervisor);

  this.Supervisor = this.Supervisor.filter((supervisor: any) => {
    if (
      String(supervisor.speciality).toLowerCase().includes(searchTerm) ||
      String(supervisor.teid.fullName).toLowerCase().includes(searchTerm) ||
      String(supervisor.teid.teid).toLowerCase().includes(searchTerm) 
      
    ) {
      return true; 
    }
    return false;
  });

  console.log('Filtered committees:', this.Supervisor);
}
 



  
get pagesCommittee(): number[] {
  const pagesArray = [];
  for (let i = 1; i <= this.totalPagesCommittee; i++) {
    pagesArray.push(i);
  }
  return pagesArray;
}
 
  
  openModelUpdate(committeesId: any) {
    this.displayUpdateModal = true;

    this.selectedSupervisorId = committeesId;  
  console.log("selection id :", this.selectedSupervisorId );
  console.log("user  id :", committeesId );
    // Get the modal element
    const modal = document.getElementById("updatecommitteesModule");
    console.log(committeesId);
    if (modal != null) {
      
      
        const committeeIDInput = modal.querySelector('#committeesId');
        if (committeeIDInput != null) {
          committeeIDInput.setAttribute('value', committeesId);
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
    
  openModelView(committeesIdId: any) {
    this.displayViewModal = true;

    this.selectedSupervisorId = committeesIdId;  

  console.log("selection id :", this.selectedSupervisorId );
  console.log("user  id :", committeesIdId );
    // Get the modal element
    const modal = document.getElementById("ViewCommitteesModule");
    console.log(committeesIdId);
    if (modal != null) {
      
      
        const committeeIDInput = modal.querySelector('#ViewCommitteesModule');
        if (committeeIDInput != null) {
          committeeIDInput.setAttribute('value', committeesIdId);
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
    
  openModelImportExcelCommittee() {
    
    
    // Get the modal element
    const modal = document.getElementById("ImportExcelCommittee");
    
    if (modal != null) {
      
    
        const committeeIDInput = modal.querySelector('#ImportExcelCommittee');
        
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
    console.log(this.users);
    this.displayModal = true;

    const modal = document.getElementById("AddCommittee");
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

  closeModal() {
    const modal = document.getElementById("updateCommitteesModule");
    if (modal != null) {
      modal.classList.remove('show');
      modal.style.display = 'none';
    }

  }
  Savesupervisor_1() {
     console.log("Form :",this.supervisorForm.value)
        this.SupervisorService.saveSupervisor(this.supervisorForm.value).subscribe({
            next: (res) => {
                Swal.fire('Done', "Supervisor saved successfully", 'success').then(() => {
                    window.location.reload();
                });
                this.supervisorForm.reset();
                const modal = document.getElementById("myModal");
                if (modal != null) {
                    modal.classList.remove('show');
                    modal.style.display = 'none';
                }
            },
            error: (err) => {
                console.error('Error:', err);
                Swal.fire('Error', 'An error occurred while saving the Supervisor', 'error');
            },
        });
  
}


selectGetSupervisorbyid(id: number) {
  this.USupervisorId = id;
 
  this.SupervisorService.getSupervisorById(id).subscribe((Supervisor) => {
    this.supervisorUpdateFrom.patchValue({
      speciality: Supervisor.speciality,
      userID: Supervisor.userID,
      commenterDisabled: Supervisor.commenterDisabled

    });
  });
}
selectView(id: number) {
  this.selectedSupervisorId = id;
  console.log("select view :", this.selectedSupervisorId);
  this.SupervisorService.getSupervisorById(this.selectedSupervisorId).subscribe(
    (supervisor) => {
      this.ViewSupervisor.patchValue({
        speciality: supervisor.speciality,
        userID: supervisor.userID,
        commenterDisabled: supervisor.commenterDisabled
      });
      this.displayViewModal = true;
    },
    (error) => {
      console.error('Error fetching supervisor:', error);
    }
  );
}


isDisabled: boolean = false;


}
