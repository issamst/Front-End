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
import { PlantService } from '../../../../../services/plant.service';
import { DepartementService } from '../../../../../services/departement.service';
import * as XLSX from 'xlsx';


@Component({
  selector: 'app-roles',
  templateUrl: './roles.component.html',
  styleUrl: './roles.component.css'
})
export class RolesComponent  implements OnInit {


  displayModal: boolean = false;
  displayUpdateModal: boolean = false;
  displayViewModal: boolean = false;
  first = 0;

  rows = 10;
  loading: boolean = true;
  searchValue: string | undefined;
  activityValues: number[] = [0, 100];
  public searchtext: string = '';

  isRoleOverlayOpen: boolean = false;

  searchText: string = ''; 


  sortOrder: string = 'asc';
  RoleId: number = 0;
  selectedRole: any = null;
  showUpdateUplantModal: boolean = false;
  editingplantId: number | null = null;
  editUserForm!: FormGroup;
  RoleForm!: FormGroup;
  UpdateRole!: FormGroup;
  ViewRole!: FormGroup;
  currentPageRole: number = 1;

 
  public Role: any = [];
 
  Roles:any=[];

  currentPage: number = 1;
  RolePerPage: number = 5; // Number of Roles to display per page

 
  

 


  selectedRoleId: any = null;
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
    Name_Role: true,
    Date_Delete: true,
    Date_Update: true,
    Date_Create: true,
};  
public DepartementList: any = [];

columns = ['TE ID', 'Full Name', 'Phone', 'Role', 'Job Title', 'Email', 'Plant', 'Department'];
data = [ ];
  constructor(
    

    private fb: FormBuilder,
    private roleService:RoleService

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
        this.roleService.getExportRole().subscribe({
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
                    this.roleService.importRole(file).subscribe({
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
    this.isRoleOverlayOpen = !this.isRoleOverlayOpen;
  }
  importexportopen() {
    this.isimportexportopen = !this.isimportexportopen;
  }
ngOnInit() {

    this.UpdateRole = this.fb.group({
      name_Role: ['', Validators.required],
      
    });

    this.ViewRole = this.fb.group({
      name_Role: [{ value: '', disabled: true }, Validators.required],
      commenterDelete:['',Validators.required],
    });

    this.RoleForm = this.fb.group({
      name_Role: ['', Validators.required],
      
    });

   this.loadRoles();
  
   
  }

  
  loadRoles(){
      this.loading = true;
      this.roleService.getAllRoles().subscribe((res) => {
      this.Roles = res;
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
    this.Roles.sort((a:any, b:any) => {
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
  this.loadRoles();
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
return this.Roles? this.first === this.Roles.length - this.rows : true;
}

isFirstPage(): boolean {
return this.Roles ? this.first === 0 : true;
}


globalSearch() {
  const searchTerm = this.searchText.toLowerCase();

  this.Roles = this.Roles.filter((role: any) => {
    return Object.values(role).some((value: any) =>
      String(value).toLowerCase().includes(searchTerm)
    );
  });
}

  
  
changePage(page: number): void {
  this.currentPage = page;
}




  nextPage(): void {
    if (this.currentPage < this.totalRole) {
      this.currentPage++;
    }
  }

prevPage(): void {
  if (this.currentPage > 1) {
    this.currentPage--;
  }
}


  
 
changePageRole(page: number): void {
  this.currentPageRole = page;
}

nextPageRole(): void {
  if (this.currentPageRole < this.totalPagesRole) {
    this.currentPageRole++;
  }
}
  
prevPageRole(): void {
  if (this.currentPageRole > 1) {
    this.currentPageRole--;
  }
}
  
  
getDisplayedRole(): any[] {
  const startIndex = (this.currentPageRole - 1) * this.RolePerPage;
  const endIndex = Math.min(startIndex + this.RolePerPage, this.Roles.length);
  return this.Roles.slice(startIndex, endIndex);
}

  
get totalRole():number{
  return this.Roles.length;
}
get totalPagesRole(): number {
  return Math.ceil(this.totalRole / this.RolePerPage);
  
}
 

 
get pagesRole(): number[] {
  const pagesArray = [];
  for (let i = 1; i <= this.totalPagesRole; i++) {
    pagesArray.push(i);
  }
  return pagesArray;
}
 
  

updateRole(RoleId: number, updatedRoleData: any) {
  
  if (RoleId !== null && this.UpdateRole.valid) {
          this.roleService.updateRole(RoleId, updatedRoleData).subscribe({
      next :(response) => {
            Swal.fire('Success', 'Plant updated successfully:'+response, 'success').then((res)=>{
              window.location.reload();
            });
      },
      error : (error) => {
        Swal.fire('Error', 'Error updating user:', 'error');

        this.UpdateRole.reset();
      
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

openModelRole(RoleId: any) {
  
  this.displayUpdateModal = true;
 
  this.selectedRoleId = RoleId;  
  
console.log("selection id :", this.selectedRoleId );
console.log("user  id :", RoleId );
  // Get the modal element
  const modal = document.getElementById("RoleModule");
  console.log(RoleId);
  if (modal != null) {
    
      // Set the user ID in the modal
      // For example, if you have an input field with id="userId" in the modal, you can set its value
      const userIdInput = modal.querySelector('#RoleId');
      if (userIdInput != null) {
          userIdInput.setAttribute('value', RoleId);
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
  
openModelView(RoleId: any) {
  this.displayViewModal = true;
  this.selectedRoleId = RoleId;  
  
console.log("selection id :", this.selectedRoleId );
console.log("user  id :", RoleId );
  // Get the modal element
  const modal = document.getElementById("ViewRoleModule");
  console.log(RoleId);
  if (modal != null) {
    
      // Set the user ID in the modal
      // For example, if you have an input field with id="userId" in the modal, you can set its value
      const userIdInput = modal.querySelector('#RoleId');
      if (userIdInput != null) {
          userIdInput.setAttribute('value', RoleId);
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

  const modal = document.getElementById("AddRole");
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

SaveRole() {
  if (this.RoleForm.valid) { // Check if the signup form is valid
    this.roleService.addRole(this.RoleForm.value).subscribe({
      next: (res) => {
        Swal.fire('Done', "Done !!", 'success').then((res)=>{
          window.location.reload();
        });
        // Optionally, you can reset the form after successful signup
        this.RoleForm.reset();
       
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


DeleteRole(RoleId: number) {
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
          this.roleService.deleteRole(RoleId, commenter).subscribe({
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






  

 




selectGetRolebyid(id: number) {
  this.selectedRoleId = id;
 
  this.roleService.getRoleById(id).subscribe((Role) => {
    this.UpdateRole.patchValue({
      name_Role: Role.name_Role,
     
      commenterDelete:Role.commenterDelete
    });
    console.log("this.selectedRoleId");
  });
}
selectView(id: number) {
 this.selectedRoleId = id;
 
 this.roleService.getRoleById(id).subscribe((Role) => {
  this.ViewRole.patchValue({
    name_Role: Role.name_Role,
     
    commenterDelete:Role.commenterDelete
 });
 });
}


}
