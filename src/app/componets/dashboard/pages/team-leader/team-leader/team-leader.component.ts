
import { Component, OnInit,Input  } from '@angular/core';
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
import { ProposeideaService } from '../../../../../services/proposeidea.service';
import { ProjectService } from '../../../../../services/project.service';
import { MachineService } from '../../../../../services/machine.service';
import { switchMap, of,forkJoin } from 'rxjs';
import { HttpClient } from '@angular/common/http';
interface User {
  teid: string;
  fullName: string;
}
interface UploadEvent {
  originalEvent: Event;
  files: File[];
}

@Component({
  selector: 'app-team-leader',
  templateUrl: './team-leader.component.html',
  styleUrl: './team-leader.component.css'
})
export class TeamLeaderComponent implements OnInit {
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
  Ideas: any = [];
  Areas:any=[];
  plants:any=[];
  titles:any=[];
  Projects:any=[];


  UuserID: any = null;
  columns = ['Committee', 'Responsible Name', 'Replacement', 'Area', 'Job Title', 'Email', 'Plant', 'Departement'];
  data = [ ];

  UideaId: any = null;
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
  ideaSaveForm !: FormGroup;
  ideaUpdateFrom !: FormGroup;
  ideaViewFrom!: FormGroup;

  ViewTeamLeaders!: FormGroup;


   showColumns = {
    title: true,
    description: true,
    descriptionSituation: false,
    descriptionSolution: false,
    name_Area: true,
    project_Name: true,
    name_Machine: true,
    name_Impact: true,
    Responsible: true,

    Team_Leader_Approved: true,
    Team_Leader_Rejected: true,
    date_Create:false,
    date_Update:false,
    date_Disabled:false
   };  

  constructor(
    private userStore: UserStoreService,
    private api: ApiService,
    private TitleService:TitleServiceService,
    private committeeService: CommitteeService,
    private fb: FormBuilder,
    private PlantService:PlantService,
    private DepartementService :DepartementService,
    private SupervisorService :SupervisorService,
    private AuthService :AuthService,

//----------------
  private proposeIdea:ProposeideaService,
  private AreaService:AreaService,
  private ProjetService:ProjectService,
  private MachineService:MachineService,
  private http: HttpClient,
  private auth: AuthService,

  ) {}


    get UsersList(): User[] {
    console.log('Search text:', this.searchText);
    return this.users.filter((user: User) =>
      user.fullName.toLowerCase().includes(this.searchText.toLowerCase())
    );
  }


