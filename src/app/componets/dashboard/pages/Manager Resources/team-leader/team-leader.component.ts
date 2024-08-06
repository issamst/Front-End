
import { Component, OnInit  } from '@angular/core';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { Table, TableRowCollapseEvent, TableRowExpandEvent } from 'primeng/table';
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
import { TeamLeaderService } from '../../../../../services/teamleader.service';
import { AreaService } from '../../../../../services/area.service';
import { ProjectService } from '../../../../../services/project.service';
import { MessageService } from 'primeng/api';
import { users } from '../../../../../models/user.model';
import { TeamLeader } from '../../../../../models/teamleader.model';

// interface Shift {
//   name: string;
//   id:number;
// }



@Component({
  selector: 'app-team-leader',
  templateUrl: './team-leader.component.html',
  styleUrl: './team-leader.component.css',

})
export class TeamLeaderComponent {
  first = 0;
  displayAddTeamLeader: boolean = false;
  displayUpdateTeamLeaders: boolean = false;
  displayViewTeamLeaders: boolean = false;
  rows = 10;
  loading: boolean = true;
  // searchValue: string | undefined;
  searchValue: string = '';
  globalFilter: any;

  activityValues: number[] = [0, 100];
  expandedRows = {};

  // shifts: any[]=[];
  shifts: any= [];


  editUserForm!: FormGroup;

  TeamLeadersId: number = 0;
  selectedTeamLeadersId: any  = null;
  users:any=[];
  projects:any=[];
  TeamLeaders: any = [];
  groupedTeamLeaders: users[] = [];

  areas:any=[];
  plants:any=[];
    
  UuserID: any = null;
  columns = ['TeamLeader', 'User', 'Project', 'Area', 'Job Title'];
  data = [ ];

  UTeamLeadersId: any = null;
  sortedColumn: string = '';
  sortingColumn: string = '';
  sortingOrder: string = 'asc';
  sortBy: string = '';
  sortDirection: number = 1;
  currentPage: number = 1;
  TeamLeaderPerPage: number = 5; 
  currentPageTeamLeader: number = 1;

  isTeamLeaderOverlayOpen: boolean = false;
  isimportexportopen: boolean = false;

  public searchtext: string = '';
 
 
  searchText: string = ''; 
  selectedprojectID: number | null = null;
  editingprojectID: number | null = null;
  TeamLeadersForm !: FormGroup;
  UpdateTeamLeadersFrom !: FormGroup;
  ViewTeamLeaders!: FormGroup;

   showColumns = {
    teamleader_name: true,
    user:true,
    project: true,
    area: true,   
    shift: true,
    Date_Delete: true,
    Date_Update: true,
    Date_Create: true,
   };  

  constructor(
    private userStore: UserStoreService,
    private api: ApiService,

    private TeamLeaderService: TeamLeaderService,
    private fb: FormBuilder,
    private PlantService:PlantService,
    private AreaService :AreaService,
    private ProjectService :ProjectService,
    private DepartementService :DepartementService,
    private messageService: MessageService,
    private AuthService :AuthService,

  ) {}



  expandAll() {
  this.expandedRows = this.TeamLeaders.reduce((acc: { [x: string]: boolean; }, p: { id: string | number; }) => (acc[p.id] = true) && acc, {});
  }


  collapseAll() {
    this.expandedRows = {};
  }

  onRowExpand(event: TableRowExpandEvent) {
  this.messageService.add({ severity: 'info', summary: 'Table Expanded', detail: event.data.name, life: 3000 });
  }

  onRowCollapse(event: TableRowCollapseEvent) {
  this.messageService.add({ severity: 'success', summary: 'Table Collapsed', detail: event.data.name, life: 3000 });
  }

