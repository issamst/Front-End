import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ApiService } from '../../../../../services/api.service';
import { AuthService } from '../../../../../services/auth.service';
import { TitleServiceService } from '../../../../../services/title-service.service';
import { PlantService } from '../../../../../services/plant.service';
import { DepartementService } from '../../../../../services/departement.service';
import * as XLSX from 'xlsx';
import { HttpClient } from '@angular/common/http';


@Component({
  selector: 'app-plants',
  templateUrl: './plants.component.html',
  styleUrl: './plants.component.css'
})
export class PlantsComponent implements OnInit {

  displayModal: boolean = false;
  displayUpdateModal: boolean = false;
  displayViewModal: boolean = false;

  first = 0;

  rows = 10;
  loading: boolean = true;
  searchValue: string | undefined;
  activityValues: number[] = [0, 100];
  public searchtext: string = '';

  isPlantOverlayOpen: boolean = false;

  searchText: string = ''; 


  sortOrder: string = 'asc';
  plantId: number = 0;
  selectedplant: any = null;
  showUpdateUplantModal: boolean = false;
  editingplantId: number | null = null;
  editPlantForm!: FormGroup;
  PlantForm!: FormGroup;

  UpdatePlant!: FormGroup;
  ViewPlant!: FormGroup;
  currentPageplant: number = 1;

 
  public Plant: any = [];
  plants:any=[];


  currentPage: number = 1;
  plantPerPage: number = 5; // Number of titles to display per page
  public fullName: string = '';
  public role!: string;
  

 


  selectedPlantId: any = null;
  isFormDisabled: boolean = false;



  successMessage!: string;
  isAscendingOrder: boolean = true; // Initially set to true for ascending order
  sortedColumn: string = '';
  sortingColumn: string = '';
  sortingOrder: string = 'asc';
  sortBy: string = '';
  sortDirection: number = 1;
  isimportexportopen: boolean = false;
  showColumns = {
    Building_ID: true,
    SapBuilding_Number: true,
    BU: true,
    Location: true,
    Date_Delete: true,
    Date_Update: true,
    Date_Create: true,
};  
public plantList: any = [];
public departementList: any = [];
columns = ['TE ID', 'Full Name', 'Phone', 'Role', 'Job Title', 'Email', 'Plant', 'Department'];
data = [ ];
  constructor(
    private dialog: MatDialog,
    private api: ApiService,
    private titleService: TitleServiceService,
    private router: Router ,
    
    private departementService :DepartementService,
    private fb: FormBuilder,
    private PlantService:PlantService
  ) {
   
  }

