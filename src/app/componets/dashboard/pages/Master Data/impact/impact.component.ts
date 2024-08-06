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
import { ImpactService } from '../../../../../services/impact.service';

  
@Component({
  selector: 'app-impact',
  templateUrl: './impact.component.html',
  styleUrl: './impact.component.css'
})
export class ImpactComponent implements OnInit {

  displayModal: boolean = false;
  displayUpdateModal: boolean = false;
  displayViewModal: boolean = false;  
  first = 0;

  rows = 10;
  loading: boolean = true;
  searchValue: string | undefined;
  activityValues: number[] = [0, 100];
  public searchtext: string = '';

  isImpactOverlayOpen: boolean = false;

  searchText: string = ''; 
  sortOrder: string = 'asc';
  ImpactId: number = 0;
  selectedImpact: any = null;
  showUpdateUplantModal: boolean = false;
  editingImpactId: number | null = null;
  editUserForm!: FormGroup;
  ImpactForm!: FormGroup;
  UpdateImpact!: FormGroup;
  ViewImpact!: FormGroup;
  currentPageImpact: number = 1;

 
  public Impact: any = [];
 
  Impacts:any=[];

  currentPage: number = 1;
  ImpactPerPage: number = 5; // Number of titles to display per page

  // public searchtext: string = '';
 
  

 


  selectedImpactId: any = null;
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
    name_Impact: true,
    description: true,
    date_delete: true,
    date_Update: true,
    date_Create: true,
};  
public DepartementList: any = [];