  // ------------------------------------------
  getUserFullName(id: number): string {
    const user = this.users.find((user:any) => user.id === id);
    return user ? user.fullName : '';
  }
  TeamLeaderAnswer(id: any, response: any) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'Once submitted, you will not be able to change this decision!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, approval granted!',
      cancelButtonText: 'No, keep it. Rejected!'
    }).then((result) => {
      if (result.isConfirmed) {
        // Prompt user for commenter before deleting
        Swal.fire({
          title: 'Please provide your name or a commenter for deletion (optional)',
          input: 'textarea',
          inputPlaceholder: 'Enter your name or a commenter here...',
          showCancelButton: true,
          confirmButtonText: 'Submit',
          cancelButtonText: 'Cancel'
        }).then((commenterResult) => {
          if (commenterResult.isConfirmed || !commenterResult.value) { // Proceed if confirmed or no commenter provided
            // If user provides a commenter and confirms deletion, send delete request to backend
            const commenter = commenterResult.value ? commenterResult.value : null; // Assign null if no commenter provided
            this.proposeIdea.TeamLeaderAnswer(id, this.Id, response, commenter).subscribe({
              next: (res) => {
                Swal.fire('Done', 'Thank you for adding your idea', 'success').then(() => {
                  window.location.reload();
                });
                this.ideaSaveForm.reset();
                const modal = document.getElementById('myModal');
                if (modal) {
                  modal.classList.remove('show');
                  modal.style.display = 'none';
                }
              },
              error: (err) => {
                console.log("response", response, "id", id, "this.teid", this.Id);
                if (err.error && err.error.Errors) {
                  if (Array.isArray(err.error.Errors)) {
                    Swal.fire('Error', err.error.Errors.join(", "), 'error');
                  } else {
                    Swal.fire('Error', err.error.Errors, 'error');
                  }
                } else {
                  Swal.fire('Error', 'An unexpected error occurred', 'error');
                }
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
MachineById: any[] = [];
IDNameArea: any[] = []; 
ProjectById:any=[];
  

onAreIDSelected(areaIDs: any[]): void {
  if (areaIDs && areaIDs.length > 0) {
    this.ProjectById = [];
    this.MachineById = [];
    let projectObservables = areaIDs.map(areaID => this.AreaService.getAreaByIdName_M(areaID));

    forkJoin(projectObservables).subscribe(responses => {
      let projectRequests = responses
        .filter(res => res)
        .map(res => this.ProjetService.getProjectByIdName(res));

      if (projectRequests.length > 0) {
        forkJoin(projectRequests).subscribe(projectResults => {
          this.ProjectById = [].concat(...projectResults);
        });
      } else {
        console.error('Area details not found');
        this.ProjectById = [];
      }
    });
  } else {
    this.ProjectById = [];
  }
}

  onProjectIDSelected(projectIDs: any[]): void {
    if (projectIDs && projectIDs.length > 0) {
      this.MachineById = [];
      this.ProjetService.getProjectIdsByNames(projectIDs).subscribe(res => {
        if (res) {
          this.MachineService.getMachineByAreas(res).subscribe(machines => {
            this.MachineById = machines;
          });
        } else {
          console.error('Project details not found');
          this.MachineById = [];
        }
      });
    } else {
      this.MachineById = [];
    }
  }



//File ideas
uploadedFiles: any[] = [];

onUpload(event: any) {
    for (let file of event.files) {
        this.uploadedFiles.push(file);
    }
}
onFilesChange(event: any, controlName: string) {
  if (event.target.files.length > 0) {
    const files = event.target.files;
    const formData = new FormData();

    for (let file of files) {
      formData.append('files', file, file.name);
    }

    let uploadUrl = '';
    if (controlName === 'fileSituationPath') {
      uploadUrl = 'http://162.109.85.69:1211/api/Idea/FileSituation';
    } else if (controlName === 'fileSolutionPath') {
      uploadUrl = 'http://162.109.85.69:1211/api/Idea/FileSolution';
    } else if (controlName === 'fileIdeaPath') {
      uploadUrl = 'http://162.109.85.69:1211/api/Idea/FileIdea';
    }

    this.http.post<any>(uploadUrl, formData).subscribe(response => {
      const fileNames = response.fileNames;
      this.ideaSaveForm.patchValue({
        [controlName]: fileNames
      });
      this.ideaUpdateFrom.patchValue({
        [controlName]: fileNames
      });
    }, error => {
      console.error('Error uploading files', error);
    });
  }
}

showDetails: boolean = false;

toggleDetails() {
  this.showDetails = !this.showDetails;
}

@Input() Id: string = '';

FileSituation: string[] = [];
FileSolution: string[] = [];
FileIdea: string[] = [];


onSaveIdea() {
    
  if (this.ideaSaveForm.valid) {
    console.log("this.ideaSaveForm.valid",this.ideaSaveForm.value);
    this.proposeIdea.saveIdea(this.ideaSaveForm.value).subscribe({
        next: (res) => {
            Swal.fire('Done', 'Thank you for adding your idea', 'success').then(() => {
                window.location.reload();
            });
            this.ideaSaveForm.reset();
            const modal = document.getElementById('myModal');
            if (modal) {
                modal.classList.remove('show');
                modal.style.display = 'none';
            }
        },
        error: (err) => {
            console.error('Error:', err);
            if (err.error && err.error.Errors) {
                Swal.fire('Error', err.error.Errors.join(", "), 'error');
            } else {
                Swal.fire('Error', 'An unexpected error occurred', 'error');
            }
        }
    });
  } else {
    console.log("this.IdeaForm.valid",this.ideaSaveForm.value)
      Swal.fire('Error', 'Please provide valid idea information', 'warning');
  }
}

updateIdea(IdeaId: number, Updateidea: any) {
  if (IdeaId !== null && this.ideaUpdateFrom.valid) {
    
 
 // console.log("formData",this.formData)

    this.proposeIdea.updateProposeidea(IdeaId, Updateidea).subscribe({
      next: (response) => {
        Swal.fire('Success', 'Idea updated successfully:' + response, 'success').then((res) => {
          window.location.reload();
        });
      },
      error: (error) => {
        Swal.fire('Error', 'Error updating idea', 'error');
        this.ideaUpdateFrom.reset();
  
        const modal = document.getElementById("myModal");
        if (modal != null) {
          modal.classList.remove('show');
          modal.style.display = 'none';
        }
      }
    });
  } else {
    console.error('this.Updateidea.valid' ,this.ideaUpdateFrom.value);
    console.error('this.IdeaId' ,IdeaId);
    Swal.fire('Error', 'Form is invalid or Idea ID is null', 'error');
  }
  }
fileIdeaName: string = '';
fileSolutionName: string = '';
fileSituationName: string = '';

FileSituationupdate: string[] = [];
FileSolutionupdate: string[] = [];
FileIdeaupdate: string[] = [];
downloadfileIdea(file: string) {
  this.proposeIdea.getFileIdea(file).subscribe({
    next: (res) => {
      const blob = new Blob([res], { type: 'application/octet-stream' });
      const url = window.URL.createObjectURL(blob);
      
      const a = document.createElement('a');
      a.href = url;
      a.download = file;
      a.style.display = 'none'; // Hide the anchor element
      document.body.appendChild(a);
      
      a.click();
      
      // Cleanup
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    },
    error: (err) => {
      console.error('Export error:', err);
      Swal.fire('Error', 'An error occurred while exporting fileIdea', 'error');
    } });
}
downloadfileSolution(file: string) {
  this.proposeIdea.getFileSolution(file).subscribe({
    next: (res) => {
      const blob = new Blob([res], { type: 'application/octet-stream' });
      const url = window.URL.createObjectURL(blob);
      
      const a = document.createElement('a');
      a.href = url;
      a.download = file;
      a.style.display = 'none'; // Hide the anchor element
      document.body.appendChild(a);
      
      a.click();
      
      // Cleanup
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    },
    error: (err) => {
      console.error('Export error:', err);
      Swal.fire('Error', 'An error occurred while exporting File Solution', 'error');
    }
  });
  
 
}
downloadfileSituation(file: string) {
  this.proposeIdea.getFileSituation(file).subscribe({
    next: (res) => {
      const blob = new Blob([res], { type: 'application/octet-stream' });
      const url = window.URL.createObjectURL(blob);
      
      const a = document.createElement('a');
      a.href = url;
      a.download = file;
      a.style.display = 'none'; // Hide the anchor element
      document.body.appendChild(a);
      
      a.click();
      
      // Cleanup
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    },
    error: (err) => {
      console.error('Export error:', err);
      Swal.fire('Error', 'An error occurred while exporting File Situation', 'error');
    }
  });
  
}
// ------------------------------------------

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



    this.userStore.getIdFromStore().pipe(
      switchMap((val) => {
        const teidFromToken = this.auth.getidFromToken();
        this.Id = val || teidFromToken;
        console.log('teid:', this.Id); 
        if (this.Id) {
          return this.proposeIdea.getAllProposeideaByTeid(this.Id);
        } else {
          return of([]); 
        }
      })
    ).subscribe((res) => {
      this.Ideas = res;
      console.log('ideas:', this.Ideas); 
    });








   this.loadCommittees();

    this.ideaUpdateFrom = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      descriptionSituation: ['', Validators.required],
      descriptionSolution: ['', Validators.required],
      name_Area: ['', Validators.required],
      project_Name: ['', Validators.required],
      name_Machine: ['', Validators.required], 
      userId:this.Id,
      fileSituationPath: [this.FileSituationupdate, Validators.required],
      fileSolutionPath: [this.FileSolutionupdate, Validators.required],
      fileIdeaPath: [this.FileIdeaupdate, Validators.required]
    });


    this.ideaViewFrom = this.fb.group({
      title: ['', Validators.required],
    description: ['', Validators.required],
    descriptionSituation: ['', Validators.required],
    descriptionSolution: ['', Validators.required],
    name_Area: ['', Validators.required],
    project_Name: ['', Validators.required],
    name_Machine: ['', Validators.required],
    name_Impact: ['', Validators.required], 
    commenterDisabled: ['', Validators.required],
    userId:this.Id,
    fileSituationPath: [[]],
    fileSolutionPath: [[]],
    fileIdeaPath: [[]]
    });

    this.ideaSaveForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      descriptionSituation: ['', Validators.required],
      descriptionSolution: ['', Validators.required],
      name_Area: ['', Validators.required],
      project_Name: ['', Validators.required],
      name_Machine: ['', Validators.required],  
      userId:this.Id,
      fileSituationPath: [this.FileSituation, Validators.required],
      fileSolutionPath: [this.FileSolution, Validators.required],
      fileIdeaPath: [this.FileIdea, Validators.required]

    });
      
    }

    loadCommittees(){
      this.loading = true;
      this.proposeIdea.getAllProposeidea().subscribe((data: any) => {
        this.Ideas = data;
        this.loading = false;
        console.log(data);
      });


      this.AreaService.getAllArea().subscribe((res) => {
        this.Areas = res;
      });


      this.ProjetService.getAllProject().subscribe((res) => {
        this.Projects = res;
      });





      this.PlantService.getAllPlant().subscribe((res) => {
        this.plants = res;
      });

      this.TitleService.getAllTitle().subscribe((res) => {
        this.titles = res;
      });
     
      this.DepartementService.getAlldepartement().subscribe((res) => {
        this.departements = res;
      });
  
      this.api.getUsers().subscribe((res) => {
        this.users = res;
      });
  } 
  getAreaName(areaID: any): string {
    const selectedArea = this.Areas.find((area: { id: any; }) => area.id === areaID);
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
      return this.Ideas? this.first === this.Ideas.length - this.rows : true;
  }

  isFirstPage(): boolean {
      return this.Ideas ? this.first === 0 : true;
  }

  DeleteProposeidea(ProjectId: number) {
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
            this.proposeIdea.deleteProposeidea(ProjectId, commenter).subscribe({
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

  updateCommittee(SupervisorId: number, updatedSupervisorData: any) {
  
    if (SupervisorId !== null && this.ideaUpdateFrom.valid) {
            this.SupervisorService.updateSupervisor(SupervisorId, updatedSupervisorData).subscribe({
        next :(response) => {
              Swal.fire('Success', 'Supervisor Updated Successfully', 'success').then((res)=>{
                window.location.reload();
              });
        },
        error : (error) => {
          Swal.fire('Error', 'Error updating Supervisor:', 'error');
  
          this.ideaUpdateFrom.reset();
        
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
  const endIndex = Math.min(startIndex + this.CommitteePerPage, this.Ideas.length);
  return this.Ideas.slice(startIndex, endIndex);
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
  this.Ideas.sort((a:any, b:any) => {
    if (a[columnName] < b[columnName]) return -1 * this.sortDirection;
    if (a[columnName] > b[columnName]) return 1 * this.sortDirection;
    return 0;
  });
}

  
get totalCommittee():number{
  return this.Ideas.length;
}
get totalPagesCommittee(): number {
  return Math.ceil(this.totalCommittee / this.CommitteePerPage);
  
}
 



globalSearch() {
  console.log('Search Term:', this.searchText);
  const searchTerm = this.searchText.toLowerCase();

  console.log('Current Team Leaders:', this.Ideas);

  this.Ideas = this.Ideas.filter((supervisor: any) => {
    if (
      String(supervisor.speciality).toLowerCase().includes(searchTerm) ||
      String(supervisor.teid.fullName).toLowerCase().includes(searchTerm) ||
      String(supervisor.teid.teid).toLowerCase().includes(searchTerm) 
      
    ) {
      return true; 
    }
    return false;
  });

  console.log('Filtered committees:', this.Ideas);
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
 

selectGetSupervisorbyid(id: number) {
  this.UideaId = id;
 
  this.proposeIdea.getProposeideaById(id).subscribe((idea) => {
    this.ideaUpdateFrom.patchValue({
      title: idea.title,
      description: idea.description,
      descriptionSituation: idea.descriptionSituation,
      descriptionSolution: idea.descriptionSolution,
      name_Area: idea.name_Area,
      project_Name: idea.project_Name,
      name_Machine: idea.name_Machine,
      name_Impact: idea.name_Impact,
      userId: idea.userId,
      commenterDisabled:idea.commenterDisabled,
      fileIdeaPath: idea.fileIdeaPath,
      fileSolutionPath: idea.fileSolutionPath,
      fileSituationPath: idea.fileSituationPath
   });
    this.fileIdeaName = idea.fileIdeaPath;
    this.fileSolutionName = idea.fileSolutionPath;
    this.fileSituationName = idea.fileSituationPath;
  });
}
selectView(id: number) {
  this.selectedSupervisorId = id;
  console.log("select view :", this.selectedSupervisorId);
  this.proposeIdea.getProposeideaById(this.selectedSupervisorId).subscribe(
    (idea) => {
      this.ideaViewFrom.patchValue({
        title: idea.title,
        description: idea.description,
        descriptionSituation:idea.descriptionSituation,
        descriptionSolution:idea.descriptionSolution,
        name_Area:idea.name_Area,
        project_Name:idea.project_Name,
        name_Machine:idea.name_Machine,
        userId:idea.userId,
        commenterDisabled:idea.commenterDisabled,
        fileSituationPath:idea.fileSituationPath,
        fileSolutionPath:idea.fileSolutionPath,
        fileIdeaPath:idea.fileIdeaPath

      });

      this.displayViewModal = true;
      this.fileIdeaName = idea.fileIdeaPath;
      this.fileSolutionName = idea.fileSolutionPath;
      this.fileSituationName = idea.fileSituationPath;
    },
    (error) => {
      console.error('Error fetching supervisor:', error);
    }
  );}


isDisabled: boolean = false;

}