  Export() {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You will export this Plant!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, sure!',
      cancelButtonText: 'No, keep it'
    }).then((result) => {
      if (result.isConfirmed) {
        this.PlantService.getExportPlant().subscribe({
          next: (res) => {
            const blob = new Blob([res], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'Plants.xlsx';
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
          },
          error: (err) => {
            console.error('Export error:', err);
            Swal.fire('Error', 'An error occurred while exporting Plants', 'error');
          }
        });
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire('Cancelled', 'Plant export cancelled', 'info');
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

                    // Call importPlant function from AuthService and pass the file
                    this.PlantService.importPlant(file).subscribe({
                        next: (res) => {
                            // console.log('Import response:', res);
                            // const blob = new Blob([res], { type: 'application/octet-stream' });
                            // const url = window.URL.createObjectURL(blob);
                            // const a = document.createElement('a');
                            // a.href = url;
                            // document.body.appendChild(a);
                            // a.click();
                            // window.URL.revokeObjectURL(url);
                            Swal.fire('Imported!', 'Plant import done!', 'success').then((res)=>{
                              window.location.reload();
                            });
                        },
                        error: (err) => {
                            console.error('Import error:', err);
                            Swal.fire('Error', 'An error occurred while importing Plants', 'error');
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
    XLSX.writeFile(workbook, 'Plant.xlsx');
  }

  toggleDropdown() {
    this.isPlantOverlayOpen = !this.isPlantOverlayOpen;
  }
  importexportopen() {
    this.isimportexportopen = !this.isimportexportopen;
  }
ngOnInit() {
    this.UpdatePlant = this.fb.group({
      buildingID: ['', Validators.required],
      sapBuildingNumber: ['', Validators.required],
      bu: ['', Validators.required],
      location: ['', Validators.required]
    });

    this.ViewPlant = this.fb.group({
      buildingID: [{ value: '', disabled: true }, Validators.required],
      sapBuildingNumber:  [{ value: '', disabled: true }, Validators.required],
      bu:  [{ value: '', disabled: true }, Validators.required],
      location: [{ value: '', disabled: true }, Validators.required],
      commenterDelete:['',Validators.required],
    });

    this.PlantForm = this.fb.group({
      buildingID: ['', Validators.required],
      sapBuildingNumber: ['', Validators.required],
      bu: ['', Validators.required],
      location: ['', Validators.required]
    });

    
   this.loadPlants();

  }


  loadPlants(){
    
    this.loading= true;
    this.PlantService.getAllPlant().subscribe((res) => {
    this.plants = res;
    this.loading = false;
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




clear(dt: any): void {
  dt.clear();
  this.searchText = '';
  this.loadPlants();
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
return this.plants? this.first === this.plants.length - this.rows : true;
}

isFirstPage(): boolean {
return this.plants ? this.first === 0 : true;
}


globalSearch() {
  const searchTerm = this.searchText.toLowerCase();

  this.plants = this.plants.filter((committee: any) => {
    return Object.values(committee).some((value: any) =>
      String(value).toLowerCase().includes(searchTerm)
    );
  });
}

getPercentageChangeYesterday() {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1); // Set the date to yesterday
  
  let signupsYesterday = 0; // Initialize the count for signups yesterday
  
  this.plants.forEach((Plant: Plant) => {
      if (Plant.registerTime) {
          const registrationDate = new Date(Plant.registerTime);
          if (
              registrationDate.getDate() === yesterday.getDate() &&
              registrationDate.getMonth() === yesterday.getMonth() &&
              registrationDate.getFullYear() === yesterday.getFullYear()
          ) {
              // Increment the count if the registration date matches yesterday's date
              signupsYesterday++;
          }
      }
  });
  
  return signupsYesterday;
}

  toggleFormControls() {
    this.isFormDisabled = !this.isFormDisabled;
  }
  setSelectedPlantId(PlantId: string | number) {
    this.selectedPlantId = PlantId;
  }
  

  
  
  changePage(page: number): void {
    this.currentPage = page;
  }




  nextPage(): void {
    if (this.currentPage < this.totalplant) {
      this.currentPage++;
    }
  }

  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }


  
 
  changePageplant(page: number): void {
    this.currentPageplant = page;
  }
  
  nextPageplant(): void {
    if (this.currentPageplant < this.totalPagesplant) {
      this.currentPageplant++;
    }
  }
  
  prevPageplant(): void {
    if (this.currentPageplant > 1) {
      this.currentPageplant--;
    }
  }
  
  
  getDisplayedplant(): any[] {
    const startIndex = (this.currentPageplant - 1) * this.plantPerPage;
    const endIndex = Math.min(startIndex + this.plantPerPage, this.plants.length);
    return this.plants.slice(startIndex, endIndex);
  }
  
  
  get totalplant():number{
    return this.plants.length;
  }
  get totalPagesPlant(): number {
    return Math.ceil(this.totalplant / this.plantPerPage);
   
  }
 
  get totalPagesplant(): number {
    return Math.ceil(this.totalplant / this.plantPerPage);
   
  }
 
  get pagesplant(): number[] {
    const pagesArray = [];
    for (let i = 1; i <= this.totalPagesPlant; i++) {
      pagesArray.push(i);
    }
    return pagesArray;
  }
 
  

  updatePlant(PlantId: number, updatedPlantData: any) {
    
    if (PlantId !== null && this.UpdatePlant.valid) {
           this.PlantService.updatePlant(PlantId, updatedPlantData).subscribe({
        next :(response) => {
              Swal.fire('Success', 'Plant updated successfully:'+response, 'success').then((res)=>{
                window.location.reload();
              });
        },
       error : (error) => {
         Swal.fire('Error', 'Error updating Plant:', 'error');

         this.UpdatePlant.reset();
       
         const modal = document.getElementById("myModal");
         if (modal != null) {
           modal.classList.remove('show');
           modal.style.display = 'none';
         }

                  }
      });
    } else {
      // Handle null PlantId or form validation errors
      console.error('Plant ID is null or form is invalid');
        Swal.fire('Error', 'An error occurred while deleting the Plant', 'error');

      
    }
  }

  openModelUpdate(PlantId: any) {
    this.displayUpdateModal = true;

    this.selectedPlantId = PlantId;  
   
  console.log("selection id :", this.selectedPlantId );
  console.log("Plant  id :", PlantId );
    // Get the modal element
    const modal = document.getElementById("updatePlantModule");
    console.log(PlantId);
    if (modal != null) {
      
        // Set the Plant ID in the modal
        // For example, if you have an input field with id="PlantId" in the modal, you can set its value
        const PlantIdInput = modal.querySelector('#PlantId');
        if (PlantIdInput != null) {
            PlantIdInput.setAttribute('value', PlantId);
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
  
  openModelView(PlantId: any) {
    this.displayViewModal = true;

    this.selectedPlantId = PlantId;  
   
  console.log("selection plant id :", this.selectedPlantId );
  console.log("Plant  id :", PlantId );
    // Get the modal element
    const modal = document.getElementById("ViewPlantModule");
    console.log(PlantId);
    if (modal != null) {
      
        // Set the Plant ID in the modal
        // For example, if you have an input field with id="PlantId" in the modal, you can set its value
        const PlantIdInput = modal.querySelector('#ViewPlantModule');
        if (PlantIdInput != null) {
            PlantIdInput.setAttribute('value', PlantId);
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
  
  openModelImportExcelPlant() {
   
    
    // Get the modal element
    const modal = document.getElementById("ImportExcelPlant");
   
    if (modal != null) {
      
        // Set the Plant ID in the modal
        // For example, if you have an input field with id="PlantId" in the modal, you can set its value
        const PlantIdInput = modal.querySelector('#ImportExcelPlant');
        
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

  const modal = document.getElementById("AddPlant");
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

SavePlant() {
  if (this.PlantForm.valid) { // Check if the signup form is valid
    this.PlantService.savePlant(this.PlantForm.value).subscribe({
      next: (res) => {
        Swal.fire('Done', "Done !!", 'success').then((res)=>{
          window.location.reload();
        });
        // Optionally, you can reset the form after successful signup
        this.PlantForm.reset();
       
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


DeletePlant(PlantId: number) {
  // Assuming you have a confirmation dialog before deleting the Plant
  Swal.fire({
    title: 'Are you sure?',
    text: 'You will not be able to recover this Plant!',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Yes, delete it!',
    cancelButtonText: 'No, keep it'
  }).then((result) => {
    if (result.isConfirmed) {
      // Prompt Plant for commenter before deleting
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
          // If Plant provides a commenter and confirms deletion, send delete request to backend
          const commenter = commenterResult.value;
          this.PlantService.deletePlant(PlantId, commenter).subscribe({
            next: (res) => {
              // Handle success response
              Swal.fire('Deleted!', 'Plant has been deleted.', 'success').then((res)=>{
                window.location.reload();
              })

              // Optionally, you can refresh the Plant list or perform any other action
              
            },
            error: (err) => {
              // Handle error response
              console.error('Error:', err);
              Swal.fire('Error', 'An error occurred while deleting the Plant', 'error');
            }
          });
        }
      });
    } else if (result.dismiss === Swal.DismissReason.cancel) {
      // If Plant cancels deletion, show a message
      Swal.fire('Cancelled', 'Plant deletion cancelled', 'info');
    }
  });
}




selectGetPlantbyid(id: number) {
  this.selectedPlantId = id;
 
  this.PlantService.getPlantById(id).subscribe((plant) => {
    this.UpdatePlant.patchValue({
      buildingID: plant.buildingID,
      sapBuildingNumber: plant.sapBuildingNumber,
      bu: plant.bu,
      location: plant.location,
      commenterDelete:plant.commenterDelete
    });
  });
}
selectView(id: number) {
  this.selectedPlantId = id;
 
  this.PlantService.getPlantById(id).subscribe((plant) => {
    this.ViewPlant.patchValue({
      buildingID: plant.buildingID,
      sapBuildingNumber: plant.sapBuildingNumber,
      bu: plant.bu,
      location: plant.location,
      commenterDelete:plant.commenterDelete
    });
  });
}









// Inside MainDashboardComponent




}
interface Plant {
 
  registerTime: string;
}