  downloadExcel(): void {
    // Convert data to Excel format
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.data, { header: this.columns });
    const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };

    // Save the Excel file
    XLSX.writeFile(workbook, 'User.xlsx');
  }




  toggleDropdown() {
    this.isTeamLeaderOverlayOpen = !this.isTeamLeaderOverlayOpen;
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
        this.TeamLeaderService.getExportTeamLeader().subscribe({
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
                    this.TeamLeaderService.importTeamLeader(file).subscribe({
                        next: (res) => {
                            // console.log('Import response:', res);
                            // const blob = new Blob([res], { shift: 'application/octet-stream' });
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
  
      this.getShifts();

      this.UpdateTeamLeadersFrom = this.fb.group({
        teamleader_name: ['', Validators.required],
        userID: [[]], 
        projectID: ['', Validators.required],
        areaID: ['', Validators.required],
        shift:['',Validators.required]
      });


      this.ViewTeamLeaders = this.fb.group({
        teamleader_name: [{ value: '', disabled: true }, Validators.required],
        projectID: [{ value: '', disabled: true }, Validators.required],
        userID: [{ value: '', disabled: true }, Validators.required], 
        // userID: ['', Validators.required],
        areaID: [{ value: '', disabled: true }, Validators.required],
        shift:[{ value: '', disabled: true }, Validators.required],
        commenterDelete:['',Validators.required],

      });


      this.TeamLeadersForm = this.fb.group({
        teamleader_name: ['', Validators.required], 
        projectID: ['', Validators.required],
        userID: [[]], 
        areaID: ['', Validators.required],
        shift:['',Validators.required]
      });
      
    this.loadTeamLeaders();
  }
  getShifts() {
    this.shifts = [
      { id:1,name: 'Morning'},
      { id:2,name: 'Afternoon'},
      { id:3,name: 'Night' },
      { id:4,name: 'Admin' }
     ];  
    }


    getUserName(userID: any): string {
      const selectedUser = this.users.find((user: { id: any; }) => user.id === userID);
      return selectedUser ? selectedUser.fullName : '';
    }

  getAreaName(areaID: any): string {
    const selectedArea = this.areas.find((area: { id: any; }) => area.id === areaID);
    return selectedArea ? selectedArea.name_Area : '';
  }

  getProjectName(projectID: any): string {
    const selectedProject = this.projects.find((project: { id: any; }) => project.id === projectID);
    return selectedProject ? `${selectedProject.project_Name} (${selectedProject.building_ID})` : '';
  }
  
  getShiftName(shiftId: any): string {
    const selectedShift = this.shifts.find((shift: { id: any; }) => shift.id === shiftId);
    return selectedShift ? selectedShift.name : '';
  }
  


  loadTeamLeaders() {


    this.loading = true;
    this.TeamLeaderService.getAllTeamLeaders().subscribe((data: any[]) => {
    this.TeamLeaders = data;
    this.loading = false;
    console.log(data);

  });

  


  this.ProjectService.getAllProject().subscribe((res) => {
    this.projects = res;
  });

  this.AreaService.getAllArea().subscribe((res) => {
    this.areas = res;
  });


  this.api.getUsers().subscribe((res) => {
    this.users = res;
  }); 

  } 


  clear(dt: any): void {
        dt.clear();
        this.searchText = '';
        this.loadTeamLeaders();
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
      return this.TeamLeaders? this.first === this.TeamLeaders.length - this.rows : true;
  }

  isFirstPage(): boolean {
      return this.TeamLeaders ? this.first === 0 : true;
  }


  getUserById(id: number) {
    return this.users.find((user: { id: number; }) => user.id === id);
  }

  toggleRow(rowData: any) {
    this.expandedRows = this.expandedRows === rowData ? null : rowData;
  }


  SaveTeamLeaders() {
    if (this.TeamLeadersForm.valid) { 
      const formValue = this.TeamLeadersForm.value;
      formValue.shift = formValue.shift.name;

      console.log(this.TeamLeadersForm.value);
      this.TeamLeaderService.saveTeamLeaders(formValue).subscribe({
        next: (res) => {
          Swal.fire('Done', "TeamLeader saved successfully", 'success').then(() => {
            window.location.reload();
          });
          this.TeamLeadersForm.reset();
         
          const modal = document.getElementById("myModal");
          if (modal != null) {
            modal.classList.remove('show');
            modal.style.display = 'none';
          }
        },
        error: (err) => {
          console.error('Error:', err);
          Swal.fire('Error', 'An error occurred while saving the TeamLeader', 'error');
        },
      });
    } else {
      Swal.fire('Error', 'Please provide valid information', 'warning');
    }
  }




  deleteTeamLeaders(TeamLeaderId: number) {
    Swal.fire({
      title: 'Are you sure ?',
      text: 'You will not be able to recover this TeamLeader!',
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
            this.TeamLeaderService.deleteTeamLeaders(TeamLeaderId,commenter).subscribe({
              next: (res) => {
                // Handle success response
                Swal.fire('Deleted!', 'TeamLeader has been deleted.', 'success').then((res)=>{
                  window.location.reload();
                })
  
                // Optionally, you can refresh the user list or perform any other action
                
              },
              error: (err) => {
                // Handle error response
                console.error('Error:', err);
                Swal.fire('Error', 'An error occurred while deleting the TeamLeader', 'error');
              }
            });
          }
        });
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        // If user cancels deletion, show a message
        Swal.fire('Cancelled', 'TeamLeader delete cancelled', 'info');
      }
    });
  }
  closeModal() {
    this.displayAddTeamLeader = false;
    this.displayUpdateTeamLeaders = false;
    this.displayViewTeamLeaders = false;
    const modal = document.getElementById("updateTeamLeadersModule");
    if (modal != null) {
        modal.classList.remove('show');
        modal.style.display = 'none';
    }
    

  }
 

  
  updateTeamLeader(TeamLeaderId: number, updatedTeamLeaderData: any) {
    if (TeamLeaderId !== null && this.UpdateTeamLeadersFrom.valid) {
        // Prepare the data for updating and mapping userID correctly
        const updatedTeamLeader = {
            ...updatedTeamLeaderData,
            userID: updatedTeamLeaderData.userID.map((userId: number) => userId), 
            shift: updatedTeamLeaderData.shift.name // Ensure shift is a string

        };
        

        this.TeamLeaderService.updateTeamLeaders(TeamLeaderId, updatedTeamLeader).subscribe({
            next: (response) => {
                Swal.fire('Success', 'TeamLeader Updated Successfully', 'success').then((res) => {
                    window.location.reload();
                });
            },
            error: (error) => {
                console.error('Error updating TeamLeader:', error);
                Swal.fire('Error', `Error updating TeamLeader: ${error.message || error}`, 'error');
                this.UpdateTeamLeadersFrom.reset();

                const modal = document.getElementById("updateTeamLeadersModule");
                if (modal != null) {
                    modal.classList.remove('show');
                    modal.style.display = 'none';
                }
            }
        });
    } else {
        console.error('TeamLeader ID is null or form is invalid');
        Swal.fire('Error', 'An error occurred while updating the TeamLeader', 'error');
    }
}



  
changePage(page: number): void {
  this.currentPage = page;
}




  nextPage(): void {
    if (this.currentPage < this.totalTeamLeader) {
      this.currentPage++;
    }
  }

prevPage(): void {
  if (this.currentPage > 1) {
    this.currentPage--;
  }
}


  
 
changePageTeamLeader(page: number): void {
  this.currentPageTeamLeader = page;
}

nextPageTeamLeader(): void {
  if (this.currentPageTeamLeader < this.totalPagesTeamLeader) {
    this.currentPageTeamLeader++;
  }
}
  
prevPageTeamLeader(): void {
  if (this.currentPageTeamLeader > 1) {
    this.currentPageTeamLeader--;
  }
}
  
  
getDisplayedTeamLeader(): any[] {
  const startIndex = (this.currentPageTeamLeader - 1) * this.TeamLeaderPerPage;
  const endIndex = Math.min(startIndex + this.TeamLeaderPerPage, this.TeamLeaders.length);
  return this.TeamLeaders.slice(startIndex, endIndex);
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
  this.TeamLeaders.sort((a:any, b:any) => {
    if (a[columnName] < b[columnName]) return -1 * this.sortDirection;
    if (a[columnName] > b[columnName]) return 1 * this.sortDirection;
    return 0;
  });
}

  
get totalTeamLeader():number{
  return this.TeamLeaders.length;
}
get totalPagesTeamLeader(): number {
  return Math.ceil(this.totalTeamLeader / this.TeamLeaderPerPage);
  
}
 
globalSearch() {
  console.log('Search Term:', this.searchText);
  const searchTerm = this.searchText.toLowerCase();

  console.log('Current Team Leaders:', this.TeamLeaders);

  this.TeamLeaders = this.TeamLeaders.filter((TeamLeader: any) => {
    if (
      String(TeamLeader.teamleader_Name).toLowerCase().includes(searchTerm) ||
      String(TeamLeader.shift).toLowerCase().includes(searchTerm) ||
      String(TeamLeader.n_Project.project_Name).toLowerCase().includes(searchTerm) ||
      String(TeamLeader.n_Area.name_Area).toLowerCase().includes(searchTerm)
     
    ) {
      return true; 
    }
    return false;
  });

  console.log('Filtered Team Leaders:', this.TeamLeaders);
}


 
// filterGlobal(event: Event) {
//   const input = event.target as HTMLInputElement;
//   this.searchValue = input.value;
// }
applyFilter(event: Event) {
  const input = event.target as HTMLInputElement;
  this.searchValue = input.value;
  this.globalFilter = {
    teamleader_Name: { value: this.searchValue, matchMode: 'contains' },
    user: { value: this.searchValue, matchMode: 'contains' },
    projects: { value: this.searchValue, matchMode: 'contains' },
    name_Area: { value: this.searchValue, matchMode: 'contains' },
    shift: { value: this.searchValue, matchMode: 'contains' }
  };
}

  
get pagesTeamLeader(): number[] {
  const pagesArray = [];
  for (let i = 1; i <= this.totalPagesTeamLeader; i++) {
    pagesArray.push(i);
  }
  return pagesArray;
}
 
  
  openModelUpdate(TeamLeadersId: any) {
    this.displayUpdateTeamLeaders = true;

    this.selectedTeamLeadersId = TeamLeadersId;  
  console.log("selection id :", this.selectedTeamLeadersId );
  console.log("user  id :", TeamLeadersId );
    // Get the modal element
    const modal = document.getElementById("updateTeamLeadersModule");
    console.log(TeamLeadersId);
    if (modal != null) {
      
      
        const TeamLeaderIdInput = modal.querySelector('#TeamLeadersId');
        if (TeamLeaderIdInput != null) {
          TeamLeaderIdInput.setAttribute('value', TeamLeadersId);
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
    
  openModelView(TeamLeadersIdId: any) {
    this.displayViewTeamLeaders = true;

    this.selectedTeamLeadersId = TeamLeadersIdId;  
  console.log("selection id :", this.selectedTeamLeadersId );
  console.log("user  id :", TeamLeadersIdId );
    // Get the modal element
    const modal = document.getElementById("ViewTeamLeadersModule");
    console.log(TeamLeadersIdId);
    if (modal != null) {
      
      
        const TeamLeaderIdInput = modal.querySelector('#ViewTeamLeadersModule');
        if (TeamLeaderIdInput != null) {
          TeamLeaderIdInput.setAttribute('value', TeamLeadersIdId);
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
    
  openModelImportExcelTeamLeader() {
    
    
    // Get the modal element
    const modal = document.getElementById("ImportExcelTeamLeader");
    
    if (modal != null) {
      
    
        const TeamLeaderIdInput = modal.querySelector('#ImportExcelTeamLeader');
        
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
    this.displayAddTeamLeader = true;

    console.log(this.users);
    const modal = document.getElementById("AddTeamLeader");
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



selectGetTeamLeadersbyid(id: number) {
  this.UTeamLeadersId = id;
 
  this.TeamLeaderService.getTeamLeadersById(id).subscribe((TeamLeaders) => {
    this.UpdateTeamLeadersFrom.patchValue({
      teamleader_name: TeamLeaders.teamleader_Name, 
      projectID: TeamLeaders.projectID,
     // userID: TeamLeaders.userID,
     userID: TeamLeaders.n_User.map((user: any) => user.id), //  n_User is an array of user objects

      areaID: TeamLeaders.areaID, 
      shift: this.shifts.find((shift: { name: any; }) => shift.name === TeamLeaders.shift),  // Map shift 
      commenterDelete:TeamLeaders.commenterDelete

    });
  });
}



selectView(id: number) {
  this.UTeamLeadersId = id;
  this.TeamLeaderService.getTeamLeadersById(id).subscribe((TeamLeaders) => {
      this.ViewTeamLeaders.patchValue({
        teamleader_name: TeamLeaders.teamleader_Name,
        projectID: TeamLeaders.projectID,
        areaID: TeamLeaders.areaID,
        shift: TeamLeaders.shift,
        commenterDelete: TeamLeaders.commenterDelete,
        userID: TeamLeaders.n_User.map((user: any) => user.fullName) //  n_User is an array of user objects
      });
    },
    (error) => {
      console.error('Error fetching TeamLeader:', error);
    }
  );
}
get dropdownPlaceholder() {
  const userIDControl = this.ViewTeamLeaders.get('userID');
  if (userIDControl && userIDControl.value) {
    return userIDControl.value.join(', ');
  }
  return '';
}



}