columns = ['Impact name','Description'];
data = [ ];
  constructor(
   

    private fb: FormBuilder,
    private ImpactService:ImpactService

  ) {
   
  }
  description: any[] = [];
  name_Impact: any[] = [];
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

  onClose(){
    this.isActive =false;
    this.isActiveD =false;
    this.isActiveC =false;
    this.ImpactForm.reset();
    this.name_Impact=[];
    this.description=[];


  }
  onClear(){
    this.isActive =false;
    this.isActiveD =false;
    this.isActiveC =false;
    this.ImpactForm.reset();
    this.UpdateImpact.reset();
    this.name_Impact=[];
    this.description=[];


  }
  Export() {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You will export this impact!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, sure!',
      cancelButtonText: 'No, keep it'
    }).then((result) => {
      if (result.isConfirmed) {
        this.ImpactService.getExportImpact().subscribe({
          next: (res) => {
            const blob = new Blob([res], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'Impact.xlsx';
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
                    this.ImpactService.importImpact(file).subscribe({
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
    this.isImpactOverlayOpen = !this.isImpactOverlayOpen;
  }
  importexportopen() {
    this.isimportexportopen = !this.isimportexportopen;
  }
ngOnInit() {
    this.UpdateImpact = this.fb.group({
      name_Impact: ['', Validators.required],
      description: ['', Validators.required],
    });

    this.ViewImpact = this.fb.group({
      name_Impact: [{ value: '', disabled: true }, Validators.required],
      description: [{ value: '', disabled: true }, Validators.required],
      commenterDelete:['',Validators.required],
    });

    this.ImpactForm = this.fb.group({
      name_Impact: ['', Validators.required],
      description: ['', Validators.required],
    });
    
   this.loadImpact();

  }


  loadImpact(){

     this.loading = true;
      this.ImpactService.getAllImpact().subscribe((res) => {
      this.Impacts = res;
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
    this.Impacts.sort((a:any, b:any) => {
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
  this.loadImpact();
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
return this.Impacts? this.first === this.Impacts.length - this.rows : true;
}

isFirstPage(): boolean {
return this.Impacts ? this.first === 0 : true;
}


globalSearch() {
  const searchTerm = this.searchText.toLowerCase();

  this.Impacts = this.Impacts.filter((impact: any) => {
    return Object.values(impact).some((value: any) =>
      String(value).toLowerCase().includes(searchTerm)
    );
  });
}

  



  
  
changePage(page: number): void {
  this.currentPage = page;
}




  nextPage(): void {
    if (this.currentPage < this.totalImpact) {
      this.currentPage++;
    }
  }

prevPage(): void {
  if (this.currentPage > 1) {
    this.currentPage--;
  }
}


  
 
changePageImpact(page: number): void {
  this.currentPageImpact = page;
}

nextPageImpact(): void {
  if (this.currentPageImpact < this.totalPagesImpact) {
    this.currentPageImpact++;
  }
}
  
prevPageImpact(): void {
  if (this.currentPageImpact > 1) {
    this.currentPageImpact--;
  }
}
  
  
getDisplayedImpact(): any[] {
  const startIndex = (this.currentPageImpact - 1) * this.ImpactPerPage;
  const endIndex = Math.min(startIndex + this.ImpactPerPage, this.Impacts.length);
  return this.Impacts.slice(startIndex, endIndex);
}

  
get totalImpact():number{
  return this.Impacts.length;
}
get totalPagesImpact(): number {
  return Math.ceil(this.totalImpact / this.ImpactPerPage);
  
}
 

 
get pagesImpact(): number[] {
  const pagesArray = [];
  for (let i = 1; i <= this.totalPagesImpact; i++) {
    pagesArray.push(i);
  }
  return pagesArray;
}
 
  

updateImpact(ImpactId: number, updatedImpactData: any) {
  
  if (ImpactId !== null && this.UpdateImpact.valid) {
          this.ImpactService.updateImpact(ImpactId, updatedImpactData).subscribe({
      next :(response) => {
            Swal.fire('Success', 'Plant updated successfully:'+response, 'success').then((res)=>{
              window.location.reload();
            });
      },
      error : (error) => {
        Swal.fire('Error', 'Error updating user:', 'error');

        this.UpdateImpact.reset();
      
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

openModelImpact(ImpactId: any) {
  this.displayUpdateModal = true;

  this.selectedImpactId = ImpactId;  
  
console.log("selection id :", this.selectedImpactId );
console.log("user  id :", ImpactId );
  // Get the modal element
  const modal = document.getElementById("ImpactModule");
  console.log(ImpactId);
  if (modal != null) {
    
      // Set the user ID in the modal
      // For example, if you have an input field with id="userId" in the modal, you can set its value
      const userIdInput = modal.querySelector('#TitleId');
      if (userIdInput != null) {
          userIdInput.setAttribute('value', ImpactId);
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
  
openModelView(ImpactId: any) {
  this.displayViewModal = true;

  this.selectedImpactId = ImpactId;  
  
console.log("selection id :", this.selectedImpactId );
console.log("user  id :", ImpactId );
  // Get the modal element
  const modal = document.getElementById("ViewTitleModule");
  console.log(ImpactId);
  if (modal != null) {
    
      // Set the user ID in the modal
      // For example, if you have an input field with id="userId" in the modal, you can set its value
      const userIdInput = modal.querySelector('#RoleId');
      if (userIdInput != null) {
          userIdInput.setAttribute('value', ImpactId);
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

  const modal = document.getElementById("AddImpact");
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

SaveImpact() {
  if (this.ImpactForm.valid) { // Check if the signup form is valid
    this.ImpactService.saveImpact(this.ImpactForm.value).subscribe({
      next: (res) => {
        Swal.fire('Done', "Done !!", 'success').then((res)=>{
          window.location.reload();
        });
        // Optionally, you can reset the form after successful signup
        this.ImpactForm.reset();
       
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
    Swal.fire('Error', 'Please provide valid impact information', 'warning');
  }
}


DeleteImpact(ImpactId: number) {
 console.log(ImpactId);
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
          this.ImpactService.deleteImpact(ImpactId, commenter).subscribe({
            next: (res) => {
              // Handle success response
              Swal.fire('Deactivate!', 'Role has been deleted.', 'success').then((res)=>{
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






  

 




selectGetImpactbyid(id: number) {
  this.selectedImpactId = id;
 
  this.ImpactService.getImpactById(id).subscribe((Impact) => {
    this.UpdateImpact.patchValue({
      description: Impact.description,
      name_Impact: Impact.name_Impact,
       
  
      commenterDelete:Impact.commenterDelete
    });
    console.log("this.selectedRoleId");
  });
}
selectView(id: number) {
 this.selectedImpactId = id;
 
 this.ImpactService.getImpactById(id).subscribe((Impact) => {
  this.ViewImpact.patchValue({
    description: Impact.description,
    name_Impact: Impact.name_Impact,
     

    commenterDelete:Impact.commenterDelete
 });
 });
}


}