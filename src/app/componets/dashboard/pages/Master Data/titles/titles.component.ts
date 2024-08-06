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
// import { Titleservice } from '../../../../../services/committee.service';
import { AreaService } from '../../../../../services/area.service';

  
  @Component({
    selector: 'app-titles',
    templateUrl: './titles.component.html',
    styleUrl: './titles.component.css'
  })
  export class TitlesComponent implements OnInit {
    displayModal: boolean = false;
    displayUpdateModal: boolean = false;
    displayViewModal: boolean = false;
    first = 0;
    rows = 10;
    loading: boolean = true;
    searchValue: string | undefined;
    activityValues: number[] = [0, 100];
    public searchtext: string = '';
 
    isTitleOverlayOpen: boolean = false;

    searchText: string = ''; 


    sortOrder: string = 'asc';
    TitleId: number = 0;
    selectedTitle: any = null;
    showUpdateUplantModal: boolean = false;
    editingTitleId: number | null = null;
    editUserForm!: FormGroup;
    TitleForm!: FormGroup;
    UpdateTitle!: FormGroup;
    ViewTitle!: FormGroup;
    currentPageTitle: number = 1;
    public Title: any = [];
    Titles:any=[];
    currentPage: number = 1;
    TitlePerPage: number = 5; // Number of titles to display per page
    // public searchtext: string = '';
    selectedTitleId: any = null;
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
      name_Title: true,
      Date_Delete: true,
      Date_Update: true,
      Date_Create: true,
  };  
  public DepartementList: any = [];
  
  columns = ['TE ID', 'Full Name', 'Phone', 'Role', 'Job Title', 'Email', 'Plant', 'Department'];
  data = [ ];
    constructor(
      private fb: FormBuilder,
      private TitleService:TitleServiceService
    ) {
     
    }


    
  toggleDropdown() {
    this.isTitleOverlayOpen = !this.isTitleOverlayOpen;
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
          this.TitleService.getExportTitle().subscribe({
            next: (res) => {
              const blob = new Blob([res], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
              const url = window.URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = 'Titles.xlsx';
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
                      this.TitleService.importTitle(file).subscribe({
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
  
    // toggleDropdown() {
    //   this.isUserOverlayOpen = !this.isUserOverlayOpen;
    // }
    importexportopen() {
      this.isimportexportopen = !this.isimportexportopen;
    }
  ngOnInit() {
      this.UpdateTitle = this.fb.group({
        name_Title: ['', Validators.required],
        
      });
  
      this.ViewTitle = this.fb.group({
        name_Title: [{ value: '', disabled: true }, Validators.required],
        commenterDelete:['',Validators.required],
      });
  
      this.TitleForm = this.fb.group({
        name_Title: ['', Validators.required],
        
      });

this.loadTtitles();
    
    }
  
   loadTtitles(){

      this.loading = true;
      this.TitleService.getAllTitle().subscribe((res) => {
      this.Titles = res;
      this.loading = false; 
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
      this.Titles.sort((a:any, b:any) => {
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
  
    
  
clear(dt: any): void {
  dt.clear();
  this.searchText = '';
  this.loadTtitles();
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
return this.Titles? this.first === this.Titles.length - this.rows : true;
}

isFirstPage(): boolean {
return this.Titles ? this.first === 0 : true;
}


globalSearch() {
  const searchTerm = this.searchText.toLowerCase();

  this.Titles = this.Titles.filter((title: any) => {
    return Object.values(title).some((value: any) =>
      String(value).toLowerCase().includes(searchTerm)
    );
  });
}

    
    
  changePage(page: number): void {
    this.currentPage = page;
  }
  
  

  
    nextPage(): void {
      if (this.currentPage < this.totalTitle) {
        this.currentPage++;
      }
    }
  
  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }
  
  
    
   
  changePageTitle(page: number): void {
    this.currentPageTitle = page;
  }
  
  nextPageTitle(): void {
    if (this.currentPageTitle < this.totalPagesTitle) {
      this.currentPageTitle++;
    }
  }
    
  prevPageTitle(): void {
    if (this.currentPageTitle > 1) {
      this.currentPageTitle--;
    }
  }
    
    
  getDisplayedTitle(): any[] {
    const startIndex = (this.currentPageTitle - 1) * this.TitlePerPage;
    const endIndex = Math.min(startIndex + this.TitlePerPage, this.Titles.length);
    return this.Titles.slice(startIndex, endIndex);
  }
  
    
  get totalTitle():number{
    return this.Titles.length;
  }
  get totalPagesTitle(): number {
    return Math.ceil(this.totalTitle / this.TitlePerPage);
    
  }
   
  
   
  get pagesTitle(): number[] {
    const pagesArray = [];
    for (let i = 1; i <= this.totalPagesTitle; i++) {
      pagesArray.push(i);
    }
    return pagesArray;
  }
   
    
  
  updateTitle(TitleId: number, updatedTitleData: any) {
    
    if (TitleId !== null && this.UpdateTitle.valid) {
            this.TitleService.updateTitle(TitleId, updatedTitleData).subscribe({
        next :(response) => {
              Swal.fire('Success', 'Plant updated successfully:'+response, 'success').then((res)=>{
                window.location.reload();
              });
        },
        error : (error) => {
          Swal.fire('Error', 'Error updating user:', 'error');
  
          this.UpdateTitle.reset();
        
          const modal = document.getElementById("myModal");
          if (modal != null) {
            modal.classList.remove('show');
            modal.style.display = 'none';
          }
  
      }
      });
    } else {
      // Handle null userId or form validation errors
      console.error('Plant ID is null or form is invalid');
        Swal.fire('Error', 'An error occurred while deleting the Plant', 'error');
  
      
    }
  }
  
  openModelTitle(TitleId: any) {
    this.displayUpdateModal = true;

    this.selectedTitleId = TitleId;  
    
  console.log("selection id :", this.selectedTitleId );
  console.log("user  id :", TitleId );
    // Get the modal element
    const modal = document.getElementById("TitleModule");
    console.log(TitleId);
    if (modal != null) {
      
        // Set the user ID in the modal
        // For example, if you have an input field with id="userId" in the modal, you can set its value
        const userIdInput = modal.querySelector('#TitleId');
        if (userIdInput != null) {
            userIdInput.setAttribute('value', TitleId);
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
    
  openModelView(TitleId: any) {
    this.displayViewModal = true;

    this.selectedTitleId = TitleId;  
    
  console.log("selection id :", this.selectedTitleId );
  console.log("user  id :", TitleId );
    // Get the modal element
    const modal = document.getElementById("ViewTitleModule");
    console.log(TitleId);
    if (modal != null) {
      
        // Set the user ID in the modal
        // For example, if you have an input field with id="userId" in the modal, you can set its value
        const userIdInput = modal.querySelector('#RoleId');
        if (userIdInput != null) {
            userIdInput.setAttribute('value', TitleId);
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

    const modal = document.getElementById("AddTitle");
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
  
  SaveTitle() {
    if (this.TitleForm.valid) { // Check if the signup form is valid
      this.TitleService.saveTitle(this.TitleForm.value).subscribe({
        next: (res) => {
          Swal.fire('Done', "Done !!", 'success').then((res)=>{
            window.location.reload();
          });
          // Optionally, you can reset the form after successful signup
          this.TitleForm.reset();
         
          const modal = document.getElementById("myModal");
          if (modal != null) {
            modal.classList.remove('show');
            modal.style.display = 'none';
          }
        },
        error: (err) => {
          console.error('Error:', err);
          Swal.fire('Error', 'An error occurred while itle', 'error');
        },
      });
    } else {
      // Show validation error if the signup form is invalid
      Swal.fire('Error', 'Please provide valid signup information', 'warning');
    }
  }
  
  
  DeleteTitle(TitleId: number) {
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
           
            return null;
          }
  
        }).then((commenterResult) => {
          if (commenterResult.isConfirmed) {
         
            const commenter = commenterResult.value;
            this.TitleService.deleteTitle(TitleId, commenter).subscribe({
              next: (res) => {
                // Handle success response
                Swal.fire('Deleted!', 'Role has been deleted.', 'success').then((res)=>{
                  window.location.reload();
                })
  
                
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
  
  
  
  
  
  
    
  
   
  
  
  
  
  selectGetTitlebyid(id: number) {
    this.selectedTitleId = id;
   
    this.TitleService.getTitleById(id).subscribe((Title) => {
      this.UpdateTitle.patchValue({
        name_Title: Title.name_Title,
       
        commenterDelete:Title.commenterDelete
      });
      console.log("this.selectedRoleId");
    });
  }
  selectView(id: number) {
   this.selectedTitleId = id;
   
   this.TitleService.getTitleById(id).subscribe((Role) => {
    this.ViewTitle.patchValue({
      name_Title: Role.name_Title,
       
      commenterDelete:Role.commenterDelete
   });
   });
  }
  
  
  }